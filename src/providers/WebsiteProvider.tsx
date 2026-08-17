"use client";
import type { ReactNode } from "react";
import { WebsiteContext } from "@/contexts/WebsiteContext";
import { siteConfig } from "@/config/site";
export function WebsiteProvider({ children }: { children: ReactNode }) { return <WebsiteContext.Provider value={siteConfig}>{children}</WebsiteContext.Provider>; }
