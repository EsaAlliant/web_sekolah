"use client";

import { useEffect, useRef, useState } from "react";
import { SearchEmpty } from "./SearchEmpty";
import { SearchInput } from "./SearchInput";
import { SearchResult } from "./SearchResult";
import type { SearchResultItem } from "@/types/search";

export function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const requestId = useRef(0);

  // Modal dibuka dari mana saja (tombol kaca pembesar di navbar/topbar)
  // lewat custom event, biar nggak perlu passing state lintas komponen.
  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener("school:open-search", open);
    return () => window.removeEventListener("school:open-search", open);
  }, []);

  const close = () => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    setSearched(false);
  };

  // Tombol Escape buat nutup, dan kunci scroll halaman belakang selama modal terbuka.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Debounce 350ms biar nggak nembak API tiap ketikan huruf, dan
  // requestId dipakai buat ngabaiin respons yang keduluan/telat (race condition).
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setSearched(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    const currentRequest = ++requestId.current;

    const timeout = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        const data = await response.json();
        if (currentRequest === requestId.current) {
          setResults(data.results ?? []);
          setSearched(true);
        }
      } catch {
        if (currentRequest === requestId.current) {
          setResults([]);
          setSearched(true);
        }
      } finally {
        if (currentRequest === requestId.current) setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="search-modal-backdrop" onClick={close} role="presentation">
      <div
        aria-labelledby="search-modal-title"
        aria-modal="true"
        className="search-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="search-modal-header">
          <h2 className="fs-5 mb-0" id="search-modal-title">Pencarian</h2>
          <button aria-label="Tutup" className="btn-close" onClick={close} type="button" />
        </div>
        <div className="search-modal-body">
          <SearchInput onChange={setQuery} value={query} />
          {query.trim().length < 2 ? (
            <SearchEmpty />
          ) : (
            <SearchResult loading={loading} onNavigate={close} query={query} results={results} searched={searched} />
          )}
        </div>
      </div>
    </div>
  );
}
