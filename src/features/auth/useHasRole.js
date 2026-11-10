import { useAuth } from "./useAuth";

export function getUserRoles(user) {
  if (!user) return [];
  const roles = Array.isArray(user.roles) ? user.roles : user.role ? [user.role] : [];
  return roles
    .map((role) => (typeof role === "string" ? role : (role?.name ?? "")))
    .filter(Boolean);
}

export function useHasRole(allowedRoles = []) {
  const { user } = useAuth();

  if (allowedRoles.length === 0) return true;

  const userRoles = getUserRoles(user);
  return allowedRoles.some((role) => userRoles.includes(role));
}
