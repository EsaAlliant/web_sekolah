"use client";

import { useMemo, useState } from "react";
import { Avatar } from "@/components/common/Avatar";
import { EmptyState } from "@/components/common/EmptyState/EmptyState";
import type { Testimonial } from "@/types/testimonial";

const categoryIcon: Record<Testimonial["category"], string> = { Alumni: "bi-mortarboard", Siswa: "bi-backpack2", "Orang Tua": "bi-people" };

function getYoutubeId(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/);
  return match?.[1];
}

function getYoutubeEmbedUrl(url: string) {
  const videoId = getYoutubeId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
}

function getYoutubeThumbnail(url: string) {
  const videoId = getYoutubeId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : undefined;
}

export function TestimonialGrid({ testimonials }: { testimonials: Testimonial[] }) {
  const [category, setCategory] = useState("Semua");
  const [playing, setPlaying] = useState<Testimonial | null>(null);
  const categories = useMemo(() => ["Semua", ...Array.from(new Set(testimonials.map((item) => item.category)))], [testimonials]);
  const filtered = useMemo(() => testimonials.filter((item) => category === "Semua" || item.category === category), [testimonials, category]);

  return (
    <div>
      <div className="directory-filters mb-4" role="group" aria-label="Filter kategori testimoni">
        {categories.map((item) => (
          <button className={item === category ? "is-active" : ""} key={item} onClick={() => setCategory(item)} type="button">
            {item !== "Semua" && <i aria-hidden="true" className={`bi ${categoryIcon[item as Testimonial["category"]]} me-1`} />}
            {item}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState description="Coba pilih kategori lain." title="Belum ada testimoni" />
      ) : (
        <div className="row g-4">
          {filtered.map((item) => (
            <div className="col-md-6 col-lg-4" key={item.id}>
              <article className="testimonial-card">
                {item.videoUrl ? (
                  <button
                    className="testimonial-video-thumb"
                    onClick={() => setPlaying(item)}
                    style={getYoutubeThumbnail(item.videoUrl) ? { backgroundImage: `url(${getYoutubeThumbnail(item.videoUrl)})` } : undefined}
                    type="button"
                  >
                    <span className="testimonial-play"><i aria-hidden="true" className="bi bi-play-fill" /></span>
                  </button>
                ) : (
                  <i aria-hidden="true" className="bi bi-quote testimonial-quote-icon" />
                )}
                <p className="testimonial-quote">{item.quote}</p>
                <div className="testimonial-author">
                  <Avatar className="testimonial-avatar" name={item.name} photoUrl={item.photoUrl} />
                  <div>
                    <strong>{item.name}</strong>
                    <span className="staff-tag testimonial-category"><i aria-hidden="true" className={`bi ${categoryIcon[item.category]}`} /> {item.category}</span>
                    <p className="text-muted-strong mb-0 testimonial-detail">{item.detail}</p>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      )}

      {playing && (
        <div className="gallery-modal-backdrop" onClick={() => setPlaying(null)} role="presentation">
          <div className="gallery-modal testimonial-video-modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={`Video testimoni ${playing.name}`}>
            <button aria-label="Tutup" className="gallery-modal-close" onClick={() => setPlaying(null)} type="button">
              <i aria-hidden="true" className="bi bi-x-lg" />
            </button>
            <div className="testimonial-video-frame">
              <iframe allow="autoplay; encrypted-media" allowFullScreen src={getYoutubeEmbedUrl(playing.videoUrl ?? "")} title={`Video testimoni ${playing.name}`} />
            </div>
            <div className="gallery-modal-body">
              <strong>{playing.name}</strong>
              <p className="text-muted-strong mb-0 testimonial-detail">{playing.detail}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
