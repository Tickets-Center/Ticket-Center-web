import { getInitials } from "../../lib/format";

/**
 * Initial-based avatar. `background`/`color` default to the nav avatar look,
 * while chat uses the smaller glass variant.
 */
export default function Avatar({
  name,
  size = 40,
  background = "var(--accent)",
  color = "#fff",
  className = "",
  title,
}) {
  return (
    <div
      className={`avatar ${className}`.trim()}
      title={title || name}
      style={{
        width: size,
        height: size,
        minWidth: size,
        background,
        color,
        fontSize: Math.max(10, Math.round(size * 0.36)),
      }}
    >
      {getInitials(name)}
    </div>
  );
}
