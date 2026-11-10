import { useEffect, useState } from "react";

const THEME_KEY = "theme";

export function useTheme() {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem(THEME_KEY) === "dark",
  );

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("dark", isDark);
    html.classList.toggle("light", !isDark);
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark((current) => !current);

  return { isDark, toggleTheme };
}
