import Link from "next/link";
import { DeleteRowButton } from "@/components/directory/DeleteRowButton";
import { getTeachers } from "@/services/teacher.service";

export default async function AdminTeachersPage() {
  const teachers = await getTeachers();
  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="h4 mb-0">Guru</h1>
        <Link className="btn btn-primary btn-sm" href="/admin/teachers/new"><i aria-hidden="true" className="bi bi-plus-lg" /> Tambah Guru</Link>
      </div>
      {teachers.length === 0 ? <p className="text-muted-strong">Belum ada data.</p> : (
        <>
          <div className="table-responsive d-none d-md-block">
            <table className="table align-middle">
              <thead><tr><th style={{ width: "4rem" }}>Foto</th><th>Nama</th><th>Jabatan</th><th>Mapel</th><th style={{ width: "12rem" }}>Aksi</th></tr></thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td><div className="admin-thumb">{teacher.photoUrl ? <img alt={teacher.name} src={teacher.photoUrl} /> : <i aria-hidden="true" className="bi bi-person" />}</div></td>
                    <td>{teacher.name}</td>
                    <td>{teacher.position}</td>
                    <td>{teacher.subjectGroup}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link className="btn btn-outline-primary btn-sm" href={`/admin/teachers/${teacher.id}/edit`}><i aria-hidden="true" className="bi bi-pencil" /> Edit</Link>
                        <DeleteRowButton id={teacher.id} itemLabel={teacher.name} table="teachers" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="admin-list-cards d-md-none">
            {teachers.map((teacher) => (
              <div className="admin-list-card" key={teacher.id}>
                <div className="admin-list-card-top">
                  <div className="admin-list-card-identity">
                    <div className="admin-thumb">{teacher.photoUrl ? <img alt={teacher.name} src={teacher.photoUrl} /> : <i aria-hidden="true" className="bi bi-person" />}</div>
                    <div style={{ minWidth: 0 }}>
                      <p className="admin-list-card-title">{teacher.name}</p>
                      <p className="admin-list-card-subtitle">{teacher.position}</p>
                    </div>
                  </div>
                </div>
                <dl className="admin-list-card-meta">
                  <div><dt>Mapel</dt><dd>{teacher.subjectGroup || "-"}</dd></div>
                </dl>
                <div className="admin-list-card-actions">
                  <Link className="btn btn-outline-primary btn-sm" href={`/admin/teachers/${teacher.id}/edit`}><i aria-hidden="true" className="bi bi-pencil" /> Edit</Link>
                  <DeleteRowButton id={teacher.id} itemLabel={teacher.name} table="teachers" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
