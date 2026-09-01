import { useCallback, useEffect, useState } from "react";

const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("admin_theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("admin_theme", theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }, []);

  return { theme, toggle };
};

export default useTheme;
