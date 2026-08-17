import { SectionTabs } from "./SectionTabs";

const links = [
  { href: "/news", label: "Berita", icon: "bi-newspaper" },
  { href: "/announcements", label: "Pengumuman", icon: "bi-megaphone" },
];

export function InfoSubNav() {
  return <SectionTabs ariaLabel="Navigasi informasi sekolah" items={links} />;
}
