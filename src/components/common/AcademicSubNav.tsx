import { SectionTabs } from "./SectionTabs";

const links = [
  { href: "/academic", label: "Program Keahlian", icon: "bi-mortarboard" },
  { href: "/academic/majors", label: "Jurusan", icon: "bi-diagram-3" },
  { href: "/academic/curriculum", label: "Kurikulum", icon: "bi-journal-text" },
];

export function AcademicSubNav() {
  return <SectionTabs ariaLabel="Navigasi program keahlian" items={links} />;
}
