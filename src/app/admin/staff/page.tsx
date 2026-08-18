import Link from "next/link";
import { DeleteRowButton } from "@/components/directory/DeleteRowButton";
import { getStaff } from "@/services/staff.service";

export default async function AdminStaffPage() {
  const staff = await getStaff();
  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="h4 mb-0">Staff</h1>
        <Link className="btn btn-primary btn-sm" href="/admin/staff/new"><i aria-hidden="true" className="bi bi-plus-lg" /> Tambah Staff</Link>
      </div>
      {staff.length === 0 ? <p className="text-muted-strong">Belum ada data.</p> : (
        <>
          <div className="table-responsive d-none d-md-block">
            <table className="table align-middle">
              <thead><tr><th style={{ width: "4rem" }}>Foto</th><th>Nama</th><th>Jabatan</th><th>Unit</th><th style={{ width: "12rem" }}>Aksi</th></tr></thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member.id}>
                    <td><div className="admin-thumb">{member.photoUrl ? <img alt={member.name} src={member.photoUrl} /> : <i aria-hidden="true" className="bi bi-person" />}</div></td>
                    <td>{member.name}</td>
                    <td>{member.position}</td>
                    <td>{member.unit}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link className="btn btn-outline-primary btn-sm" href={`/admin/staff/${member.id}/edit`}><i aria-hidden="true" className="bi bi-pencil" /> Edit</Link>
                        <DeleteRowButton id={member.id} itemLabel={member.name} table="staff" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="admin-list-cards d-md-none">
            {staff.map((member) => (
              <div className="admin-list-card" key={member.id}>
                <div className="admin-list-card-top">
                  <div className="admin-list-card-identity">
                    <div className="admin-thumb">{member.photoUrl ? <img alt={member.name} src={member.photoUrl} /> : <i aria-hidden="true" className="bi bi-person" />}</div>
                    <div style={{ minWidth: 0 }}>
                      <p className="admin-list-card-title">{member.name}</p>
                      <p className="admin-list-card-subtitle">{member.position}</p>
                    </div>
                  </div>
                </div>
                <dl className="admin-list-card-meta">
                  <div><dt>Unit</dt><dd>{member.unit || "-"}</dd></div>
                </dl>
                <div className="admin-list-card-actions">
                  <Link className="btn btn-outline-primary btn-sm" href={`/admin/staff/${member.id}/edit`}><i aria-hidden="true" className="bi bi-pencil" /> Edit</Link>
                  <DeleteRowButton id={member.id} itemLabel={member.name} table="staff" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
