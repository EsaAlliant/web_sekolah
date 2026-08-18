import type { WebsiteSettings } from "@/types/settings";
import type { VisitorStats } from "@/services/visitor.service";
import { FooterAbout } from "./FooterAbout";
import { FooterBottom } from "./FooterBottom";
import { FooterLinks } from "./FooterLinks";
import { FooterVisitor } from "./FooterVisitor";
export function Footer({ settings, visitorStats }: { settings: WebsiteSettings; visitorStats: VisitorStats }) { return <footer className="footer-main mt-auto py-5"><div className="container"><div className="row gy-5 align-items-start"><div className="col-md-6 col-xl-3"><FooterAbout settings={settings} /></div><div className="col-6 col-md-3 col-xl-3"><FooterLinks title="Profil Sekolah" links={[{ label: "Profil Sekolah", href: "/about" }, { label: "Galeri", href: "/gallery" }, { label: "Agenda", href: "/agenda" }, { label: "Fasilitas Sekolah", href: "/facilities" }, { label: "Kontak Kami", href: "/contact" }]} /></div><div className="col-6 col-md-3 col-xl-3"><FooterLinks title={settings.footerLinksTitle} links={settings.footerLinks} /></div><div className="col-md-6 col-xl-3"><FooterVisitor stats={visitorStats} /></div></div><FooterBottom settings={settings} /></div></footer>; }
