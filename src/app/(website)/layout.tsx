import { RunningAnnouncement } from "@/components/layout/Announcement";
import { Footer } from "@/components/layout/Footer";
import { BackToTop, FloatingAccessibility, FloatingTheme, FloatingWhatsapp } from "@/components/layout/Floating";
import { Navbar } from "@/components/layout/Navbar";
import { SearchModal } from "@/components/layout/Search";
import { ThemeRootWrapper } from "@/components/common/ThemeRootWrapper";
import { Topbar } from "@/components/layout/Topbar";
import { VisitTracker } from "@/components/common/VisitTracker";
import { getWebsiteSettings } from "@/services/settings.service";
import { getVisitorStats } from "@/services/visitor.service";

export default async function WebsiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [settings, visitorStats] = await Promise.all([getWebsiteSettings(), getVisitorStats()]);
  return <ThemeRootWrapper><VisitTracker /><a className="skip-link btn btn-primary" href="#main-content">Lewati ke konten utama</a><RunningAnnouncement items={settings.announcements} /><Topbar settings={settings} /><Navbar settings={settings} /><main className="flex-grow-1" id="main-content" tabIndex={-1}>{children}</main><Footer settings={settings} visitorStats={visitorStats} /><div className="floating-actions" aria-label="Aksi cepat"><FloatingTheme /><FloatingAccessibility /><FloatingWhatsapp href={settings.whatsappUrl} /><BackToTop /></div><SearchModal /></ThemeRootWrapper>;
}
