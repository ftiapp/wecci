"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { CtaButton } from "@/components/ui/CtaButton";
import { MediaBackdrop } from "@/components/ui/MediaBackdrop";
import { heroSlides } from "@/lib/data/hero";

const INTERVAL_MS = 7000;

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % heroSlides.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused]);

  const slide = heroSlides[index];

  return (
    <section
      /* สูงเต็มจอแบบเว็บองค์กรทั่วไป — svh กันแถบเบราว์เซอร์บนมือถือทำให้ล้น */
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden"
      aria-roledescription="carousel"
      aria-label="แบนเนอร์หลัก"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <MediaBackdrop
        key={slide.id}
        src={slide.image}
        alt={slide.imageAlt ?? ""}
        gradient={slide.gradient}
        /* เงาไล่จากซ้าย ปรับความเข้มแยกรายสไลด์ตามความสว่างของภาพ */
        overlay={slide.overlay ?? "bg-gradient-to-r from-black/60 via-black/25 to-transparent"}
        priority={index === 0}
        /* Ken Burns — key ผูกกับ id สไลด์ ภาพจึงเริ่มซูมใหม่ทุกครั้งที่เปลี่ยนสไลด์ */
        zoom
      />

      <Container className="relative z-10 pb-16 pt-40 sm:pb-20">
        <div key={slide.id} className="wecci-fade-up max-w-4xl text-white 2xl:max-w-5xl">
          {slide.eyebrow && (
            <p className="mb-4 inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm sm:text-sm">
              {slide.eyebrow}
            </p>
          )}
          <h1 className="text-3xl font-bold leading-snug tracking-tight drop-shadow-sm sm:text-4xl lg:text-5xl lg:leading-tight 2xl:text-6xl">
            {slide.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base text-slate-100 sm:text-lg 2xl:text-xl">
            {slide.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CtaButton href={slide.ctaHref} variant="outline">
              {slide.ctaLabel}
            </CtaButton>
            <CtaButton href="/services" variant="outline">
              บริการของเรา
            </CtaButton>
          </div>
        </div>

        <div
          className="mt-12 flex items-center gap-3"
          role="tablist"
          aria-label="เลือกแบนเนอร์"
        >
          {heroSlides.map((item, i) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={item.eyebrow ?? item.title}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-12 bg-white" : "w-6 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}

          <button
            type="button"
            onClick={() => setPaused((v) => !v)}
            aria-pressed={paused}
            className="ml-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/50 text-white transition hover:bg-white/15"
          >
            <span className="sr-only">{paused ? "เล่นสไลด์ต่อ" : "หยุดสไลด์"}</span>
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
              {paused ? <path d="M8 5v14l11-7z" /> : <path d="M7 5h4v14H7zm6 0h4v14h-4z" />}
            </svg>
          </button>
        </div>
      </Container>
    </section>
  );
}
