"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/components/common/EmptyState/EmptyState";
import type { GalleryItem } from "@/types/gallery";

const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

function formatDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return `${day} ${monthNames[month - 1]} ${year}`;
}

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [category, setCategory] = useState("Semua");
  const [active, setActive] = useState<GalleryItem | null>(null);

  const categories = useMemo(() => ["Semua", ...Array.from(new Set(items.map((item) => item.category)))], [items]);
  const filtered = useMemo(() => items.filter((item) => category === "Semua" || item.category === category), [items, category]);

  return (
    <div>
      <div className="directory-filters mb-4" role="group" aria-label="Filter kategori galeri">
        {categories.map((item) => (
          <button className={item === category ? "is-active" : ""} key={item} onClick={() => setCategory(item)} type="button">{item}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState description="Coba pilih kategori lain." title="Belum ada foto" />
      ) : (
        <div className="gallery-grid">
          {filtered.map((item) => (
            <button className="gallery-tile" key={item.id} onClick={() => setActive(item)} type="button">
              {item.photoUrl ? (
                <img alt={item.title} className="gallery-tile-photo" src={item.photoUrl} />
              ) : (
                <span className="gallery-tile-visual" aria-hidden="true"><i className={`bi ${item.icon}`} /></span>
              )}
              <span className="gallery-tile-overlay">
                <span className="gallery-tile-category">{item.category}</span>
                <span className="gallery-tile-title">{item.title}</span>
              </span>
            </button>
          ))}
        </div>
      )}

      {active && (
        <div className="gallery-modal-backdrop" onClick={() => setActive(null)} role="presentation">
          <div className="gallery-modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={active.title}>
            <button aria-label="Tutup" className="gallery-modal-close" onClick={() => setActive(null)} type="button">
              <i aria-hidden="true" className="bi bi-x-lg" />
            </button>
            <span className="gallery-modal-visual" aria-hidden="true">
              {active.photoUrl ? <img alt={active.title} className="gallery-modal-photo" src={active.photoUrl} /> : <i className={`bi ${active.icon}`} />}
            </span>
            <div className="gallery-modal-body">
              <span className="staff-tag">{active.category}</span>
              <h3 className="h5 mt-2 mb-1">{active.title}</h3>
              <p className="text-muted-strong mb-2">{active.description}</p>
              <span className="gallery-modal-date"><i aria-hidden="true" className="bi bi-calendar3" /> {formatDate(active.date)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
