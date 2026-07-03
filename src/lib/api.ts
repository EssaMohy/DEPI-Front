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
  env?.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

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

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const requestHadToken = Boolean(
      (error.config?.headers as Record<string, unknown> | undefined)?.[
        "Authorization"
      ],
    );

    if (status === 401 && requestHadToken) {
      clearSession();
      if (unauthorizedHandler) {
        unauthorizedHandler();
      } else if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
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
