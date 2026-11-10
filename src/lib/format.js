export function formatTime(value) {
  if (!value) return "";
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateTime(value) {
  if (!value) return "";
  return new Date(value).toLocaleString();
}

export function getInitials(name) {
  const first = (name || "").trim().charAt(0);
  return first ? first.toUpperCase() : "?";
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return count === 1 ? singular : plural;
}
