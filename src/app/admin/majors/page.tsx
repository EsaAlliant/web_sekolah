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
        <div className="table-responsive">
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
      )}
    </div>
  );
}
