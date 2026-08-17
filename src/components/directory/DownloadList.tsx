"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/components/common/EmptyState/EmptyState";
import type { DownloadItem } from "@/types/download";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const fileTypeIcon: Record<DownloadItem["fileType"], string> = { pdf: "bi-file-earmark-pdf", docx: "bi-file-earmark-word", xlsx: "bi-file-earmark-excel" };

function formatDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return `${day} ${monthNames[month - 1]} ${year}`;
}

export function DownloadList({ items }: { items: DownloadItem[] }) {
  const [category, setCategory] = useState("Semua");
  const [query, setQuery] = useState("");

  const categories = useMemo(() => ["Semua", ...Array.from(new Set(items.map((item) => item.category)))], [items]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = category === "Semua" || item.category === category;
      const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [items, category, query]);

  return (
    <div>
      <div className="directory-toolbar">
        <div className="directory-search">
          <i aria-hidden="true" className="bi bi-search" />
          <input aria-label="Cari dokumen" onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama dokumen..." type="search" value={query} />
        </div>
        <div className="directory-filters" role="group" aria-label="Filter kategori dokumen">
          {categories.map((item) => (
            <button className={item === category ? "is-active" : ""} key={item} onClick={() => setCategory(item)} type="button">{item}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState description="Coba ubah kata kunci pencarian atau kategori." title="Dokumen tidak ditemukan" />
      ) : (
        <div className="download-list">
          {filtered.map((item) => (
            <article className="download-card" key={item.id}>
              <div className={`download-icon file-${item.fileType}`} aria-hidden="true"><i className={`bi ${fileTypeIcon[item.fileType]}`} /></div>
              <div className="download-body">
                <span className="staff-tag">{item.category}</span>
                <h3 className="h6 mt-2 mb-1">{item.title}</h3>
                <p className="text-muted-strong mb-2">{item.description}</p>
                <span className="download-meta">{item.fileType.toUpperCase()} &bull; {item.fileSize} &bull; Diperbarui {formatDate(item.updatedDate)}</span>
              </div>
              <a className="download-btn" href={item.fileUrl}>
                <i aria-hidden="true" className="bi bi-download" /> Unduh
              </a>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
