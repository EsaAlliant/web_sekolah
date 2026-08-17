import type { WebsiteSettings } from "@/types/settings";
export function FooterLogo({ settings }: { settings: WebsiteSettings }) { return <div className="footer-logo mb-4">{settings.logoUrl ? <img alt="" aria-hidden="true" className="footer-logo-img" src={settings.logoUrl} /> : <span aria-hidden="true">LOGO</span>}<span className="visually-hidden">{settings.name}</span></div>; }
