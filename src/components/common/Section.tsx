import type { ReactNode } from "react";
import { Container } from "./Container";
export function Section({ children, className = "" }: { children: ReactNode; className?: string }) { return <section className={`page-section ${className}`.trim()}><Container>{children}</Container></section>; }
