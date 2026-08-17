import Link from "next/link";
import type { NavigationItem } from "@/types/settings";
export function MenuItem({ item, active = false }: { item: NavigationItem; active?: boolean }) { return <Link className={`nav-link ${active ? "active" : ""}`} href={item.href} aria-current={active ? "page" : undefined}>{item.label}</Link>; }
