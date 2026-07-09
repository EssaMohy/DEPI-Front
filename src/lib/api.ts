import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

/**
 * -----------------------------------------------------------------------
 * Config
 * -----------------------------------------------------------------------
 * The backend (plantera-api) is mounted under `/api/v1` (see src/app.ts /
 * src/routes/v1.ts in the API project). Override the base URL by setting
 * VITE_API_BASE_URL in a `.env` file at the project root, e.g.:
 *
 *   VITE_API_BASE_URL=http://localhost:8000/api/v1
 */
const env = (import.meta as unknown as { env?: Record<string, string> }).env;

export const API_BASE_URL =
  env?.VITE_API_URL ?? env?.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

/**
 * -----------------------------------------------------------------------
 * Local storage helpers
 * -----------------------------------------------------------------------
 * All auth state that needs to survive a page refresh lives here. Keeping
 * the read/write logic in one place avoids duplicating storage keys or
 * serialization logic across the app.
 */
const ACCESS_TOKEN_KEY = "plantera_access_token";
const REFRESH_TOKEN_KEY = "plantera_refresh_token";
const USER_KEY = "plantera_user";

export interface ApiUser {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  avatar: string | null;
}

export function getAccessToken(): string | null {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getStoredUser(): ApiUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as ApiUser) : null;
  } catch {
    return null;
  }
}

export function setSession(
  accessToken: string,
  refreshToken: string,
  user: ApiUser,
): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function setStoredUser(user: ApiUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * -----------------------------------------------------------------------
 * Axios instance
 * -----------------------------------------------------------------------
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the Bearer token to every outgoing request.
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.set
      ? config.headers.set("Authorization", `Bearer ${token}`)
      : ((config.headers as Record<string, string>).Authorization =
          `Bearer ${token}`);
  }
  return config;
});

/**
 * The interceptor lives outside React, so it can't call `useAuth()`
 * directly. `AuthProvider` registers a handler here on mount; if a 401
 * comes back for a request that *was* sending a token, we know the
 * session has expired/been revoked and we should force a logout.
 *
 * Requests without a token (login, register, forgot-password, ...) are
 * left alone so that e.g. "invalid credentials" errors are just handled
 * by the calling form instead of triggering a global logout/redirect.
 */
type UnauthorizedHandler = () => void;
let unauthorizedHandler: UnauthorizedHandler | null = null;

export function registerUnauthorizedHandler(handler: UnauthorizedHandler) {
  unauthorizedHandler = handler;
}

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshComplete(newToken: string) {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    const requestHadToken = Boolean(
      (error.config?.headers as Record<string, unknown> | undefined)?.[
        "Authorization"
      ],
    );

    if (status === 401 && requestHadToken && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearSession();
        if (unauthorizedHandler) {
          unauthorizedHandler();
        } else if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
        return Promise.reject(error);
      }

      try {
        const tokens = await authApi.refreshToken(refreshToken);
        setSession(tokens.accessToken, tokens.refreshToken, getStoredUser()!);
        onRefreshComplete(tokens.accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }
        return api(originalRequest);
      } catch {
        clearSession();
        if (unauthorizedHandler) {
          unauthorizedHandler();
        } else if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

/** Extracts a human readable message from a failed API call. */
export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (data?.message) return data.message;
    if (error.message) return error.message;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

/**
 * -----------------------------------------------------------------------
 * Auth API
 * -----------------------------------------------------------------------
 * Thin wrappers around the existing backend endpoints. Every response is
 * wrapped by the API in `{ success, message, data, timestamp }`; these
 * helpers unwrap `data` so callers just get the payload they care about.
 */
interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

/**
 * Shape for paginated LIST endpoints specifically. The backend's
 * `Controller.buildSuccessResponse` special-cases any controller payload
 * shaped like `{ data, meta }`: it hoists both up to the top level of the
 * JSON response instead of nesting them under `data`. So a paginated
 * response is `{ success, message, data: T[], meta, timestamp }` — the
 * array is directly under `data`, and `meta` is a sibling of `data`, NOT
 * `data.meta`. Every list endpoint (`/plants`, `/my-plants`,
 * `/my-plants/care/logs`, ...) needs this type, not `ApiEnvelope<{data,meta}>`.
 */
interface ApiListEnvelope<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: PaginationMeta;
  timestamp: string;
}

interface AccessTokenPayload {
  token: string;
  type: "Bearer";
  expiresIn: number;
}

interface AuthResponsePayload {
  user: ApiUser;
  accessToken: AccessTokenPayload;
  refreshToken: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ResetPasswordPayload {
  email: string;
  resetToken: string;
  password: string;
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    api
      .post<ApiEnvelope<AuthResponsePayload>>("/auth/register", payload)
      .then((res) => res.data.data),

  login: (payload: LoginPayload) =>
    api
      .post<ApiEnvelope<AuthResponsePayload>>("/auth/login", payload)
      .then((res) => res.data.data),

  logout: (refreshToken: string) =>
    api
      .post<ApiEnvelope<Record<string, never>>>("/auth/logout", {
        refreshToken,
      })
      .then((res) => res.data.data),

  forgotPassword: (email: string) =>
    api
      .post<ApiEnvelope<Record<string, never>>>("/auth/forgot-password", {
        email,
      })
      .then((res) => res.data.data),

  verifyOtp: (email: string, otp: string) =>
    api
      .post<ApiEnvelope<{ resetToken: string }>>("/auth/verify-otp", {
        email,
        otp,
      })
      .then((res) => res.data.data),

  resetPassword: (payload: ResetPasswordPayload) =>
    api
      .post<ApiEnvelope<Record<string, never>>>("/auth/reset-password", payload)
      .then((res) => res.data.data),

  /**
   * The backend doesn't currently expose a dedicated `GET /auth/me` route.
   * `GET /profile` is authenticated and returns the current user, so it is
   * used as the "who am I" endpoint for restoring sessions on refresh. See
   * the integration notes for a one-line backend addition that would let
   * this call `/auth/me` instead, if that's preferred.
   *
   * Note: `GET /profile` returns a slightly different shape than
   * login/register (`avatarUrl` + usage stats, no `avatar` field) — it is
   * normalized back into `ApiUser` here so the rest of the app only ever
   * deals with one user shape.
   */
  me: () =>
    api.get<ApiEnvelope<{ user: ProfileData }>>("/profile").then((res) => {
      const { user } = res.data.data;
      return normalizeProfileToUser(user);
    }),

  refreshToken: (refreshToken: string) =>
    api
      .post<ApiEnvelope<{ accessToken: string; refreshToken: string }>>("/auth/refresh", {
        refreshToken,
      })
      .then((res) => res.data.data),
};

/**
 * -----------------------------------------------------------------------
 * Profile API
 * -----------------------------------------------------------------------
 * Backing the Profile / Edit Profile pages. `GET /profile` returns usage
 * stats alongside the user; the mutating endpoints return the plain
 * `UserResource` shape (with `avatar`, not `avatarUrl`).
 */
export interface ProfileData {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  avatarUrl: string | null;
  plantsCount: number;
  wateringCount: number;
  fertilizingCount: number;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

/** Normalizes the `GET /profile` shape (`avatarUrl`) back into `ApiUser`. */
export function normalizeProfileToUser(profile: ProfileData): ApiUser {
  return {
    id: profile.id,
    firstName: profile.firstName,
    lastName: profile.lastName,
    userName: profile.userName,
    email: profile.email,
    avatar: profile.avatarUrl,
  };
}

export const profileApi = {
  get: () =>
    api
      .get<ApiEnvelope<{ user: ProfileData }>>("/profile")
      .then((res) => res.data.data.user),

  update: (payload: UpdateProfilePayload) =>
    api
      .patch<ApiEnvelope<{ user: ApiUser }>>("/profile", payload)
      .then((res) => res.data.data.user),

  changePassword: (payload: ChangePasswordPayload) =>
    api
      .patch<ApiEnvelope<Record<string, never>>>("/profile/password", payload)
      .then((res) => res.data.data),

  getNotificationPreferences: () =>
    api
      .get<ApiEnvelope<{ preferences: NotificationPreferences }>>(
        "/profile/notifications"
      )
      .then((res) => res.data.data.preferences),

  updateNotificationPreferences: (payload: Partial<NotificationPreferences>) =>
    api
      .patch<ApiEnvelope<{ preferences: NotificationPreferences }>>(
        "/profile/notifications",
        payload
      )
      .then((res) => res.data.data.preferences),

  updateAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return api
      .patch<ApiEnvelope<{ user: ApiUser }>>("/profile/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data.data.user);
  },
};

/**
 * -----------------------------------------------------------------------
 * Pagination
 * -----------------------------------------------------------------------
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * -----------------------------------------------------------------------
 * Plants (catalog) API
 * -----------------------------------------------------------------------
 * `GET /plants` — the browsable species catalog. `GET /plants/:id`
 * returns a single catalog entry, unwrapped (no `{ plant }` envelope).
 */
export interface CatalogPlant {
  id: number;
  commonName: string;
  scientificName: string;
  family: string;
  about: string;
  temperature: string;
  light: string;
  water: string;
  whereToGrow: string;
  toxicity: string;
  howToGrow: string;
  category: string[];
  kingdom: string;
  order: string;
  imageUrl: string;
  wateringFrequency: number | null;
  fertilizingFrequency: number | null;
}

export interface PlantListParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export const plantApi = {
  list: (params: PlantListParams = {}) =>
    api
      .get<ApiListEnvelope<CatalogPlant>>("/plants", { params })
      .then((res) => ({ data: res.data.data, meta: res.data.meta })),

  getById: (id: number) =>
    api
      .get<ApiEnvelope<CatalogPlant>>(`/plants/${id}`)
      .then((res) => res.data.data),

  classify: (imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api
      .post<ApiEnvelope<{ recordId: number; status: string }>>(
        '/plants/classify',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      .then((res) => res.data.data);
  },

  diagnose: (imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api
      .post<ApiEnvelope<{ recordId: number; status: string }>>(
        '/plants/diagnose',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      .then((res) => res.data.data);
  },
};

/**
 * -----------------------------------------------------------------------
 * My Plants API
 * -----------------------------------------------------------------------
 * The signed-in user's personal plant collection. Note the route
 * parameter is named `:plantId` on the backend but is actually the
 * `MyPlant` record's own id (not the catalog plant id) — `myPlantId`
 * here for clarity.
 */
export interface MyPlant {
  id: number;
  plant: CatalogPlant;
  imageUrl: string | null;
  wateringFrequency: number | null;
  fertilizingFrequency: number | null;
  nextWatering: string | null;
  nextFertilizing: string | null;
  lastWatered: string | null;
  lastFertilized: string | null;
  createdAt: string;
}

export interface IdentifySuggestion {
  classId: number;
  className: string;
  confidence: number;
  plantId: number | null;
  plantName: string;
  imageUrl: string | null;
}

export interface IdentifyResult {
  recordId: number;
  status: 'identified' | 'suggestions' | 'cannot_identify';
  imageUrl: string;
  myPlant?: MyPlant;
  suggestions: IdentifySuggestion[];
}

export interface MyPlantListParams {
  page?: number;
  limit?: number;
}

export const myPlantApi = {
  list: (params: MyPlantListParams = {}) =>
    api
      .get<ApiListEnvelope<MyPlant>>("/my-plants", { params })
      .then((res) => ({ data: res.data.data, meta: res.data.meta })),

  add: (plantId: number) =>
    api
      .post<ApiEnvelope<{ myPlant: MyPlant }>>("/my-plants", { plantId })
      .then((res) => res.data.data.myPlant),

  remove: (myPlantId: number) =>
    api
      .delete<ApiEnvelope<Record<string, never>>>(`/my-plants/${myPlantId}`)
      .then((res) => res.data.data),

  water: (myPlantId: number) =>
    api
      .post<ApiEnvelope<{ myPlant: MyPlant }>>(`/my-plants/${myPlantId}/water`)
      .then((res) => res.data.data.myPlant),

  fertilize: (myPlantId: number) =>
    api
      .post<ApiEnvelope<{ myPlant: MyPlant }>>(
        `/my-plants/${myPlantId}/fertilize`,
      )
      .then((res) => res.data.data.myPlant),

  identify: (imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api
      .post<ApiEnvelope<IdentifyResult>>(
        '/my-plants/identify',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      .then((res) => res.data.data);
  },

  confirmIdentify: (recordId: number, predictionIndex: number) =>
    api
      .post<ApiEnvelope<{ myPlant: MyPlant }>>('/my-plants/identify/confirm', {
        recordId,
        predictionIndex,
      })
      .then((res) => res.data.data.myPlant),

  diagnose: (myPlantId: number, imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api
      .post<ApiEnvelope<{ recordId: number; status: string }>>(
        `/my-plants/${myPlantId}/diagnose`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      .then((res) => res.data.data);
  },

  getDiagnoses: (myPlantId: number, params: { page?: number; limit?: number } = {}) =>
    api
      .get<ApiListEnvelope<DiagnosticRecord>>(
        `/my-plants/${myPlantId}/diagnoses`,
        { params },
      )
      .then((res) => ({ data: res.data.data, meta: res.data.meta })),

  updateImage: (myPlantId: number, imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api
      .patch<ApiEnvelope<{ myPlant: MyPlant }>>(
        `/my-plants/${myPlantId}/image`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      .then((res) => res.data.data.myPlant);
  },
};

/**
 * -----------------------------------------------------------------------
 * Care logs API
 * -----------------------------------------------------------------------
 * Powers the Care History page. `GET /my-plants/care/logs` returns raw
 * log entries (no nested plant info) — cross-reference `myPlantId`
 * against the collection from `usePlants()` to show a plant's name.
 */
export interface CareLog {
  id: number;
  userId: number;
  myPlantId: number;
  type: "watering" | "fertilizing";
  createdAt: string;
  updatedAt: string;
}

export interface CareLogListParams {
  myPlantId?: number;
  page?: number;
  limit?: number;
}

export const careLogApi = {
  list: (params: CareLogListParams = {}) =>
    api
      .get<ApiListEnvelope<CareLog>>("/my-plants/care/logs", {
        params,
      })
      .then((res) => ({ data: res.data.data, meta: res.data.meta })),
};

/**
 * -----------------------------------------------------------------------
 * Diseases (catalog) API
 * -----------------------------------------------------------------------
 * `GET /diseases` — the browsable disease knowledge base. Only supports
 * an exact `type` filter server-side (no text search), so pages that
 * want to "search" fetch a page and filter client-side.
 * `GET /diseases/:id` returns a single entry, unwrapped like `/plants/:id`.
 */
export interface Disease {
  id: number;
  name: string;
  otherNames: string[];
  type: string | null;
  causes: string | null;
  symptoms: string | null;
  treatment: { steps: string[] } | null;
  description: string | null;
  imageUrl: string | null;
}

export interface DiseaseListParams {
  type?: string;
  page?: number;
  limit?: number;
}

export const diseaseApi = {
  list: (params: DiseaseListParams = {}) =>
    api
      .get<ApiListEnvelope<Disease>>("/diseases", { params })
      .then((res) => ({ data: res.data.data, meta: res.data.meta })),

  getById: (id: number) =>
    api
      .get<ApiEnvelope<Disease>>(`/diseases/${id}`)
      .then((res) => res.data.data),
};

/**
 * -----------------------------------------------------------------------
 * Notifications API
 * -----------------------------------------------------------------------
 * `GET /notifications` — paginated, newest first, no server-side filter
 * beyond pagination. Real `type` values produced by the backend today:
 * `watering_reminder` / `fertilizing_reminder` (from the care-reminder
 * worker, both include `plantId`), and `comment` / `like` (from the
 * community feature, no `plantId`). There's no "mark all as read" or
 * "delete" endpoint — only mark-one-as-read.
 */
export interface Notification {
  id: number;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  plantId: number | null;
  scheduledTime: string | null;
  createdAt: string;
}

export interface NotificationPreferences {
  pushEnabled: boolean;
  wateringReminders: boolean;
  fertilizingReminders: boolean;
  emailNotifications: boolean;
}

export interface NotificationListParams {
  page?: number;
  limit?: number;
}

export const notificationApi = {
  list: (params: NotificationListParams = {}) =>
    api
      .get<ApiListEnvelope<Notification>>("/notifications", { params })
      .then((res) => ({ data: res.data.data, meta: res.data.meta })),

  markAsRead: (id: number) =>
    api
      .patch<ApiEnvelope<Record<string, never>>>(`/notifications/${id}/read`)
      .then((res) => res.data.data),
};

export interface DiagnosticDetection {
  name: string;
  otherNames: string[];
  type: string[];
  causes: string[];
  symptoms: string[];
  treatment: {
    steps: string[];
  } | null;
  description: string;
  imageUrl: string | null;
  instances: Array<{
    bbox: [number, number, number, number];
    confidence: number;
  }>;
}

export interface DiagnosticResult {
  image: string;
  detections: DiagnosticDetection[];
}

export interface DiagnosticRecord {
  id: number;
  type: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  imageUrl: string | null;
  result: DiagnosticResult | null;
  error: string | null;
  plantId: number | null;
  myPlantId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface DiagnosticListParams {
  page?: number;
  limit?: number;
}

export const diagnosticApi = {
  diagnose: (imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api
      .post<ApiEnvelope<DiagnosticResult>>('/diagnostics', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data.data);
  },

  list: (params: DiagnosticListParams = {}) =>
    api
      .get<ApiListEnvelope<DiagnosticRecord>>('/diagnostics', { params })
      .then((res) => ({ data: res.data.data, meta: res.data.meta })),

  getById: (id: number) =>
    api
      .get<ApiEnvelope<DiagnosticRecord>>(`/diagnostics/${id}`)
      .then((res) => res.data.data),
};

export interface Article {
  id: number;
  title: string;
  content: string;
  excerpt: string | null;
  category: string | null;
  imageUrl: string | null;
  published: boolean;
  author: {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  createdAt: string;
}

export const articlesApi = {
  list: (params: { page?: number; limit?: number } = {}) =>
    api
      .get<ApiListEnvelope<Article>>('/articles', { params })
      .then((res) => ({
        data: res.data.data,
        meta: res.data.meta,
      })),

  getById: (id: number) =>
    api
      .get<ApiEnvelope<Article>>(`/articles/${id}`)
      .then((res) => res.data.data),
};

/**
 * -----------------------------------------------------------------------
 * Community Posts API
 * -----------------------------------------------------------------------
 */
export interface Post {
  id: number;
  title: string;
  content: string;
  category: string | null;
  tags: string | null;
  imageUrl: string | null;
  published: boolean;
  author: {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  commentCount: number;
  likesCount: number;
  liked: boolean;
  createdAt: string;
}

export interface PostListParams {
  cursor?: number;
  limit?: number;
}

export const communityApi = {
  list: (params: PostListParams = {}) =>
    api
      .get<ApiListEnvelope<Post>>('/posts', { params })
      .then((res) => ({ data: res.data.data, meta: res.data.meta })),

  getById: (id: number) =>
    api.get<ApiEnvelope<Post>>(`/posts/${id}`).then((res) => res.data.data),

  create: (data: { title: string; content: string; category?: string; tags?: string }, imageFile?: File) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    if (data.category) formData.append('category', data.category);
    if (data.tags) formData.append('tags', data.tags);
    if (imageFile) formData.append('image', imageFile);

    return api
      .post<ApiEnvelope<Post>>('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data.data);
  },

  delete: (id: number) =>
    api.delete<ApiEnvelope<Record<string, never>>>(`/posts/${id}`).then((res) => res.data.data),

  like: (postId: number) =>
    api.post<ApiEnvelope<{ liked: boolean; likesCount: number }>>(`/posts/${postId}/like`).then((res) => res.data.data),

  getLikes: (postId: number) =>
    api.get<ApiListEnvelope<{ id: number; userName: string }>>(`/posts/${postId}/likes`).then((res) => res.data.data),

  addComment: (postId: number, content: string) =>
    api
      .post<ApiEnvelope<unknown>>(`/posts/${postId}/comments`, { content })
      .then((res) => res.data.data),

  getComments: (postId: number, params: { cursor?: number; limit?: number } = {}) =>
    api
      .get<ApiListEnvelope<unknown>>(`/posts/${postId}/comments`, { params })
      .then((res) => ({ data: res.data.data, meta: res.data.meta })),
};
