import type { ReactNode } from "react";
export function Modal({ title, children }: { title: string; children: ReactNode }) { return <div className="card" role="dialog" aria-label={title}><div className="card-header">{title}</div><div className="card-body">{children}</div></div>; }
