import Link from "next/link";
import { DeleteRowButton } from "@/components/directory/DeleteRowButton";
import { getHomepageFeatures } from "@/services/homepage.service";

export default async function AdminFeaturesPage() {
  const features = await getHomepageFeatures();

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="h4 mb-1">Kenapa Memilih Kami</h1>
          <p className="text-muted-strong mb-0">Poin unggulan yang ditampilkan di Beranda.</p>
        </div>
        <Link className="btn btn-primary btn-sm" href="/admin/features/new"><i aria-hidden="true" className="bi bi-plus-lg" /> Tambah Fitur</Link>
      </div>

      {features.length === 0 ? (
        <p className="text-muted-strong">Belum ada data.</p>
      ) : (
        <div className="row g-3">
          {features.map((feature) => (
            <div className="col-md-6" key={feature.id}>
              <div className="admin-stat-card text-start">
                <div className="d-flex align-items-start gap-3">
                  <div className="admin-thumb"><i aria-hidden="true" className={`bi ${feature.icon}`} /></div>
                  <div className="flex-grow-1">
                    <strong className="d-block h6 mb-1">{feature.title}</strong>
                    <p className="text-muted-strong small mb-2">{feature.description}</p>
                    <div className="d-flex gap-2">
                      <Link className="btn btn-outline-primary btn-sm" href={`/admin/features/${feature.id}/edit`}><i aria-hidden="true" className="bi bi-pencil" /> Edit</Link>
                      <DeleteRowButton id={feature.id} itemLabel={feature.title} table="homepage_features" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
