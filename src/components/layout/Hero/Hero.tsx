"use client";
import { useEffect, useState } from "react";
import { HeroControls } from "./HeroControls";
import { HeroIndicator } from "./HeroIndicator";
import { HeroSlide, type HeroSlideContent } from "./HeroSlide";
export function Hero({ slides }: { slides: HeroSlideContent[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  useEffect(() => { if (slides.length <= 1 || isPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; const timer = window.setInterval(() => setActiveIndex((index) => (index + 1) % slides.length), 6000); return () => window.clearInterval(timer); }, [isPaused, slides.length]);
  const move = (direction: number) => setActiveIndex((index) => (index + direction + slides.length) % slides.length);
  if (slides.length === 0) return null;
  return <section className="hero-carousel" aria-roledescription="carousel" aria-label="Sorotan sekolah" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}><div className="hero-slides">{slides.map((slide, index) => <HeroSlide isActive={activeIndex === index} key={slide.title} slide={slide} />)}</div>{slides.length > 1 && <><HeroControls onNext={() => move(1)} onPrevious={() => move(-1)} /><HeroIndicator activeIndex={activeIndex} count={slides.length} onSelect={setActiveIndex} /></>}</section>;
}
