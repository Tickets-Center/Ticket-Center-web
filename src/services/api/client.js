import axios from "axios";
import { API_BASE_URL } from "../../config/env";
import { getToken } from "../../lib/session";
import { normalizeApiError } from "../../lib/apiError";

export const http = axios.create({
  baseURL: `${API_BASE_URL}/`,
});

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message;

    if (message === "User does not have the right roles.") {
      window.location.href = "/unauthorized";
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

/**
 * Unwraps an axios response and converts failures into a normalised error.
 * Every API module should use this instead of repeating try/catch blocks.
 */
export async function request(promise, fallback) {
  try {
    const response = await promise;
    return response.data;
  } catch (error) {
    throw normalizeApiError(error, fallback);
  }
}
