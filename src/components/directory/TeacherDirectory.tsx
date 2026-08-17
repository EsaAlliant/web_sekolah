"use client";

import { useMemo, useState } from "react";
import type { Teacher } from "@/types/teacher";
import { Avatar } from "@/components/common/Avatar";
import { EmptyState } from "@/components/common/EmptyState/EmptyState";

export function TeacherDirectory({ teachers }: { teachers: Teacher[] }) {
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState("Semua");

  const groups = useMemo(() => ["Semua", ...Array.from(new Set(teachers.map((teacher) => teacher.subjectGroup)))], [teachers]);

  const filtered = useMemo(() => {
    return teachers.filter((teacher) => {
      const matchesGroup = activeGroup === "Semua" || teacher.subjectGroup === activeGroup;
      const matchesQuery = teacher.name.toLowerCase().includes(query.toLowerCase()) || teacher.position.toLowerCase().includes(query.toLowerCase());
      return matchesGroup && matchesQuery;
    });
  }, [teachers, activeGroup, query]);

  return (
    <div>
      <div className="directory-toolbar">
        <div className="directory-search">
          <i aria-hidden="true" className="bi bi-search" />
          <input aria-label="Cari nama guru" onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama atau jabatan guru..." type="search" value={query} />
        </div>
        <div className="directory-filters" role="group" aria-label="Filter mata pelajaran">
          {groups.map((group) => (
            <button className={group === activeGroup ? "is-active" : ""} key={group} onClick={() => setActiveGroup(group)} type="button">
              {group}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState description="Coba ubah kata kunci pencarian atau filter mata pelajaran." title="Guru tidak ditemukan" />
      ) : (
        <div className="row g-4">
          {filtered.map((teacher) => (
            <div className="col-sm-6 col-lg-4" key={teacher.id}>
              <article className="staff-card">
                <Avatar name={teacher.name} photoUrl={teacher.photoUrl} />
                <h3 className="h6 mb-1">{teacher.name}</h3>
                <p className="staff-role mb-2">{teacher.position}</p>
                <span className="staff-tag">{teacher.subjectGroup}</span>
                <p className="text-muted-strong staff-meta mb-0">{teacher.education}</p>
              </article>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
