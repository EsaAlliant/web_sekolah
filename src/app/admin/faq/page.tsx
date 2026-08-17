import Link from "next/link";
import { DeleteRowButton } from "@/components/directory/DeleteRowButton";
import { getFaq } from "@/services/faq.service";

export default async function AdminFaqPage() {
  const items = await getFaq();
  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="h4 mb-0">FAQ</h1>
        <Link className="btn btn-primary btn-sm" href="/admin/faq/new"><i aria-hidden="true" className="bi bi-plus-lg" /> Tambah FAQ</Link>
      </div>
      {items.length === 0 ? <p className="text-muted-strong">Belum ada data.</p> : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th>Pertanyaan</th><th>Kategori</th><th style={{ width: "12rem" }}>Aksi</th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.question}</td>
                  <td>{item.category}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link className="btn btn-outline-primary btn-sm" href={`/admin/faq/${item.id}/edit`}><i aria-hidden="true" className="bi bi-pencil" /> Edit</Link>
                      <DeleteRowButton id={item.id} itemLabel={item.question} table="faqs" />
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
