"use client";
import { useEffect, useState } from "react";
import { SearchEmpty } from "./SearchEmpty";
import { SearchInput } from "./SearchInput";
import { SearchResult } from "./SearchResult";
export function SearchModal() { const [isOpen, setIsOpen] = useState(false); const [query, setQuery] = useState(""); useEffect(() => { const open = () => setIsOpen(true); window.addEventListener("school:open-search", open); return () => window.removeEventListener("school:open-search", open); }, []); if (!isOpen) return null; return <div className="modal d-block" role="dialog" aria-modal="true" aria-labelledby="search-modal-title"><div className="modal-dialog modal-dialog-centered"><div className="modal-content"><div className="modal-header"><h2 className="modal-title fs-5" id="search-modal-title">Pencarian</h2><button className="btn-close" type="button" onClick={() => setIsOpen(false)} aria-label="Tutup" /></div><div className="modal-body"><SearchInput value={query} onChange={setQuery} />{query.trim() ? <SearchResult query={query} /> : <SearchEmpty />}</div></div></div></div>; }
