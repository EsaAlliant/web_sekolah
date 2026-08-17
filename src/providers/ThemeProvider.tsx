"use client";
import { useEffect, useState, type ReactNode } from "react";
import { ThemeContext, type Theme } from "@/contexts/ThemeContext";
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => {
    const savedTheme = window.localStorage.getItem("school-theme") as Theme | null;
    if (savedTheme) setTheme(savedTheme);
  }, []);
  useEffect(() => {
    const resolvedTheme = theme === "system" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : theme;
    // Cuma ngurusin colorScheme (buat native form widget) di sini. Atribut
    // data-theme buat styling situs publik sekarang jadi tanggung jawab
    // ThemeRootWrapper (React-managed lewat state), BUKAN dimanipulasi
    // langsung lewat querySelector/setAttribute — itu penyebab hydration
    // error kemarin, karena bentrok sama node yang React kelola sendiri.
    document.documentElement.style.colorScheme = resolvedTheme;
    window.localStorage.setItem("school-theme", theme);
  }, [theme]);
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}
