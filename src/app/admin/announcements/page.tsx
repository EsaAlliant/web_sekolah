import Link from "next/link";
import { DeleteRowButton } from "@/components/directory/DeleteRowButton";
import { getAnnouncements } from "@/services/announcement.service";

export default async function AdminAnnouncementsPage() {
  const items = await getAnnouncements();
  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="h4 mb-0">Pengumuman</h1>
        <Link className="btn btn-primary btn-sm" href="/admin/announcements/new"><i aria-hidden="true" className="bi bi-plus-lg" /> Tambah Pengumuman</Link>
      </div>
      {items.length === 0 ? <p className="text-muted-strong">Belum ada data.</p> : (
        <>
          <div className="table-responsive d-none d-md-block">
            <table className="table align-middle">
              <thead><tr><th style={{ width: "3rem" }}></th><th>Judul</th><th>Kategori</th><th>Tanggal</th><th style={{ width: "12rem" }}>Aksi</th></tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.isPinned && <i aria-hidden="true" className="bi bi-pin-angle-fill text-primary" title="Disematkan" />}</td>
                    <td>{item.title}</td>
                    <td>{item.category}</td>
                    <td>{item.date}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link className="btn btn-outline-primary btn-sm" href={`/admin/announcements/${item.id}/edit`}><i aria-hidden="true" className="bi bi-pencil" /> Edit</Link>
                        <DeleteRowButton id={item.id} itemLabel={item.title} table="announcements" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="admin-list-cards d-md-none">
            {items.map((item) => (
              <div className="admin-list-card" key={item.id}>
                <div className="admin-list-card-top">
                  <div style={{ minWidth: 0 }}>
                    <p className="admin-list-card-title">{item.isPinned && <i aria-hidden="true" className="bi bi-pin-angle-fill text-primary me-1" title="Disematkan" />}{item.title}</p>
                    <p className="admin-list-card-subtitle">{item.category}</p>
                  </div>
                </div>
                <dl className="admin-list-card-meta">
                  <div><dt>Tanggal</dt><dd>{item.date}</dd></div>
                </dl>
                <div className="admin-list-card-actions">
                  <Link className="btn btn-outline-primary btn-sm" href={`/admin/announcements/${item.id}/edit`}><i aria-hidden="true" className="bi bi-pencil" /> Edit</Link>
                  <DeleteRowButton id={item.id} itemLabel={item.title} table="announcements" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
