import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { DASHBOARD_PATH } from "../lib/navigation";
import { RouteLoader } from "./RouteLoader";

/**
 * Wrap guest-only routes (Login/Register) with this guard so an already
 * authenticated user gets bounced straight to the dashboard instead of
 * seeing the auth forms again.
 */
export default function GuestRoute() {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return <RouteLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to={DASHBOARD_PATH} replace />;
  }

  return <Outlet />;
}
