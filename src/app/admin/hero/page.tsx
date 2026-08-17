import Link from "next/link";
import { DeleteRowButton } from "@/components/directory/DeleteRowButton";
import { createServerClient } from "@/lib/supabase/server";
import type { HeroSlideRow } from "@/types/database";

export default async function AdminHeroPage() {
  const supabase = await createServerClient();
  const { data } = await supabase.from("hero_slides").select("*").order("sort_order");
  const slides = (data ?? []) as HeroSlideRow[];

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="h4 mb-1">Hero (Slide Beranda)</h1>
          <p className="text-muted-strong mb-0">Slide besar yang muncul paling atas di halaman Beranda.</p>
        </div>
        <Link className="btn btn-primary btn-sm" href="/admin/hero/new"><i aria-hidden="true" className="bi bi-plus-lg" /> Tambah Slide</Link>
      </div>

      {slides.length === 0 ? (
        <p className="text-muted-strong">Belum ada slide. Beranda akan kosong di bagian atas kalau tidak ada slide sama sekali.</p>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th style={{ width: "3rem" }}>Urutan</th><th>Judul</th><th>Tema</th><th>Tombol</th><th style={{ width: "12rem" }}>Aksi</th></tr></thead>
            <tbody>
              {slides.map((slide) => (
                <tr key={slide.id}>
                  <td>{slide.sort_order}</td>
                  <td>{slide.title}</td>
                  <td><span className={`staff-tag hero-theme-${slide.theme}`}>{slide.theme}</span></td>
                  <td>{slide.action_label} → {slide.action_href}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link className="btn btn-outline-primary btn-sm" href={`/admin/hero/${slide.id}/edit`}><i aria-hidden="true" className="bi bi-pencil" /> Edit</Link>
                      <DeleteRowButton id={slide.id} itemLabel={slide.title} table="hero_slides" />
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
