"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useThemeContext } from "@/contexts/ThemeContext";

// Menggantikan pendekatan lama (document.querySelector + setAttribute)
// yang bentrok dengan pengelolaan node oleh React dan bikin hydration
// error. Di sini atribut data-theme jadi prop React biasa, dikelola state,
// jadi konsisten dengan cara React sendiri melacak DOM.
export function ThemeRootWrapper({ children }: { children: ReactNode }) {
  const { theme } = useThemeContext();
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (theme === "system") {
      setResolvedTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    } else {
      setResolvedTheme(theme);
    }
  }, [theme]);

  return (
    <div className="d-flex min-vh-100 flex-column" data-theme={resolvedTheme} data-theme-root>
      {children}
    </div>
  );
}
