"use client";
import { useEffect } from "react";
import type { NavigationItem } from "@/types/settings";
import { DesktopMenu } from "./DesktopMenu";
import { MobileDrawer } from "./MobileDrawer";
import { NavbarActions } from "./NavbarActions";
export function MainNavbar({ items }: { items: NavigationItem[] }) { useEffect(() => { void import("bootstrap"); }, []); return <nav className="website-navbar navbar navbar-expand-lg sticky-top bg-white" aria-label="Navigasi utama"><div className="container py-2"><button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#website-navigation" aria-controls="website-navigation" aria-expanded="false" aria-label="Buka navigasi"><span className="navbar-toggler-icon" /></button><div className="d-none d-lg-flex flex-grow-1"><DesktopMenu items={items} /></div><NavbarActions /><MobileDrawer items={items} /></div></nav>; }
