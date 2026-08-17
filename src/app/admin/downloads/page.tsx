import Link from "next/link";
import { DeleteRowButton } from "@/components/directory/DeleteRowButton";
import { getDownloads } from "@/services/downloads.service";

export default async function AdminDownloadsPage() {
  const items = await getDownloads();
  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="h4 mb-0">Download</h1>
        <Link className="btn btn-primary btn-sm" href="/admin/downloads/new"><i aria-hidden="true" className="bi bi-plus-lg" /> Tambah Dokumen</Link>
      </div>
      {items.length === 0 ? <p className="text-muted-strong">Belum ada data.</p> : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th>Judul</th><th>Kategori</th><th>Tipe</th><th>Ukuran</th><th style={{ width: "12rem" }}>Aksi</th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.category}</td>
                  <td>{item.fileType.toUpperCase()}</td>
                  <td>{item.fileSize}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link className="btn btn-outline-primary btn-sm" href={`/admin/downloads/${item.id}/edit`}><i aria-hidden="true" className="bi bi-pencil" /> Edit</Link>
                      <DeleteRowButton id={item.id} itemLabel={item.title} table="downloads" />
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
