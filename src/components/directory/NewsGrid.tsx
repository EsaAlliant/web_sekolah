"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/common/EmptyState/EmptyState";
import type { NewsItem } from "@/types/news";

const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

function formatDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return `${day} ${monthNames[month - 1]} ${year}`;
}

export function NewsGrid({ items }: { items: NewsItem[] }) {
  const [category, setCategory] = useState("Semua");
  const categories = useMemo(() => ["Semua", ...Array.from(new Set(items.map((item) => item.category)))], [items]);
  const filtered = useMemo(() => items.filter((item) => category === "Semua" || item.category === category), [items, category]);

  const [featured, ...rest] = filtered;

  return (
    <div>
      <div className="directory-filters mb-4" role="group" aria-label="Filter kategori berita">
        {categories.map((item) => (
          <button className={item === category ? "is-active" : ""} key={item} onClick={() => setCategory(item)} type="button">{item}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState description="Coba pilih kategori lain." title="Belum ada berita" />
      ) : (
        <>
          <Link className="news-featured" href={`/news/${featured.slug}`}>
            <span className="news-featured-visual" aria-hidden="true">
              {featured.photoUrl ? <img alt={featured.title} className="news-visual-photo" src={featured.photoUrl} /> : <i className={`bi ${featured.icon}`} />}
            </span>
            <span className="news-featured-body">
              <span className="staff-tag">{featured.category}</span>
              <h2 className="h4 mt-2 mb-2">{featured.title}</h2>
              <p className="text-muted-strong mb-3">{featured.excerpt}</p>
              <span className="news-meta">{featured.author} &bull; {formatDate(featured.date)}</span>
            </span>
          </Link>

          {rest.length > 0 && (
            <div className="row g-4 mt-1">
              {rest.map((item) => (
                <div className="col-md-6 col-lg-4" key={item.id}>
                  <Link className="news-card" href={`/news/${item.slug}`}>
                    <span className="news-card-visual" aria-hidden="true">
                      {item.photoUrl ? <img alt={item.title} className="news-visual-photo" src={item.photoUrl} /> : <i className={`bi ${item.icon}`} />}
                    </span>
                    <span className="news-card-body">
                      <span className="staff-tag">{item.category}</span>
                      <h3 className="h6 mt-2 mb-1">{item.title}</h3>
                      <span className="news-meta">{formatDate(item.date)}</span>
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
