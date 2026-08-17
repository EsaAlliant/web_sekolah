import type { ReactNode } from "react";
export function Card({ children }: { children: ReactNode }) { return <div className="card shadow-sm"><div className="card-body">{children}</div></div>; }
