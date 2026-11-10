import { http, request } from "./client";

export const ticketsApi = {
  create: (data) => request(http.post("ticket", data), "Failed to create ticket."),
  myTickets: () => request(http.get("my-tickets"), "Failed to load tickets."),
};
