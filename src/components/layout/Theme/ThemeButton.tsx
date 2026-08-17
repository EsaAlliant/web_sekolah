"use client";
import type { Theme } from "@/contexts/ThemeContext";
import { useTheme } from "@/hooks/useTheme";
export function ThemeButton({ theme, label, icon }: { theme: Theme; label: string; icon: string }) { const { setTheme } = useTheme(); return <button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => setTheme(theme)} aria-label={label}><i className={`bi ${icon}`} aria-hidden="true" /></button>; }
