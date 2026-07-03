export const DASHBOARD_PATH = "/dashboard";
export const LOGIN_PATH = "/auth/login";
export const LANDING_PATH = "/";

/**
 * Single source of truth for the "Get Started" button behaviour used
 * across the landing page (Navbar, Hero, CTA, ...). Never navigate
 * directly to the dashboard from these buttons — always resolve the
 * destination through this helper so the rule only lives in one place.
 */
export function resolveGetStartedPath(isAuthenticated: boolean): string {
  return isAuthenticated ? DASHBOARD_PATH : LOGIN_PATH;
}
