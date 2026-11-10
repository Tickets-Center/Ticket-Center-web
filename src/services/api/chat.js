import { http, request } from "./client";

export const chatApi = {
  getMessages: (ticketId) =>
    request(http.get(`messages/${ticketId}`), "Failed to load messages."),
  sendMessage: (ticketId, message) =>
    request(
      http.post(`messages/${ticketId}`, { message }),
      "Failed to send the message.",
    ),
};
