"use client";
import { createContext, useContext } from "react";
export interface LoadingContextValue { isLoading: boolean; setLoading: (value: boolean) => void; }
export const LoadingContext = createContext<LoadingContextValue | null>(null);
export function useLoadingContext() { const context = useContext(LoadingContext); if (!context) throw new Error("useLoading must be used within LoadingProvider"); return context; }
