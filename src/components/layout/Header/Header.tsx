"use client";
import Link from "next/link";
import { useSidebar } from "@/hooks/useSidebar";
import { LogoutButton } from "@/components/directory/LogoutButton";

export function Header({ userEmail, roleLabel }: { userEmail?: string; roleLabel?: string }) {
  const { toggle } = useSidebar();

  return (
    <header className="border-bottom bg-white p-3 d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center">
        <button aria-label="Buka menu" className="admin-menu-toggle d-md-none" onClick={toggle} type="button">
          <i aria-hidden="true" className="bi bi-list" />
        </button>
        <span className="ms-2 fw-semibold">Administration</span>
      </div>
      <div className="d-flex align-items-center gap-3">
        <Link className="btn btn-outline-primary btn-sm" href="/">
          <i aria-hidden="true" className="bi bi-house" /> Kembali ke Beranda
        </Link>
        {roleLabel && <span className="staff-tag">{roleLabel}</span>}
        {userEmail && <span className="text-muted-strong small d-none d-md-inline">{userEmail}</span>}
        <LogoutButton />
      </div>
    </header>
  );
}
