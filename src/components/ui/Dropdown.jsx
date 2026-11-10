import { useEffect, useRef, useState } from "react";

/**
 * Lightweight dropdown controller. Renders its children as a function so the
 * caller keeps full control over trigger/panel markup:
 *
 *   <Dropdown>
 *     {({ toggle, close, open }) => ( ... )}
 *   </Dropdown>
 *
 * Opening one dropdown automatically closes any other: the outside-click
 * listener fires for the previously open instance.
 */
export default function Dropdown({ children, className = "dropdown-wrapper" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const closeOnOutsideClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className={className} ref={ref}>
      {children({
        open,
        toggle: () => setOpen((current) => !current),
        close: () => setOpen(false),
      })}
    </div>
  );
}
