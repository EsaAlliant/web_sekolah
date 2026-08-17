import type { WebsiteSettings } from "@/types/settings";
import { FooterLogo } from "./FooterLogo";
import { FooterSocial } from "./FooterSocial";
export function FooterAbout({ settings }: { settings: WebsiteSettings }) { return <section><FooterLogo settings={settings} /><p className="footer-motto">{settings.motto}</p><h2 className="footer-heading mb-3">Sosial Media</h2><FooterSocial links={settings.socialLinks} /></section>; }
