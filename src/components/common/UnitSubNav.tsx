import { SectionTabs } from "./SectionTabs";

const links = [
  { href: "/units", label: "Unit Kerja", icon: "bi-diagram-3" },
  { href: "/teachers", label: "Guru", icon: "bi-person-video3" },
  { href: "/staff", label: "Staff", icon: "bi-people" },
];

export function UnitSubNav() {
  return <SectionTabs ariaLabel="Navigasi unit kerja" items={links} />;
}
