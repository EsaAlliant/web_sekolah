import { Breadcrumb, type BreadcrumbItem } from "@/components/layout/Breadcrumb";

export function PageBanner({ eyebrow, title, description, breadcrumb }: { eyebrow?: string; title: string; description?: string; breadcrumb: BreadcrumbItem[] }) {
  return (
    <section className="page-banner">
      <div className="container">
        {eyebrow && <p className="page-banner-eyebrow">{eyebrow}</p>}
        <h1 className="page-banner-title">{title}</h1>
        {description && <p className="page-banner-desc">{description}</p>}
        <Breadcrumb items={breadcrumb} />
      </div>
    </section>
  );
}
