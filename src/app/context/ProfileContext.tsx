import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "../../hooks/useAuth";
import {
  profileApi,
  getApiErrorMessage,
  type ProfileData,
} from "../../lib/api";

type CountKey = "plantsCount" | "wateringCount" | "fertilizingCount";

interface ProfileContextValue {
  /** The signed-in user's profile, including usage counters. */
  profile: ProfileData | null;
  isLoading: boolean;
  error: string | null;
  /** Re-fetch the profile (counters included) from the server. */
  refresh: () => Promise<void>;
  /**
   * Nudge one or more counters by a delta without a round trip. Other
   * parts of the app (e.g. the dashboard) call this right after a
   * successful action so the Profile page reflects it immediately,
   * whether or not it happens to be mounted at the time.
   */
  adjustCounts: (delta: Partial<Record<CountKey, number>>) => void;
  /** Merge a partial edit (name, avatar, ...) into the shared profile. */
  applyUpdate: (patch: Partial<ProfileData>) => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await profileApi.get();
      setProfile(data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not load your profile."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load once signed in; clear on sign-out so stale counts never leak
  // into the next session.
  useEffect(() => {
    if (isAuthenticated) {
      refresh();
    } else {
      setProfile(null);
      setError(null);
    }
  }, [isAuthenticated, refresh]);

  const adjustCounts = useCallback(
    (delta: Partial<Record<CountKey, number>>) => {
      setProfile((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          plantsCount: prev.plantsCount + (delta.plantsCount ?? 0),
          wateringCount: prev.wateringCount + (delta.wateringCount ?? 0),
          fertilizingCount:
            prev.fertilizingCount + (delta.fertilizingCount ?? 0),
        };
      });
    },
    [],
  );

  /**
   * Merge a partial update (e.g. a new name or avatar from the Edit
   * Profile page) into the shared profile immediately, so every screen
   * reading from this context — not just the one that made the edit —
   * reflects it right away.
   */
  const applyUpdate = useCallback((patch: Partial<ProfileData>) => {
    setProfile((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  return (
    <ProfileContext.Provider
      value={{ profile, isLoading, error, refresh, adjustCounts, applyUpdate }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile must be used within a <ProfileProvider>");
  }
  return ctx;
}
