// Single source of truth for the persisted authentication session.

import { refreshEchoAuth } from "../services/socket/echo";

export const TOKEN_KEY = "token";
const ROLES_KEY = "roles";
const PERMISSIONS_KEY = "permissions";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveSession(payload) {
  if (!payload) return;

  // The backend historically returned the token under the misspelled key
  // "tokken". Accept both so the fix is backwards compatible.
  const token = payload.token ?? payload.tokken;
  if (token) localStorage.setItem(TOKEN_KEY, token);

  if (payload.roles) {
    localStorage.setItem(ROLES_KEY, JSON.stringify(payload.roles));
  }
  if (payload.permissions) {
    localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(payload.permissions));
  }

  refreshEchoAuth();
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLES_KEY);
  localStorage.removeItem(PERMISSIONS_KEY);
}
