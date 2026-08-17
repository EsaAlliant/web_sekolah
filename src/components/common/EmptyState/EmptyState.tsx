import type { ReactNode } from "react";
export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) { return <section className="d-flex min-vh-100 flex-column align-items-center justify-content-center p-4 text-center"><h1 className="h3">{title}</h1><p className="text-muted-strong">{description}</p>{action}</section>; }
