import Link from "next/link";
import { DeleteRowButton } from "@/components/directory/DeleteRowButton";
import { getNews } from "@/services/news.service";

export default async function AdminNewsPage() {
  const news = await getNews();
  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="h4 mb-0">Berita</h1>
        <Link className="btn btn-primary btn-sm" href="/admin/news/new"><i aria-hidden="true" className="bi bi-plus-lg" /> Tulis Berita</Link>
      </div>
      {news.length === 0 ? <p className="text-muted-strong">Belum ada data.</p> : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th style={{ width: "4rem" }}></th><th>Judul</th><th>Kategori</th><th>Tanggal</th><th style={{ width: "12rem" }}>Aksi</th></tr></thead>
            <tbody>
              {news.map((item) => (
                <tr key={item.id}>
                  <td><div className="admin-thumb">{item.photoUrl ? <img alt={item.title} src={item.photoUrl} /> : <i aria-hidden="true" className={`bi ${item.icon}`} />}</div></td>
                  <td>{item.title}</td>
                  <td>{item.category}</td>
                  <td>{item.date}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link className="btn btn-outline-primary btn-sm" href={`/admin/news/${item.id}/edit`}><i aria-hidden="true" className="bi bi-pencil" /> Edit</Link>
                      <DeleteRowButton id={item.id} itemLabel={item.title} table="news" />
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
