export interface DashboardNavItem { label: string; href: string; }
export interface DashboardNavGroup { label: string; items: DashboardNavItem[]; }

export const dashboardNavigationGroups: DashboardNavGroup[] = [
  {
    label: "Utama",
    items: [{ label: "Dashboard", href: "/admin/dashboard" }],
  },
  {
    label: "Beranda",
    items: [
      { label: "Hero", href: "/admin/hero" },
      { label: "Kenapa Memilih Kami", href: "/admin/features" },
    ],
  },
  {
    label: "Profil Kami",
    items: [
      { label: "Sambutan Kepala Sekolah", href: "/admin/principal" },
      { label: "Sejarah", href: "/admin/history" },
      { label: "Visi dan Misi", href: "/admin/vision-mission" },
    ],
  },
  {
    label: "Unit Kerja & Program",
    items: [
      { label: "Guru", href: "/admin/teachers" },
      { label: "Staff", href: "/admin/staff" },
      { label: "Jurusan", href: "/admin/majors" },
      { label: "Kurikulum & Utilitas", href: "/admin/curriculum" },
      { label: "Fasilitas Sekolah", href: "/admin/facilities" },
    ],
  },
  {
    label: "Konten",
    items: [
      { label: "Agenda", href: "/admin/agenda" },
      { label: "Galeri", href: "/admin/gallery" },
      { label: "Berita", href: "/admin/news" },
      { label: "Pengumuman", href: "/admin/announcements" },
      { label: "Testimoni", href: "/admin/testimonials" },
      { label: "FAQ", href: "/admin/faq" },
      { label: "Download", href: "/admin/downloads" },
    ],
  },
  {
    label: "PPDB",
    items: [
      { label: "Info PPDB", href: "/admin/ppdb-info" },
      { label: "Pendaftar PPDB", href: "/admin/ppdb-submissions" },
    ],
  },
  {
    label: "Legal",
    items: [
      { label: "Kebijakan Privasi", href: "/admin/legal-privacy" },
      { label: "Ketentuan Penggunaan", href: "/admin/legal-terms" },
    ],
  },
  {
    label: "Sistem",
    items: [
      { label: "Akun Saya", href: "/admin/account" },
      { label: "Pengguna Admin", href: "/admin/users" },
      { label: "Pengaturan", href: "/admin/settings" },
    ],
  },
];

// Dipertahankan untuk kompatibilitas kalau ada bagian lain yang masih pakai daftar datar.
export const dashboardNavigation: DashboardNavItem[] = dashboardNavigationGroups.flatMap((group) => group.items);
