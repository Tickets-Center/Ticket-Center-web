// Centralised runtime configuration. Vite exposes only VITE_* variables here.

const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

export const API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_API_BASE_URL || "http://api:8000/api",
);

export const REVERB = {
  key: import.meta.env.VITE_REVERB_APP_KEY || "ticketcenter-key",
  host: import.meta.env.VITE_REVERB_HOST || "striker67.duckdns.org",
  port: import.meta.env.VITE_REVERB_PORT || 8080,
  scheme: import.meta.env.VITE_REVERB_SCHEME || "http",
};
