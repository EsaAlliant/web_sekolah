import Link from "next/link";
import { DeleteRowButton } from "@/components/directory/DeleteRowButton";
import { getAgenda } from "@/services/agenda.service";

export default async function AdminAgendaPage() {
  const agenda = await getAgenda();
  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="h4 mb-0">Agenda</h1>
        <Link className="btn btn-primary btn-sm" href="/admin/agenda/new"><i aria-hidden="true" className="bi bi-plus-lg" /> Tambah Agenda</Link>
      </div>
      {agenda.length === 0 ? <p className="text-muted-strong">Belum ada data.</p> : (
        <>
          <div className="table-responsive d-none d-md-block">
            <table className="table align-middle">
              <thead><tr><th>Tanggal</th><th>Judul</th><th>Kategori</th><th>Lokasi</th><th style={{ width: "12rem" }}>Aksi</th></tr></thead>
              <tbody>
                {agenda.map((event) => (
                  <tr key={event.id}>
                    <td>{event.startDate}{event.endDate ? ` – ${event.endDate}` : ""}</td>
                    <td>{event.title}</td>
                    <td>{event.category}</td>
                    <td>{event.location}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link className="btn btn-outline-primary btn-sm" href={`/admin/agenda/${event.id}/edit`}><i aria-hidden="true" className="bi bi-pencil" /> Edit</Link>
                        <DeleteRowButton id={event.id} itemLabel={event.title} table="agenda_events" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="admin-list-cards d-md-none">
            {agenda.map((event) => (
              <div className="admin-list-card" key={event.id}>
                <div className="admin-list-card-top">
                  <div style={{ minWidth: 0 }}>
                    <p className="admin-list-card-title">{event.title}</p>
                    <p className="admin-list-card-subtitle">{event.category}</p>
                  </div>
                </div>
                <dl className="admin-list-card-meta">
                  <div><dt>Tanggal</dt><dd>{event.startDate}{event.endDate ? ` – ${event.endDate}` : ""}</dd></div>
                  <div><dt>Lokasi</dt><dd>{event.location || "-"}</dd></div>
                </dl>
                <div className="admin-list-card-actions">
                  <Link className="btn btn-outline-primary btn-sm" href={`/admin/agenda/${event.id}/edit`}><i aria-hidden="true" className="bi bi-pencil" /> Edit</Link>
                  <DeleteRowButton id={event.id} itemLabel={event.title} table="agenda_events" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
