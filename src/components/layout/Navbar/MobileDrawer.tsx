"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavigationItem } from "@/types/settings";
export function MobileDrawer({ items }: { items: NavigationItem[] }) { const pathname = usePathname(); return <div className="collapse navbar-collapse" id="website-navigation"><nav className="d-lg-none py-3" aria-label="Navigasi seluler">{items.map((item) => item.children?.length ? <details className="border-bottom py-2" key={item.href}><summary className="fw-semibold">{item.label}</summary><div className="d-grid ps-3 pt-2 gap-2">{item.children.map((child) => <Link className={pathname === child.href ? "text-primary fw-semibold" : ""} href={child.href} key={child.href}>{child.label}</Link>)}</div></details> : <Link className={`d-block border-bottom py-2 fw-semibold ${pathname === item.href ? "text-primary" : ""}`} href={item.href} key={item.href}>{item.label}</Link>)}</nav></div>; }
