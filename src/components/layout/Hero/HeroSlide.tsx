export interface HeroSlideContent {
  id: string;
  sortOrder: number;
  imageUrl?: string | null;
}

export function HeroSlide({ slide, isActive }: { slide: HeroSlideContent; isActive: boolean }) {
  return (
    <article
      aria-hidden={!isActive}
      className={`hero-slide ${isActive ? "is-active" : ""}`}
    >
      {slide.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={`Sorotan sekolah ${slide.sortOrder + 1}`}
          className="hero-slide-image"
          src={slide.imageUrl}
        />
      ) : null}
    </article>
  );
}
