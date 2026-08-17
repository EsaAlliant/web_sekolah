"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface SectionTabItem { href: string; label: string; icon: string; }

export function SectionTabs({ items, ariaLabel }: { items: SectionTabItem[]; ariaLabel: string }) {
  const pathname = usePathname();

  const exactMatch = items.find((item) => item.href === pathname);
  const prefixMatches = items.filter((item) => item.href !== "/" && pathname.startsWith(`${item.href}/`));
  const bestPrefixMatch = prefixMatches.sort((a, b) => b.href.length - a.href.length)[0];
  const activeHref = exactMatch?.href ?? bestPrefixMatch?.href;

  return (
    <nav aria-label={ariaLabel} className="section-tabs">
      <div className="container">
        <ul>
          {items.map((item) => (
            <li key={item.href}>
              <Link className={item.href === activeHref ? "is-active" : ""} href={item.href}>
                <i aria-hidden="true" className={`bi ${item.icon}`} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
