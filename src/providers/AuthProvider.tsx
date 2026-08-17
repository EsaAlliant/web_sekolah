"use client";
import type { ReactNode } from "react";
import { AuthContext } from "@/contexts/AuthContext";
export function AuthProvider({ children }: { children: ReactNode }) { return <AuthContext.Provider value={{ isAuthenticated: false }}>{children}</AuthContext.Provider>; }
