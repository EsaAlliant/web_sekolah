import Link from "next/link";

export function SectionHeading({ eyebrow, title, viewAllHref, viewAllLabel = "Lihat semua" }: { eyebrow?: string; title: string; viewAllHref?: string; viewAllLabel?: string }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span className="section-heading-eyebrow">{eyebrow}</span>}
        <h2 className="h4 mb-0">{title}</h2>
      </div>
      {viewAllHref && (
        <Link className="about-link-cta" href={viewAllHref}>
          {viewAllLabel} <i aria-hidden="true" className="bi bi-arrow-right" />
        </Link>
      )}
    </div>
  );
}
