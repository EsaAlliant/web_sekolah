"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/components/common/EmptyState/EmptyState";
import type { AgendaEvent } from "@/types/agenda";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function formatDay(dateString: string) {
  return Number(dateString.slice(8, 10));
}

function formatMonth(dateString: string) {
  return monthNames[Number(dateString.slice(5, 7)) - 1];
}

function formatRange(event: AgendaEvent) {
  if (!event.endDate || event.endDate === event.startDate) {
    return `${formatDay(event.startDate)} ${formatMonth(event.startDate)} ${event.startDate.slice(0, 4)}`;
  }
  const sameMonth = event.startDate.slice(0, 7) === event.endDate.slice(0, 7);
  const start = sameMonth ? `${formatDay(event.startDate)}` : `${formatDay(event.startDate)} ${formatMonth(event.startDate)}`;
  return `${start} – ${formatDay(event.endDate)} ${formatMonth(event.endDate)} ${event.endDate.slice(0, 4)}`;
}

export function AgendaList({ events, todayIso }: { events: AgendaEvent[]; todayIso: string }) {
  const [category, setCategory] = useState("Semua");
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  const categories = useMemo(() => ["Semua", ...Array.from(new Set(events.map((event) => event.category)))], [events]);

  const { upcoming, past } = useMemo(() => {
    const filtered = events.filter((event) => category === "Semua" || event.category === category);
    return {
      upcoming: filtered.filter((event) => (event.endDate ?? event.startDate) >= todayIso),
      past: filtered.filter((event) => (event.endDate ?? event.startDate) < todayIso).slice().reverse(),
    };
  }, [events, category, todayIso]);

  const list = tab === "upcoming" ? upcoming : past;

  return (
    <div>
      <div className="directory-toolbar">
        <div className="agenda-tabs" role="tablist" aria-label="Status agenda">
          <button aria-selected={tab === "upcoming"} className={tab === "upcoming" ? "is-active" : ""} onClick={() => setTab("upcoming")} role="tab" type="button">Akan Datang ({upcoming.length})</button>
          <button aria-selected={tab === "past"} className={tab === "past" ? "is-active" : ""} onClick={() => setTab("past")} role="tab" type="button">Sudah Berlangsung ({past.length})</button>
        </div>
        <div className="directory-filters" role="group" aria-label="Filter kategori agenda">
          {categories.map((item) => (
            <button className={item === category ? "is-active" : ""} key={item} onClick={() => setCategory(item)} type="button">{item}</button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState description="Coba ubah filter kategori atau cek tab lainnya." title="Belum ada agenda" />
      ) : (
        <div className="agenda-list">
          {list.map((event) => (
            <article className="agenda-card" key={event.id}>
              <div className="agenda-date">
                <span className="agenda-day">{formatDay(event.startDate)}</span>
                <span className="agenda-month">{formatMonth(event.startDate)}</span>
              </div>
              <div className="agenda-content">
                <span className="staff-tag">{event.category}</span>
                <h3 className="h6 mt-2 mb-1">{event.title}</h3>
                <p className="text-muted-strong mb-2">{event.description}</p>
                <ul className="agenda-meta list-unstyled mb-0">
                  <li><i aria-hidden="true" className="bi bi-calendar3" /> {formatRange(event)}</li>
                  {event.time && <li><i aria-hidden="true" className="bi bi-clock" /> {event.time}</li>}
                  <li><i aria-hidden="true" className="bi bi-geo-alt" /> {event.location}</li>
                </ul>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
