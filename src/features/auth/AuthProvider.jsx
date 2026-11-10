import { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authContext";
import { authApi } from "../../services/api/auth";
import { clearSession, getToken, saveSession } from "../../lib/session";

/**
 * The API returns { user, roles, permissions }. Flatten it into the single
 * user object consumed by the UI.
 */
function mergeUserData(data) {
  if (!data) return null;
  const base = data.user ?? data;
  return {
    ...base,
    roles: data.roles ?? base.roles ?? [],
    permissions: data.permissions ?? base.permissions ?? [],
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(getToken()));

  // Restore the session from the persisted token on first mount.
  useEffect(() => {
    if (!getToken()) return undefined;

    let cancelled = false;

    authApi
      .me()
      .then((data) => {
        if (!cancelled) setUser(mergeUserData(data));
      })
      .catch(() => {
        clearSession();
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login(data) {
        saveSession(data);
        setUser(mergeUserData(data));
      },
      async logout() {
        try {
          await authApi.logout();
        } catch {
          // The local session must be cleared even if the API call fails.
        } finally {
          clearSession();
          setUser(null);
        }
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
