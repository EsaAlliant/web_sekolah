import { createServerClient } from "@/lib/supabase/server";
import type {
  AnnouncementTickerRow,
  NavigationItemRow,
  SocialLinkRow,
  WebsiteSettingsRow,
} from "@/types/database";
import type { NavigationItem, WebsiteSettings } from "@/types/settings";

const fallbackIdentity: Omit<WebsiteSettings, "navigation" | "socialLinks" | "announcements" | "visitorStats"> = {
  name: "SMK Negeri Nusantara",
  shortName: "SMKN Nusantara",
  description: "Sekolah menengah kejuruan yang menyiapkan generasi berkarakter, kompeten, dan berdaya saing.",
  motto: "Berkarakter, Kompeten, Berdaya Saing",
  logoText: "SN",
  phone: "(021) 555 0123",
  email: "info@smknnusantara.sch.id",
  address: "Jl. Pendidikan No. 10, Jakarta, Indonesia",
  officeHours: "Senin–Jumat, 07.00–16.00 WIB",
  mapUrl: "https://maps.google.com",
  whatsappUrl: "https://wa.me/6280000000000",
  ppdbSheetWebhookUrl: "",
  theme: "system",
  accreditation: "A (Unggul)",
  foundedYear: "1998",
};

function buildNavigationTree(rows: NavigationItemRow[]): NavigationItem[] {
  const topLevel = rows.filter((row) => !row.parent_id).sort((a, b) => a.sort_order - b.sort_order);

  return topLevel.map((row) => {
    const children = rows
      .filter((child) => child.parent_id === row.id)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((child) => ({ label: child.label, href: child.href }));

    return { label: row.label, href: row.href, ...(children.length > 0 ? { children } : {}) };
  });
}

export async function getWebsiteSettings(): Promise<WebsiteSettings> {
  const supabase = await createServerClient();

  const [
    { data: settingsRow, error: settingsError },
    { data: navRows, error: navError },
    { data: socialRows, error: socialError },
    { data: tickerRows, error: tickerError },
  ] = await Promise.all([
    supabase.from("website_settings").select("*").eq("id", 1).single(),
    supabase.from("navigation_items").select("*"),
    supabase.from("social_links").select("*").order("sort_order"),
    supabase.from("announcement_ticker").select("*").order("sort_order"),
  ]);

  if (settingsError) console.error("getWebsiteSettings (identity) error:", settingsError.message);
  if (navError) console.error("getWebsiteSettings (navigation) error:", navError.message);
  if (socialError) console.error("getWebsiteSettings (social) error:", socialError.message);
  if (tickerError) console.error("getWebsiteSettings (ticker) error:", tickerError.message);

  const identity = settingsRow ? mapIdentity(settingsRow as WebsiteSettingsRow) : fallbackIdentity;
  const navigation = navRows ? buildNavigationTree(navRows as NavigationItemRow[]) : [];
  const socialLinks = (socialRows as SocialLinkRow[] | null)?.map((row) => ({ label: row.label, href: row.href, icon: row.icon })) ?? [];
  const announcements = (tickerRows as AnnouncementTickerRow[] | null)?.map((row) => row.message) ?? [];

  return {
    ...identity,
    navigation,
    socialLinks,
    announcements,
    // visitorStats sengaja tidak diisi dari sini — statistik pengunjung
    // real-time ditangani terpisah lewat services/visitor.service.ts
    // (tabel page_visits + Supabase Realtime), bukan lewat tabel ini.
    visitorStats: { today: "0", month: "0", year: "0", total: "0" },
  };
}

function mapIdentity(row: WebsiteSettingsRow) {
  return {
    name: row.name,
    shortName: row.short_name,
    description: row.description ?? "",
    motto: row.motto ?? "",
    logoText: row.logo_text ?? "SN",
    phone: row.phone ?? "",
    email: row.email ?? "",
    address: row.address ?? "",
    officeHours: row.office_hours ?? "",
    mapUrl: row.map_url ?? "",
    whatsappUrl: row.whatsapp_url ?? "",
    ppdbSheetWebhookUrl: row.ppdb_sheet_webhook_url ?? "",
    theme: row.theme,
    accreditation: row.accreditation ?? "",
    foundedYear: row.founded_year ?? "",
    logoUrl: row.logo_url ?? undefined,
  };
}

export async function getSettings() {
  const settings = await getWebsiteSettings();
  return { theme: settings.theme };
}
