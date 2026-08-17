"use client";
import type { ReactNode } from "react";
import { AuthProvider } from "./AuthProvider";
import { LoadingProvider } from "./LoadingProvider";
import { SidebarProvider } from "./SidebarProvider";
import { ThemeProvider } from "./ThemeProvider";
import { WebsiteProvider } from "./WebsiteProvider";
export function AppProviders({ children }: { children: ReactNode }) { return <ThemeProvider><WebsiteProvider><AuthProvider><LoadingProvider><SidebarProvider>{children}</SidebarProvider></LoadingProvider></AuthProvider></WebsiteProvider></ThemeProvider>; }
