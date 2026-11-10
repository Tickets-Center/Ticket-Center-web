import { http, request } from "./client";

export const technicianApi = {
  getAssignments: () =>
    request(http.get("technician/assignments"), "Failed to load assignments."),
  getAssignment: (id) =>
    request(
      http.get(`technician/assignment/${id}`),
      "Failed to load the assignment.",
    ),
  makeAppointment: (data) =>
    request(
      http.post("technician/appointment", data),
      "Failed to create the appointment.",
    ),
  updateIntervention: (interventionId, data) =>
    request(
      http.post(`technician/${interventionId}/intervention/update`, data),
      "Failed to update the consultation.",
    ),
  completeIntervention: (interventionId, data) =>
    request(
      http.post(`technician/${interventionId}/intervention/complete`, data),
      "Failed to complete the assignment.",
    ),
};
