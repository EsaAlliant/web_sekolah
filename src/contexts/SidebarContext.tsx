"use client";
import { createContext, useContext } from "react";
export interface SidebarContextValue { isOpen: boolean; toggle: () => void; }
export const SidebarContext = createContext<SidebarContextValue | null>(null);
export function useSidebarContext() { const context = useContext(SidebarContext); if (!context) throw new Error("useSidebar must be used within SidebarProvider"); return context; }
