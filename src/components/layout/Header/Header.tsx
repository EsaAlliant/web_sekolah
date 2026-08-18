"use client";
import Link from "next/link";
import { useSidebar } from "@/hooks/useSidebar";
import { LogoutButton } from "@/components/directory/LogoutButton";

export function Header({ userEmail, roleLabel }: { userEmail?: string; roleLabel?: string }) {
  const { toggle } = useSidebar();

  return (
    <header className="admin-header border-bottom bg-white p-3 d-flex align-items-center justify-content-between gap-2">
      <div className="d-flex align-items-center flex-shrink-0">
        <button aria-label="Buka menu" className="admin-menu-toggle d-md-none" onClick={toggle} type="button">
          <i aria-hidden="true" className="bi bi-list" />
        </button>
        <span className="ms-2 fw-semibold admin-header-title">Administration</span>
      </div>
      <div className="d-flex align-items-center gap-2 flex-shrink-0">
        <Link className="btn btn-outline-primary btn-sm admin-header-home" href="/" title="Kembali ke Beranda">
          <i aria-hidden="true" className="bi bi-house" />
          <span className="d-none d-sm-inline ms-1">Kembali ke Beranda</span>
        </Link>
        {roleLabel && <span className="staff-tag mb-0 d-none d-sm-inline-block">{roleLabel}</span>}
        {userEmail && <span className="text-muted-strong small d-none d-lg-inline">{userEmail}</span>}
        <LogoutButton />
      </div>
    </header>
  );
}
