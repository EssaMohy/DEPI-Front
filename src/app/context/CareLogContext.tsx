import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "../../hooks/useAuth";
import { careLogApi, getApiErrorMessage, type CareLog } from "../../lib/api";

interface CareLogContextValue {
  /** Most recent care log entries, newest first. */
  logs: CareLog[];
  isLoading: boolean;
  error: string | null;
  /** Re-fetch the log list from the server. */
  refresh: () => Promise<void>;
  /**
   * Prepend a locally-known entry immediately after a water/fertilize
   * action, so the Care History page is up to date even if it isn't
   * mounted (or was mounted before the action happened) — no need to
   * wait on a background refetch.
   */
  recordLocalEntry: (entry: Pick<CareLog, "myPlantId" | "type">) => void;
}

const CareLogContext = createContext<CareLogContextValue | null>(null);

export function CareLogProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [logs, setLogs] = useState<CareLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await careLogApi.list({ limit: 50 });
      setLogs(result.data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not load care history."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      refresh();
    } else {
      setLogs([]);
      setError(null);
    }
  }, [isAuthenticated, refresh]);

  const recordLocalEntry = useCallback(
    (entry: Pick<CareLog, "myPlantId" | "type">) => {
      const now = new Date().toISOString();
      setLogs((prev) => [
        {
          // Negative, timestamp-derived id: guaranteed not to collide
          // with a real server id, and easy to spot/replace on refresh.
          id: -Date.now(),
          userId: user?.id ?? 0,
          myPlantId: entry.myPlantId,
          type: entry.type,
          createdAt: now,
          updatedAt: now,
        },
        ...prev,
      ]);
    },
    [user?.id],
  );

  return (
    <CareLogContext.Provider
      value={{ logs, isLoading, error, refresh, recordLocalEntry }}
    >
      {children}
    </CareLogContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCareLogs() {
  const ctx = useContext(CareLogContext);
  if (!ctx) {
    throw new Error("useCareLogs must be used within a <CareLogProvider>");
  }
  return ctx;
}
