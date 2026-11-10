export function validateAssignment({ title, priority, leader }) {
  if (!title || !title.trim()) return "Title is required.";
  if (!priority) return "Priority must be selected.";
  if (!leader) return "A leader must be assigned.";
  return null;
}
