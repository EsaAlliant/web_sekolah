import { SectionTabs } from "./SectionTabs";

const links = [
  { href: "/about", label: "Profil Sekolah", icon: "bi-building" },
  { href: "/about/principal", label: "Sambutan Kepala Sekolah", icon: "bi-person-badge" },
  { href: "/about/history", label: "Sejarah", icon: "bi-hourglass-split" },
  { href: "/about/vision-mission", label: "Visi dan Misi", icon: "bi-flag" },
];

export function AboutSubNav() {
  return <SectionTabs ariaLabel="Navigasi profil sekolah" items={links} />;
}
