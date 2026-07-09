import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "./useAuth";
import { notificationApi } from "../lib/api";

const POLL_INTERVAL_MS = 60_000;

export function useUnreadNotificationsCount() {
  const { isAuthenticated, user } = useAuth();
  const [count, setCount] = useState(0);
  const wsCountRef = useRef(0);
  const pollingCountRef = useRef(0);

  const syncCount = useCallback((wsCount: number, pollingCount: number) => {
    setCount(wsCount + pollingCount);
  }, []);

  const fetchCount = useCallback(() => {
    if (!isAuthenticated) return;

    notificationApi
      .list({ limit: 100 })
      .then((result) => {
        const unreadFromApi = result.data.filter((n) => !n.isRead).length;
        pollingCountRef.current = unreadFromApi;
        syncCount(wsCountRef.current, unreadFromApi);
      })
      .catch(() => {});
  }, [isAuthenticated, syncCount]);

  useEffect(() => {
    if (!isAuthenticated) {
      setCount(0);
      wsCountRef.current = 0;
      pollingCountRef.current = 0;
      return;
    }

    let cancelled = false;
    let wsConnected = false;

    const connectSocket = async () => {
      const { getAccessToken } = await import("../lib/api");
      const { io } = await import("socket.io-client");

      const token = getAccessToken();
      if (!token || cancelled) return;

      const SOCKET_URL = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_BASE_URL?.replace("/api/v1", "") ?? "http://localhost:8000";

      const socket = io(SOCKET_URL, {
        auth: { token },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 3,
      });

      socket.on("connect", () => {
        wsConnected = true;
        console.log("[NotificationCount] WebSocket connected");
      });

      socket.on("notification", () => {
        if (!cancelled) {
          wsCountRef.current += 1;
          syncCount(wsCountRef.current, pollingCountRef.current);
        }
      });

      socket.on("disconnect", () => {
        wsConnected = false;
      });

      return socket;
    };

    let socketPromise = connectSocket();
    fetchCount();
    const interval = setInterval(() => {
      fetchCount();
      wsCountRef.current = 0;
    }, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
      socketPromise.then((socket) => {
        if (socket) socket.disconnect();
      });
    };
  }, [isAuthenticated, user?.id, syncCount, fetchCount]);

  return count;
}