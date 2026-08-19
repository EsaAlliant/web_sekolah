"use client";

import type { ChangeEvent } from "react";

export function SearchInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="search-input-wrap">
      <i aria-hidden="true" className="bi bi-search search-input-icon" />
      <input
        aria-label="Kata kunci pencarian"
        autoFocus
        className="form-control"
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        placeholder="Cari berita, guru, jurusan, fasilitas..."
        type="search"
        value={value}
      />
    </div>
  );
}
