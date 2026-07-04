import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { notificationApi } from "../lib/api";

const POLL_INTERVAL_MS = 60_000;

/**
 * Lightweight unread-notifications badge count for the navbar bell icon.
 * There's no dedicated "unread count" endpoint on the backend, so this
 * fetches a page of notifications and counts `isRead === false` — fine
 * given the current scale, but would want a real count endpoint if the
 * notification volume grows a lot.
 */
export function useUnreadNotificationsCount() {
  const { isAuthenticated } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      setCount(0);
      return;
    }

    let cancelled = false;

    const fetchCount = () => {
      notificationApi
        .list({ limit: 100 })
        .then((result) => {
          if (!cancelled) {
            setCount(result.data.filter((n) => !n.isRead).length);
          }
        })
        .catch(() => {
          // Silently ignore — a stale/missing badge isn't worth surfacing an error for.
        });
    };

    fetchCount();
    const interval = setInterval(fetchCount, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  return count;
}
