"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/components/common/EmptyState/EmptyState";
import type { FaqItem } from "@/types/faq";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [category, setCategory] = useState("Semua");
  const [query, setQuery] = useState("");

  const categories = useMemo(() => ["Semua", ...Array.from(new Set(items.map((item) => item.category)))], [items]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = category === "Semua" || item.category === category;
      const matchesQuery = item.question.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [items, category, query]);

  return (
    <div>
      <div className="directory-toolbar">
        <div className="directory-search">
          <i aria-hidden="true" className="bi bi-search" />
          <input aria-label="Cari pertanyaan" onChange={(event) => setQuery(event.target.value)} placeholder="Cari pertanyaan..." type="search" value={query} />
        </div>
        <div className="directory-filters" role="group" aria-label="Filter kategori FAQ">
          {categories.map((item) => (
            <button className={item === category ? "is-active" : ""} key={item} onClick={() => setCategory(item)} type="button">{item}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState description="Coba ubah kata kunci pencarian atau kategori." title="Pertanyaan tidak ditemukan" />
      ) : (
        <div className="faq-accordion">
          {filtered.map((item) => (
            <details className="faq-item" key={item.id}>
              <summary>
                <span>{item.question}</span>
                <i aria-hidden="true" className="bi bi-chevron-down" />
              </summary>
              <p className="text-muted-strong mb-0">{item.answer}</p>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
