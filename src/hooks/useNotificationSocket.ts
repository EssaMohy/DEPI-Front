import { useEffect, useCallback, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { getAccessToken } from "../lib/api";

const SOCKET_URL =
  (import.meta as unknown as { env?: Record<string, string> }).env
    ?.VITE_API_BASE_URL?.replace("/api/v1", "") ?? "http://localhost:8000";

export interface WebSocketNotification {
  type: string;
  title: string;
  body: string;
  plantId: number | null;
  data?: unknown;
}

interface UseNotificationSocketOptions {
  onNotification?: (notification: WebSocketNotification) => void;
}

export function useNotificationSocket(options: UseNotificationSocketOptions = {}) {
  const { onNotification } = options;
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    const token = getAccessToken();
    if (!token) return;

    if (socketRef.current?.connected) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("[WebSocket] Connected to notification server");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("[WebSocket] Disconnected from notification server");
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.warn("[WebSocket] Connection error:", error.message);
      setIsConnected(false);
    });

    socket.on("notification", (data: WebSocketNotification) => {
      console.log("[WebSocket] New notification:", data);
      onNotification?.(data);
    });

    socketRef.current = socket;
  }, [onNotification]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    disconnect,
    reconnect: connect,
  };
}

export function useWebSocketNotifications() {
  const [notifications, setNotifications] = useState<WebSocketNotification[]>(
    []
  );

  const handleNotification = useCallback((notification: WebSocketNotification) => {
    setNotifications((prev) => [notification, ...prev]);
  }, []);

  const { isConnected } = useNotificationSocket({
    onNotification: handleNotification,
  });

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    isConnected,
    clearNotifications,
  };
}