import { http, request } from "./client";

export const authApi = {
  login: (data) =>
    request(http.post("login", data), "Login failed. Please try again."),
  logout: () => request(http.post("logout"), "Logout failed."),
  me: () => request(http.get("me"), "Could not restore your session."),
  forgotPassword: (email) =>
    request(
      http.post("forgot-password", { email }),
      "Could not send the reset link.",
    ),
  resetPassword: (data) =>
    request(http.post("reset-password", data), "Could not reset your password."),
  register: (data) =>
    request(http.post("register", data), "Registration failed."),
  verifyEmail: (data) =>
    request(http.post("verify-email", data), "Invalid or expired code."),
  resendVerification: (email) =>
    request(
      http.post("resend-verification", { email }),
      "Could not resend the code.",
    ),
};
