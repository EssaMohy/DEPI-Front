import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  authApi,
  clearSession,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  registerUnauthorizedHandler,
  setSession,
  setStoredUser,
  type ApiUser,
} from "../lib/api";
import { LOGIN_PATH } from "../lib/navigation";

export type AuthUser = ApiUser;

export interface RegisterInput {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
}

export interface AuthContextValue {
  /** The currently authenticated user, or null when signed out. */
  user: AuthUser | null;
  /** True once we've finished checking localStorage / `/profile` on boot. */
  isInitializing: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (input: RegisterInput) => Promise<AuthUser>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  /** Resolves with the reset token needed by the reset-password step. */
  verifyOtp: (email: string, otp: string) => Promise<string>;
  resetPassword: (
    email: string,
    resetToken: string,
    password: string,
  ) => Promise<void>;
  /** Patch the cached user (e.g. after a profile/avatar update) without a round trip. */
  updateUser: (user: AuthUser) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
  /**
   * Optional hook so the app can clear other client-side caches (e.g. a
   * React Query `QueryClient`) whenever the user logs out. Not wired up by
   * default since this project doesn't currently use React Query — pass
   * `queryClient.clear` here if/when it's added.
   */
  onLogout?: () => void;
}

export function AuthProvider({ children, onLogout }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const [isInitializing, setIsInitializing] = useState(true);

  const clearClientSession = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const performLogout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch {
      // Best-effort: even if the network call fails we still want to fully
      // sign the user out on this device.
    } finally {
      clearClientSession();
      onLogout?.();
    }
  }, [clearClientSession, onLogout]);

  // Wire the Axios 401 handler to a real logout once, on mount.
  useEffect(() => {
    registerUnauthorizedHandler(() => {
      clearClientSession();
      onLogout?.();
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith(LOGIN_PATH)
      ) {
        window.location.href = LOGIN_PATH;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Restore the session on first load: if a token exists, validate it
  // against the API and hydrate the user; otherwise clear any stale data.
  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const token = getAccessToken();
      if (!token) {
        setIsInitializing(false);
        return;
      }

      try {
        const freshUser = await authApi.me();
        if (!cancelled) {
          setStoredUser(freshUser);
          setUser(freshUser);
        }
      } catch {
        if (!cancelled) {
          clearClientSession();
        }
      } finally {
        if (!cancelled) {
          setIsInitializing(false);
        }
      }
    }

    restoreSession();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authApi.login({ email, password });
    setSession(data.accessToken.token, data.refreshToken, data.user);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const data = await authApi.register(input);
    setSession(data.accessToken.token, data.refreshToken, data.user);
    setUser(data.user);
    return data.user;
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    await authApi.forgotPassword(email);
  }, []);

  const verifyOtp = useCallback(async (email: string, otp: string) => {
    const { resetToken } = await authApi.verifyOtp(email, otp);
    return resetToken;
  }, []);

  const resetPassword = useCallback(
    async (email: string, resetToken: string, password: string) => {
      await authApi.resetPassword({ email, resetToken, password });
    },
    [],
  );

  const updateUser = useCallback((updated: AuthUser) => {
    setStoredUser(updated);
    setUser(updated);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isInitializing,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout: performLogout,
      forgotPassword,
      verifyOtp,
      resetPassword,
      updateUser,
    }),
    [
      user,
      isInitializing,
      login,
      register,
      performLogout,
      forgotPassword,
      verifyOtp,
      resetPassword,
      updateUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
