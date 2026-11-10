import { getPriorityMeta, getStatusMeta } from "../../constants/tickets";

const badgeBase = {
  display: "inline-block",
  padding: "3px 10px",
  borderRadius: 20,
  fontSize: "0.72rem",
  fontWeight: 700,
  textTransform: "capitalize",
  whiteSpace: "nowrap",
};

export function StatusBadge({ status }) {
  const meta = getStatusMeta(status);
  return (
    <span style={{ ...badgeBase, background: meta.color, color: "#fff" }}>
      {meta.label}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const meta = getPriorityMeta(priority);
  if (!meta) return null;
  return (
    <span style={{ ...badgeBase, background: meta.color, color: "#fff" }}>
      {meta.label}
    </span>
  );
}

export function PriorityTag({ priority }) {
  const meta = getPriorityMeta(priority);
  if (!meta) return null;
  return (
    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: meta.color }}>
      ● {meta.label}
    </span>
  );
}
