import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { API_BASE_URL, REVERB } from "../../config/env";

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "reverb",
  key: REVERB.key,
  wsHost: REVERB.host,
  wsPort: REVERB.port,
  wssPort: REVERB.port,
  forceTLS: REVERB.scheme === "https",
  enabledTransports: ["ws"],
  authEndpoint: `${API_BASE_URL}/broadcasting/auth`,
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      Accept: "application/json",
    },
  },
});

export function refreshEchoAuth() {
  const token = localStorage.getItem("token") || "";

  if (echo.connector?.pusher?.config?.auth?.headers) {
    echo.connector.pusher.config.auth.headers.Authorization = `Bearer ${token}`;
  }

  if (echo.options?.auth?.headers) {
    echo.options.auth.headers.Authorization = `Bearer ${token}`;
  }
}

export default echo;
