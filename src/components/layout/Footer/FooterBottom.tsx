import Link from "next/link";
import type { WebsiteSettings } from "@/types/settings";
export function FooterBottom({ settings }: { settings: WebsiteSettings }) { return <div className="footer-bottom border-top border-light border-opacity-25 mt-5 pt-3 d-flex flex-column flex-md-row justify-content-between gap-2 small"><span>© {new Date().getFullYear()} {settings.name}</span><span className="d-flex gap-3"><Link href="/privacy">Privasi</Link><Link href="/terms">Ketentuan</Link></span></div>; }
