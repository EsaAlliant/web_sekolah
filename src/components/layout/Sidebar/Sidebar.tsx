"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardNavigationGroups } from "@/config/dashboard";
import { useSidebar } from "@/hooks/useSidebar";
import { canAccessPath, type AdminRole } from "@/lib/permissions";

export function Sidebar({ role }: { role: AdminRole }) {
  const { isOpen } = useSidebar();
  const pathname = usePathname();

  const visibleGroups = dashboardNavigationGroups
    .map((group) => ({ ...group, items: group.items.filter((item) => canAccessPath(role, item.href)) }))
    .filter((group) => group.items.length > 0);

  return (
    <aside className={`admin-sidebar ${isOpen ? "is-open" : ""}`}>
      <span className="admin-sidebar-brand">Admin Sekolah</span>
      {visibleGroups.map((group) => (
        <div className="admin-sidebar-group" key={group.label}>
          <span className="admin-sidebar-group-label">{group.label}</span>
          {group.items.map((item) => (
            <Link className={pathname === item.href ? "is-active" : ""} href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      ))}
    </aside>
  );
}
