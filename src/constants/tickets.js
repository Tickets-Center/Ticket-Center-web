export const TICKET_STATUS = {
  open: { label: "Open", color: "#6c757d" },
  assigned: { label: "Assigned", color: "#0d6efd" },
  in_progress: { label: "In Progress", color: "#fd7e14" },
  resolved: { label: "Resolved", color: "#198754" },
  closed: { label: "Closed", color: "#343a40" },
};

export const TICKET_STATUS_FILTERS = [
  "all",
  "open",
  "assigned",
  "in_progress",
  "resolved",
  "closed",
];

export const TICKET_PRIORITY = {
  low: { label: "Low", color: "#6c757d" },
  normal: { label: "Normal", color: "#0d6efd" },
  high: { label: "High", color: "#fd7e14" },
  critical: { label: "Critical", color: "#dc3545" },
};

export const TICKET_PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

export const TICKET_PRIORITY_ORDER = {
  critical: 0,
  high: 1,
  normal: 2,
  low: 3,
};

export function getStatusMeta(status) {
  return TICKET_STATUS[status] || { label: status || "Unknown", color: "#6c757d" };
}

export function getPriorityMeta(priority) {
  return TICKET_PRIORITY[priority] || null;
}
