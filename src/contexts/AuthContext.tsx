"use client";
import { createContext, useContext } from "react";
export interface AuthContextValue { isAuthenticated: boolean; }
export const AuthContext = createContext<AuthContextValue | null>(null);
export function useAuthContext() { const context = useContext(AuthContext); if (!context) throw new Error("useAuth must be used within AuthProvider"); return context; }
