import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Droplets,
  Sprout,
  MessageCircle,
  Heart,
  Check,
  CheckCheck,
  Loader2,
} from "lucide-react";

import {
  notificationApi,
  getApiErrorMessage,
  type Notification,
} from "../../lib/api";

const PAGE_SIZE = 20;

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return "Just now";
  if (diffMs < hour) return `${Math.floor(diffMs / minute)}m ago`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)}h ago`;
  if (diffMs < 2 * day) return "Yesterday";
  if (diffMs < 7 * day) return `${Math.floor(diffMs / day)}d ago`;
  return new Date(iso).toLocaleDateString();
}

function NotificationIcon({ type }: { type: string }) {
  switch (type) {
    case "watering_reminder":
      return <Droplets className="text-blue-600" />;
    case "fertilizing_reminder":
      return <Sprout className="text-emerald-600" />;
    case "comment":
      return <MessageCircle className="text-purple-600" />;
    case "like":
      return <Heart className="text-pink-600" />;
    default:
      return <Bell className="text-gray-500" />;
  }
}

export default function NotificationsPage() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [markingAllRead, setMarkingAllRead] = useState(false);

  const loadPage = useCallback(async (pageToLoad: number, append: boolean) => {
    append ? setIsLoadingMore(true) : setIsLoading(true);
    setError(null);
    try {
      const result = await notificationApi.list({
        page: pageToLoad,
        limit: PAGE_SIZE,
      });
      setNotifications((prev) =>
        append ? [...prev, ...result.data] : result.data,
      );
      setHasMore(pageToLoad < result.meta.totalPages);
      setPage(pageToLoad);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not load notifications."));
    } finally {
      append ? setIsLoadingMore(false) : setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPage(1, false);
  }, [loadPage]);

  const markRead = async (id: number) => {
    // Optimistic update; the backend has no bulk endpoint so each
    // notification is marked individually.
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    try {
      await notificationApi.markAsRead(id);
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Could not mark that notification as read."),
      );
      // Roll back on failure.
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: false } : n)),
      );
    }
  };

  const markAllRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    if (unread.length === 0) return;

    setMarkingAllRead(true);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    const results = await Promise.allSettled(
      unread.map((n) => notificationApi.markAsRead(n.id)),
    );
    const failedIds = unread
      .filter((_, i) => results[i].status === "rejected")
      .map((n) => n.id);

    if (failedIds.length > 0) {
      setNotifications((prev) =>
        prev.map((n) =>
          failedIds.includes(n.id) ? { ...n, isRead: false } : n,
        ),
      );
      setError("Some notifications couldn't be marked as read.");
    }
    setMarkingAllRead(false);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              Notifications
            </h1>
            <p className="text-gray-600 mt-2">
              Stay updated with your plant care
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              disabled={markingAllRead}
              className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
            >
              {markingAllRead ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <CheckCheck size={18} />
              )}
              Mark all as read
            </button>
          )}
        </div>

        {error && (
          <div className="rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm px-5 py-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-sm p-6 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-7 h-7 text-emerald-600 animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-10">
              <Bell className="mx-auto text-gray-300 w-16 h-16" />
              <p className="text-gray-500 mt-3">You're all caught up</p>
            </div>
          ) : (
            <>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-center justify-between p-5 rounded-2xl transition ${
                    notification.isRead ? "bg-gray-50" : "bg-emerald-50"
                  }`}
                >
                  <div className="flex gap-4 items-center min-w-0">
                    <div className="p-3 rounded-xl bg-white shrink-0">
                      <NotificationIcon type={notification.type} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-bold truncate">
                        {notification.title}
                      </h3>
                      <p className="text-gray-600 text-sm truncate">
                        {notification.body}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-400">
                          {relativeTime(notification.createdAt)}
                        </span>
                        {notification.plantId && (
                          <button
                            onClick={() =>
                              navigate(`/plants/${notification.plantId}`)
                            }
                            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                          >
                            View Plant
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {!notification.isRead && (
                    <button
                      onClick={() => markRead(notification.id)}
                      className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition shrink-0"
                      aria-label="Mark as read"
                    >
                      <Check size={18} />
                    </button>
                  )}
                </div>
              ))}

              {hasMore && (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => loadPage(page + 1, true)}
                    disabled={isLoadingMore}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full border font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-60"
                  >
                    {isLoadingMore && (
                      <Loader2 size={16} className="animate-spin" />
                    )}
                    Load more
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
