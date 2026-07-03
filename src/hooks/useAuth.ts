import { useContext } from "react";
import { AuthContext, type AuthContextValue } from "../context/AuthContext";

/**
 * Access the centralized auth state (user, login/register/logout, ...).
 * Must be used within an <AuthProvider> (mounted once in App.tsx).
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}
