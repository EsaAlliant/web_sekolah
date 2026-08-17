import Link from "next/link";
export function FooterLinks({ title, links }: { title: string; links: Array<{ label: string; href: string }> }) { return <section><h2 className="footer-heading">{title}</h2><ul className="list-unstyled small mb-0">{links.map((link) => <li className="mb-2" key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul></section>; }
