import { useCallback, useEffect, useRef, useState } from "react";
import { notificationsApi } from "../services/api/notifications";
import { useAuth } from "../features/auth/useAuth";
import echo from "../services/socket/echo";

const normalize = (notification) => ({
  id: notification.id,
  text: notification.message,
  type: notification.type,
  unread: !notification.is_read,
  time: notification.created_at,
  meta: {
    ticketId: notification.related_type?.includes("Ticket")
      ? notification.related_id
      : null,
    ticketTitle: notification.title,
  },
});

function readStored(userId) {
  try {
    const saved = localStorage.getItem(`notifs_${userId}`);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function useNotifications() {
  const { user } = useAuth();
  const userId = user?.id;

  const [notifications, setNotifications] = useState([]);
  const fetchedIds = useRef(new Set());

  // Persist per user.
  useEffect(() => {
    if (!userId) return;
    try {
      localStorage.setItem(`notifs_${userId}`, JSON.stringify(notifications));
    } catch {
      // Storage can be full or disabled; notifications still work in memory.
    }
  }, [notifications, userId]);

  // Load from storage for an instant paint, then refresh from the API.
  useEffect(() => {
    fetchedIds.current = new Set();

    if (!userId) {
      Promise.resolve().then(() => setNotifications([]));
      return undefined;
    }

    let cancelled = false;

    Promise.resolve().then(() => {
      if (!cancelled) setNotifications(readStored(userId));
    });

    notificationsApi
      .getAll()
      .then((data) => {
        if (cancelled) return;
        const items = (data?.data ?? data ?? []).map(normalize);
        items.forEach((item) => fetchedIds.current.add(item.id));
        setNotifications(items);
      })
      .catch(() => {
        // Keep the cached notifications when the network is unavailable.
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Realtime notifications for the current user.
  useEffect(() => {
    if (!userId) return undefined;

    const channelName = `users.${userId}`;
    echo.private(channelName).listen(".notification.sent", (event) => {
      const incoming = normalize(event);
      if (fetchedIds.current.has(incoming.id)) return;
      fetchedIds.current.add(incoming.id);
      setNotifications((prev) => [incoming, ...prev]);
    });

    return () => {
      echo.leave(channelName);
    };
  }, [userId]);

  const unreadCount = notifications.filter((item) => item.unread).length;
  const unreadMessages = notifications.filter(
    (item) => item.unread && item.type === "message",
  );

  const markRead = useCallback(async (id) => {
    await notificationsApi.markRead(id);
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, unread: false } : item,
      ),
    );
  }, []);

  const markAllRead = useCallback(async () => {
    await notificationsApi.markAllRead();
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, unread: false })),
    );
  }, []);

  const clearAll = useCallback(async () => {
    await notificationsApi.clearAll();
    localStorage.removeItem(`notifs_${userId}`);
    setNotifications([]);
    fetchedIds.current = new Set();
  }, [userId]);

  return {
    notifications,
    unreadCount,
    unreadMessages,
    markRead,
    markAllRead,
    clearAll,
  };
}
