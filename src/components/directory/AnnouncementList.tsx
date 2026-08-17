"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/components/common/EmptyState/EmptyState";
import type { AnnouncementItem } from "@/types/announcement";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function formatDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return `${day} ${monthNames[month - 1]} ${year}`;
}

export function AnnouncementList({ items }: { items: AnnouncementItem[] }) {
  const [category, setCategory] = useState("Semua");
  const categories = useMemo(() => ["Semua", ...Array.from(new Set(items.map((item) => item.category)))], [items]);
  const filtered = useMemo(() => items.filter((item) => category === "Semua" || item.category === category), [items, category]);

  return (
    <div>
      <div className="directory-filters mb-4" role="group" aria-label="Filter kategori pengumuman">
        {categories.map((item) => (
          <button className={item === category ? "is-active" : ""} key={item} onClick={() => setCategory(item)} type="button">{item}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState description="Coba pilih kategori lain." title="Belum ada pengumuman" />
      ) : (
        <div className="announcement-list">
          {filtered.map((item) => (
            <article className={`announcement-card ${item.isPinned ? "is-pinned" : ""}`} key={item.id}>
              {item.isPinned && <span className="announcement-pin"><i aria-hidden="true" className="bi bi-pin-angle-fill" /> Disematkan</span>}
              <div className="announcement-head">
                <span className="staff-tag">{item.category}</span>
                <span className="news-meta">{formatDate(item.date)}</span>
              </div>
              <h3 className="h6 mt-2 mb-1">{item.title}</h3>
              <p className="text-muted-strong mb-0">{item.content}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
