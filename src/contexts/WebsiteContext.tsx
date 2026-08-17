"use client";
import { createContext, useContext } from "react";
import type { WebsiteProfile } from "@/types/website";
export const WebsiteContext = createContext<WebsiteProfile | null>(null);
export function useWebsiteContext() { const context = useContext(WebsiteContext); if (!context) throw new Error("useWebsite must be used within WebsiteProvider"); return context; }
