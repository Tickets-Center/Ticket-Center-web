import { http, request } from "./client";

export const managerApi = {
  getTickets: () => request(http.get("manager/ticket"), "Failed to load tickets."),
  getTicket: (id) =>
    request(http.get(`manager/ticket/${id}`), "Failed to load the ticket."),
  getTechnicians: () =>
    request(http.get("manager/technicians"), "Failed to load technicians."),
  createAssignment: (ticketId, data) =>
    request(
      http.post(`manager/ticket/${ticketId}/assign`, data),
      "Failed to assign the ticket.",
    ),
  updateAssignment: (ticketId, data) =>
    request(
      http.put(`manager/assignments/${ticketId}`, data),
      "Failed to update the assignment.",
    ),
  getProgress: (ticketId) =>
    request(
      http.get(`manager/ticket/${ticketId}/progress`),
      "Failed to load ticket progress.",
    ),
};
