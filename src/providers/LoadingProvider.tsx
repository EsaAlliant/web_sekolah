"use client";
import { useState, type ReactNode } from "react";
import { LoadingContext } from "@/contexts/LoadingContext";
export function LoadingProvider({ children }: { children: ReactNode }) { const [isLoading, setLoading] = useState(false); return <LoadingContext.Provider value={{ isLoading, setLoading }}>{children}</LoadingContext.Provider>; }
