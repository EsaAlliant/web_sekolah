import { LogoSettingsForm } from "@/components/directory/LogoSettingsForm";
import { SiteSettingsForm } from "@/components/directory/SiteSettingsForm";
import { createServerClient } from "@/lib/supabase/server";
import { getWebsiteSettings } from "@/services/settings.service";
import type { SocialLinkRow } from "@/types/database";

export default async function AdminSettingsPage() {
  const supabase = await createServerClient();
  const [settings, { data: socialLinksData }] = await Promise.all([
    getWebsiteSettings(),
    supabase.from("social_links").select("*").order("sort_order"),
  ]);

  const socialLinks = ((socialLinksData ?? []) as SocialLinkRow[]).map((row) => ({ id: row.id, label: row.label, href: row.href, icon: row.icon }));

  return (
    <div>
      <h1 className="h4 mb-4">Pengaturan Situs</h1>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="admin-stat-card text-start">
            <h2 className="h6 mb-3">Logo Sekolah</h2>
            <LogoSettingsForm currentLogoUrl={settings.logoUrl} />
            <p className="text-muted-strong small mt-3 mb-0">Format PNG/WebP/SVG, disarankan persegi dengan latar transparan, maksimal 5MB.</p>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="admin-stat-card text-start">
            <SiteSettingsForm settings={settings} socialLinks={socialLinks} />
          </div>
        </div>
      </div>
    </div>
  );
}
