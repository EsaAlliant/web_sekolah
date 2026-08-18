import Link from "next/link";
import { DeleteRowButton } from "@/components/directory/DeleteRowButton";
import { getFacilities } from "@/services/facility.service";

export default async function AdminFacilitiesPage() {
  const facilities = await getFacilities();
  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="h4 mb-0">Fasilitas Sekolah</h1>
        <Link className="btn btn-primary btn-sm" href="/admin/facilities/new"><i aria-hidden="true" className="bi bi-plus-lg" /> Tambah Fasilitas</Link>
      </div>
      {facilities.length === 0 ? <p className="text-muted-strong">Belum ada data.</p> : (
        <>
          <div className="table-responsive d-none d-md-block">
            <table className="table align-middle">
              <thead><tr><th style={{ width: "4rem" }}></th><th>Nama</th><th>Kategori</th><th style={{ width: "12rem" }}>Aksi</th></tr></thead>
              <tbody>
                {facilities.map((item) => (
                  <tr key={item.id}>
                    <td><div className="admin-thumb">{item.photoUrl ? <img alt={item.name} src={item.photoUrl} /> : <i aria-hidden="true" className={`bi ${item.icon}`} />}</div></td>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link className="btn btn-outline-primary btn-sm" href={`/admin/facilities/${item.id}/edit`}><i aria-hidden="true" className="bi bi-pencil" /> Edit</Link>
                        <DeleteRowButton id={item.id} itemLabel={item.name} table="facilities" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="admin-list-cards d-md-none">
            {facilities.map((item) => (
              <div className="admin-list-card" key={item.id}>
                <div className="admin-list-card-top">
                  <div className="admin-list-card-identity">
                    <div className="admin-thumb">{item.photoUrl ? <img alt={item.name} src={item.photoUrl} /> : <i aria-hidden="true" className={`bi ${item.icon}`} />}</div>
                    <div style={{ minWidth: 0 }}>
                      <p className="admin-list-card-title">{item.name}</p>
                      <p className="admin-list-card-subtitle">{item.category}</p>
                    </div>
                  </div>
                </div>
                <div className="admin-list-card-actions">
                  <Link className="btn btn-outline-primary btn-sm" href={`/admin/facilities/${item.id}/edit`}><i aria-hidden="true" className="bi bi-pencil" /> Edit</Link>
                  <DeleteRowButton id={item.id} itemLabel={item.name} table="facilities" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
