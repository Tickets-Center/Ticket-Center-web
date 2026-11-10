export const ROLE_COLORS = {
  admin: { bg: "#7c3aed", label: "Admin" },
  manager: { bg: "#0d6efd", label: "Manager" },
  technician: { bg: "#fd7e14", label: "Technician" },
  employee: { bg: "#6c757d", label: "Employee" },
  default: { bg: "#343a40", label: "Default" },
};

export function getRoleMeta(role) {
  return ROLE_COLORS[role] || ROLE_COLORS.default;
}
