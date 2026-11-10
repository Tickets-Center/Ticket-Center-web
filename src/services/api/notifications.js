import { http, request } from "./client";

export const notificationsApi = {
  getAll: () => request(http.get("notifications"), "Failed to load notifications."),
  markRead: (id) =>
    request(http.patch(`notifications/${id}/read`), "Failed to update notification."),
  markAllRead: () =>
    request(http.patch("notifications/read-all"), "Failed to update notifications."),
  clearAll: () =>
    request(http.delete("notifications"), "Failed to clear notifications."),
};
