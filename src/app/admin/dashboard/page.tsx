import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { canAccessPath, type AdminRole } from "@/lib/permissions";

const editableModules = [
  { label: "Hero (Slide Beranda)", href: "/admin/hero", icon: "bi-images", table: "hero_slides" },
  { label: "Kenapa Memilih Kami", href: "/admin/features", icon: "bi-star", table: "homepage_features" },
  { label: "Sambutan Kepala Sekolah", href: "/admin/principal", icon: "bi-person-badge", table: null },
  { label: "Sejarah", href: "/admin/history", icon: "bi-hourglass-split", table: "history_milestones" },
  { label: "Visi dan Misi", href: "/admin/vision-mission", icon: "bi-flag", table: null },
  { label: "Guru", href: "/admin/teachers", icon: "bi-person-video3", table: "teachers" },
  { label: "Staff", href: "/admin/staff", icon: "bi-people", table: "staff" },
  { label: "Jurusan", href: "/admin/majors", icon: "bi-diagram-3", table: "majors" },
  { label: "Kurikulum & Utilitas", href: "/admin/curriculum", icon: "bi-journal-text", table: null },
  { label: "Agenda", href: "/admin/agenda", icon: "bi-calendar-event", table: "agenda_events" },
  { label: "Galeri", href: "/admin/gallery", icon: "bi-image", table: "gallery_items" },
  { label: "Fasilitas Sekolah", href: "/admin/facilities", icon: "bi-building", table: "facilities" },
  { label: "Berita", href: "/admin/news", icon: "bi-newspaper", table: "news" },
  { label: "Pengumuman", href: "/admin/announcements", icon: "bi-megaphone", table: "announcements" },
  { label: "Testimoni", href: "/admin/testimonials", icon: "bi-quote", table: "testimonials" },
  { label: "FAQ", href: "/admin/faq", icon: "bi-question-circle", table: "faqs" },
  { label: "Download", href: "/admin/downloads", icon: "bi-download", table: "downloads" },
  { label: "Info PPDB", href: "/admin/ppdb-info", icon: "bi-info-circle", table: null },
  { label: "Pendaftar PPDB", href: "/admin/ppdb-submissions", icon: "bi-clipboard-check", table: "ppdb_submissions" },
  { label: "Pengaturan Situs & Logo", href: "/admin/settings", icon: "bi-gear", table: null },
];

export default async function AdminDashboardPage({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { denied } = await searchParams;

  const { data: profile } = await supabase.from("admin_profiles").select("role").eq("id", user!.id).single();
  const role = (profile?.role ?? "super_admin") as AdminRole;
  const visibleModules = editableModules.filter((module) => canAccessPath(role, module.href));

  const counts = await Promise.all(
    visibleModules
      .filter((module) => module.table)
      .map(async (module) => {
        const { count } = await supabase.from(module.table as string).select("*", { count: "exact", head: true });
        return { table: module.table, count: count ?? 0 };
      }),
  );
  const countByTable = Object.fromEntries(counts.map((item) => [item.table, item.count]));

  return (
    <div>
      <h1 className="h4 mb-1">Selamat datang, {user?.email}</h1>
      <p className="text-muted-strong mb-4">Kelola seluruh konten yang tampil di situs sekolah dari sini.</p>

      {denied === "1" && (
        <div className="alert alert-warning py-2 small mb-4" role="alert">
          <i aria-hidden="true" className="bi bi-shield-exclamation" /> Kamu tidak punya akses ke halaman itu.
        </div>
      )}

      <div className="row g-3">
        {visibleModules.map((module) => (
          <div className="col-6 col-md-3" key={module.href}>
            <Link className="admin-module-card" href={module.href}>
              <i aria-hidden="true" className={`bi ${module.icon}`} />
              <strong>{module.label}</strong>
              {module.table ? <span>{countByTable[module.table] ?? 0} data</span> : <span>Konten tunggal</span>}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
