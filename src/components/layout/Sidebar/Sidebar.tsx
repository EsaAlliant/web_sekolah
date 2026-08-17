"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardNavigationGroups } from "@/config/dashboard";
import { useSidebar } from "@/hooks/useSidebar";
import { canAccessPath, type AdminRole } from "@/lib/permissions";

export function Sidebar({ role }: { role: AdminRole }) {
  const { isOpen, close } = useSidebar();
  const pathname = usePathname();

  const visibleGroups = dashboardNavigationGroups
    .map((group) => ({ ...group, items: group.items.filter((item) => canAccessPath(role, item.href)) }))
    .filter((group) => group.items.length > 0);

  // Sidebar-nya numpuk di atas konten kalau lagi dibuka di mobile —
  // otomatis nutup begitu pindah halaman, jadi orang nggak nyangka
  // sidebar-nya "nyangkut" kebuka terus.
  useEffect(() => {
    close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Kunci scroll body di belakang sidebar selama overlay-nya kebuka di
  // mobile, biar nggak ada scroll ganda di belakang layar.
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  return (
    <>
      <button
        aria-hidden="true"
        className={`admin-sidebar-backdrop d-md-none ${isOpen ? "is-open" : ""}`}
        onClick={close}
        tabIndex={-1}
        type="button"
      />
      <aside className={`admin-sidebar ${isOpen ? "is-open" : ""}`}>
        <div className="admin-sidebar-header">
          <span className="admin-sidebar-brand">Admin Sekolah</span>
          <button
            aria-label="Tutup menu"
            className="admin-sidebar-close d-md-none"
            onClick={close}
            type="button"
          >
            <i aria-hidden="true" className="bi bi-x-lg" />
          </button>
        </div>
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
    </>
  );
}
