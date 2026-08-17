import { SectionTabs } from "./SectionTabs";

const links = [
  { href: "/links", label: "Tautan", icon: "bi-link-45deg" },
  { href: "/downloads", label: "Download", icon: "bi-download" },
  { href: "/faq", label: "FAQ", icon: "bi-question-circle" },
];

export function LinksSubNav() {
  return <SectionTabs ariaLabel="Navigasi tautan" items={links} />;
}
