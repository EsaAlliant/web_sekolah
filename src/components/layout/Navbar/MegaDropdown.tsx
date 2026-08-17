import Link from "next/link";
import type { NavigationItem } from "@/types/settings";
export function MegaDropdown({ item, active }: { item: NavigationItem; active: boolean }) { return <div className="nav-item dropdown"><a className={`nav-link dropdown-toggle ${active ? "active" : ""}`} href={item.href} data-bs-toggle="dropdown" aria-expanded="false">{item.label}</a><ul className="dropdown-menu mega-dropdown-menu shadow border-0">{item.children?.map((child) => <li key={child.href}><Link className="dropdown-item" href={child.href}>{child.label}</Link></li>)}</ul></div>; }
