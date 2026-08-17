import Link from "next/link";
import type { WebsiteSettings } from "@/types/settings";

export function NavbarLogo({ settings }: { settings: WebsiteSettings }) {
  return <Link className="reference-brand text-decoration-none" href="/" aria-label={`${settings.name}, beranda`}>{settings.logoUrl ? <img alt="" aria-hidden="true" className="reference-brand-mark-img" src={settings.logoUrl} /> : <span className="reference-brand-mark" aria-hidden="true">LOGO</span>}<span className="reference-brand-name"><strong>{settings.name}</strong><small>{settings.motto}</small></span></Link>;
}
