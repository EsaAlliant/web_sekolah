"use client";
import { useTheme } from "@/hooks/useTheme";
export function ThemeSwitcher() { const { theme, setTheme } = useTheme(); const nextTheme = theme === "light" ? "dark" : "light"; const label = theme === "dark" ? "Gunakan mode terang" : "Gunakan mode gelap"; return <button className="theme-switcher btn btn-sm btn-outline-secondary" type="button" onClick={() => setTheme(nextTheme)} aria-label={label} title={label}><i className={`bi ${theme === "dark" ? "bi-sun" : "bi-moon-stars"}`} aria-hidden="true" /></button>; }
