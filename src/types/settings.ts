import type { FooterLink } from "./footer";

export type ThemePreference = "light" | "dark" | "system";

export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

export interface SocialLink { label: string; href: string; icon: string; }

export interface WebsiteSettings {
  name: string;
  shortName: string;
  description: string;
  motto: string;
  logoText: string;
  phone: string;
  email: string;
  address: string;
  officeHours: string;
  mapUrl: string;
  whatsappUrl: string;
  ppdbSheetWebhookUrl: string;
  theme: ThemePreference;
  accreditation: string;
  foundedYear: string;
  logoUrl?: string;
  navigation: NavigationItem[];
  socialLinks: SocialLink[];
  footerLinksTitle: string;
  footerLinks: FooterLink[];
  announcements: string[];
  visitorStats: { today: string; month: string; year: string; total: string };
}
