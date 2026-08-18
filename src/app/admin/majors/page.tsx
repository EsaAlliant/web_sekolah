import Link from "next/link";
import { DeleteRowButton } from "@/components/directory/DeleteRowButton";
import { getMajors } from "@/services/academic.service";

export default async function AdminMajorsPage() {
  const majors = await getMajors();
  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="h4 mb-0">Jurusan</h1>
        <Link className="btn btn-primary btn-sm" href="/admin/majors/new"><i aria-hidden="true" className="bi bi-plus-lg" /> Tambah Jurusan</Link>
      </div>
      {majors.length === 0 ? <p className="text-muted-strong">Belum ada data.</p> : (
        <>
          <div className="table-responsive d-none d-md-block">
            <table className="table align-middle">
              <thead><tr><th>Nama</th><th>Singkatan</th><th>Durasi</th><th style={{ width: "12rem" }}>Aksi</th></tr></thead>
              <tbody>
                {majors.map((major) => (
                  <tr key={major.id}>
                    <td>{major.name}</td>
                    <td>{major.abbreviation}</td>
                    <td>{major.duration}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link className="btn btn-outline-primary btn-sm" href={`/admin/majors/${major.id}/edit`}><i aria-hidden="true" className="bi bi-pencil" /> Edit</Link>
                        <DeleteRowButton id={major.id} itemLabel={major.name} table="majors" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="admin-list-cards d-md-none">
            {majors.map((major) => (
              <div className="admin-list-card" key={major.id}>
                <div className="admin-list-card-top">
                  <div style={{ minWidth: 0 }}>
                    <p className="admin-list-card-title">{major.name}</p>
                    <p className="admin-list-card-subtitle">{major.abbreviation}</p>
                  </div>
                </div>
                <dl className="admin-list-card-meta">
                  <div><dt>Durasi</dt><dd>{major.duration}</dd></div>
                </dl>
                <div className="admin-list-card-actions">
                  <Link className="btn btn-outline-primary btn-sm" href={`/admin/majors/${major.id}/edit`}><i aria-hidden="true" className="bi bi-pencil" /> Edit</Link>
                  <DeleteRowButton id={major.id} itemLabel={major.name} table="majors" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
