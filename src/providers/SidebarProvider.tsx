"use client";
import { useState, type ReactNode } from "react";
import { SidebarContext } from "@/contexts/SidebarContext";
export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <SidebarContext.Provider
      value={{ isOpen, toggle: () => setIsOpen((value) => !value), close: () => setIsOpen(false) }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
