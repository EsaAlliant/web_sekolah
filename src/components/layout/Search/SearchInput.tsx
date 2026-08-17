"use client";
import type { ChangeEvent } from "react";
export function SearchInput({ value, onChange }: { value: string; onChange: (value: string) => void }) { return <input className="form-control" type="search" value={value} onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)} placeholder="Cari informasi sekolah..." aria-label="Kata kunci pencarian" autoFocus />; }
