"use client";
import { usePathname } from "next/navigation";
import type { NavigationItem } from "@/types/settings";
import { MenuGroup } from "./MenuGroup";
export function DesktopMenu({ items }: { items: NavigationItem[] }) { const pathname = usePathname(); return <div className="navbar-nav mx-auto gap-xl-1">{items.map((item) => <MenuGroup item={item} active={pathname === item.href || Boolean(item.children?.some((child) => pathname.startsWith(child.href)))} key={item.href} />)}</div>; }
