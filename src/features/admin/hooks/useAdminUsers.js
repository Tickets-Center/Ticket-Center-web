import { useCallback } from "react";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { adminApi } from "../../../services/api/admin";

const normaliseRole = (role) =>
  !role || role === "none" ? "default" : role;

const toArray = (payload) =>
  Array.isArray(payload) ? payload : (payload?.data ?? []);

const withRole = (user) => ({ ...user, role: normaliseRole(user.role) });

export function useAdminUsers() {
  const loader = useCallback(async () => {
    const [users, roles] = await Promise.all([
      adminApi.getUsers(),
      adminApi.getRoles(),
    ]);

    return {
      users: toArray(users).map(withRole),
      roles: toArray(roles),
    };
  }, []);

  const { data, loading, error, setData } = useAsyncData(
    loader,
    [],
    "Failed to load users. Make sure you have the admin role.",
  );

  const users = data?.users ?? [];
  const roles = data?.roles ?? [];

  const updateRole = async (userId, role) => {
    const response = await adminApi.updateRole(userId, role);
    const updated = withRole(response?.user ?? response ?? { id: userId, role });

    setData((previous) =>
      previous
        ? {
            ...previous,
            users: previous.users.map((user) =>
              user.id === updated.id ? { ...user, ...updated } : user,
            ),
          }
        : previous,
    );

    return updated;
  };

  const removeUser = async (userId) => {
    await adminApi.deleteUser(userId);
    setData((previous) =>
      previous
        ? {
            ...previous,
            users: previous.users.filter((user) => user.id !== userId),
          }
        : previous,
    );
  };

  return { users, roles, loading, error, updateRole, removeUser };
}
