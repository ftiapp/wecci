"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { CtaButton } from "@/components/ui/CtaButton";
import { HeroPanel } from "@/components/ui/HeroPanel";
import { MediaBackdrop } from "@/components/ui/MediaBackdrop";
import { heroSlides } from "@/lib/data/hero";

const INTERVAL_MS = 7000;

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  /*
    สไลด์แรกคือภาพที่ผู้ใช้เห็นจริง ต้องได้แบนด์วิดท์และคิวย่อภาพฝั่งเซิร์ฟเวอร์
    ไปทั้งหมดก่อน ถ้าปล่อยให้อีกสองใบโหลดพร้อมกันตั้งแต่แรก ทั้งสามจะแย่งกัน
    แล้วใบที่คนกำลังมองกลับมาช้าที่สุด จึงรอจนหน้าโหลดเสร็จค่อยตามเก็บที่เหลือ
  */
  const [preloadRest, setPreloadRest] = useState(false);

  useEffect(() => {
    /* รอให้วาดจอแรกเสร็จก่อนเสมอ ไม่งั้นจะไปเริ่มโหลดแย่งกับใบแรกที่ยังไม่มา */
    let frame = 0;
    const start = () => {
      frame = requestAnimationFrame(() => setPreloadRest(true));
    };

    if (document.readyState === "complete") {
      start();
    } else {
      window.addEventListener("load", start);
    }

    return () => {
      window.removeEventListener("load", start);
      cancelAnimationFrame(frame);
    };
  }, []);

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
      {/*
        วางภาพทุกสไลด์ซ้อนกันไว้ตั้งแต่แรกแล้วสลับด้วย opacity
        ถ้า mount/unmount ตามสไลด์ที่เลือก เบราว์เซอร์จะต้องโหลดภาพใหม่ทุกครั้ง
        ระหว่างรอผู้ใช้จะเห็นพื้น gradient โผล่มาแทน
      */}
      {heroSlides.map((item, i) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <MediaBackdrop
            /*
              ตัดพาธภาพออกจนกว่าจะถึงคิว — สไลด์ที่เหลือซ้อนอยู่กลางจอทั้งที่ยัง
              ไม่ถูกแสดง loading="lazy" จึงไม่ช่วยอะไร เบราว์เซอร์ถือว่าอยู่ในสายตา
              และดึงทันที ต้องไม่ส่ง src ให้เลยถึงจะเลื่อนการโหลดได้จริง
              MediaBackdrop จะถอยไปใช้พื้นไล่เฉดของสไลด์นั้นระหว่างรอ
            */
            src={i === 0 || preloadRest ? item.image : undefined}
            alt={item.imageAlt ?? ""}
            gradient={item.gradient}
            /* ข้อความมีแถบสีรองของตัวเองแล้ว ตรงนี้จึงเหลือแค่เงาบาง ๆ กันปุ่มด้านล่างจม */
            overlay={item.overlay ?? "bg-gradient-to-t from-black/30 via-transparent to-transparent"}
            focus={item.focus}
            /*
              ใบแรกเป็น LCP จึง preload ให้เบราว์เซอร์เริ่มดึงตั้งแต่อ่านเจอใน head
              ที่เหลือรอจนหน้าโหลดเสร็จ (preloadRest) แล้วค่อยดึง — ยังทันก่อนสไลด์
              จะเลื่อนที่ 7 วินาที และไม่ไปแย่งช่วงที่ใบแรกกำลังโหลด
            */
            preload={i === 0}
            loading="eager"
            /* ต้องเป็นค่าที่มีใน images.qualities ของ next.config ไม่งั้นโดนปัดให้เงียบ ๆ */
            quality={85}
            /* ซูมเฉพาะสไลด์ที่แสดงอยู่ — สลับคลาสทำให้อนิเมชันเริ่มใหม่โดยไม่ต้อง remount */
            zoom={i === index}
          />
        </div>
      ))}

      <Container className="relative z-10 pb-12 pt-32 sm:pb-20 sm:pt-40">
        <HeroPanel key={slide.id} className="wecci-fade-up max-w-4xl text-white 2xl:max-w-5xl">
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
            <CtaButton href="/contact" variant="outline">
              ติดต่อเรา
            </CtaButton>
          </div>
        </HeroPanel>

        <div
          className="mt-8 flex items-center gap-3 sm:mt-12"
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
