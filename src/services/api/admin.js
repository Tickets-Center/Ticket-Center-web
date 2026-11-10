import { http, request } from "./client";

export const adminApi = {
  getUsers: () => request(http.get("admin/users"), "Failed to load users."),
  getRoles: () => request(http.get("admin/roles"), "Failed to load roles."),
  updateRole: (userId, role) =>
    request(
      http.patch(`admin/users/${userId}/role`, { role }),
      "Failed to update the role.",
    ),
  deleteUser: (userId) =>
    request(http.delete(`admin/users/${userId}`), "Delete failed."),
};
