"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { VisitorStats } from "@/services/visitor.service";

function bumpFormattedNumber(formatted: string) {
  const numeric = Number(formatted.replace(/\./g, "")) || 0;
  return (numeric + 1).toLocaleString("id-ID");
}

export function LiveVisitorStats({ initialStats }: { initialStats: VisitorStats }) {
  const [stats, setStats] = useState(initialStats);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("page_visits_live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "page_visits" }, () => {
        setStats((prev) => ({
          today: bumpFormattedNumber(prev.today),
          month: bumpFormattedNumber(prev.month),
          year: bumpFormattedNumber(prev.year),
          total: bumpFormattedNumber(prev.total),
        }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const items = [
    { label: "Hari Ini", value: stats.today },
    { label: "Bulan Ini", value: stats.month },
    { label: "Tahun Ini", value: stats.year },
    { label: "Total", value: stats.total },
  ];

  return (
    <dl className="visitor-card mb-0">
      {items.map((item) => (
        <div className="visitor-row" key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
