import Link from "next/link";

export interface BreadcrumbItem { label: string; href?: string; }
export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) { return <nav aria-label="Breadcrumb" className="page-breadcrumb"><ol className="breadcrumb mb-0">{items.map((item, index) => <li aria-current={index === items.length - 1 ? "page" : undefined} className={`breadcrumb-item ${index === items.length - 1 ? "active" : ""}`} key={item.label}>{item.href && index !== items.length - 1 ? <Link href={item.href}>{item.label}</Link> : item.label}</li>)}</ol></nav>; }
