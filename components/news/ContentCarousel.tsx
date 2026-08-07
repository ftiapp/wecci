"use client";

import Image from "next/image";
import { useState } from "react";

/** สไลด์รูปในบล็อกเนื้อหา — ใช้เมื่อบล็อกมีรูปตั้งแต่ 2 รูปขึ้นไป */
export function ContentCarousel({ paths, alt }: { paths: string[]; alt: string }) {
  const [index, setIndex] = useState(0);

  function step(delta: number) {
    setIndex((current) => (current + delta + paths.length) % paths.length);
  }

  return (
    <div>
      <div className="relative aspect-16/9 overflow-hidden rounded-2xl bg-slate-100">
        <Image
          key={paths[index]}
          src={paths[index]}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
        />

        <NavButton side="left" onClick={() => step(-1)} />
        <NavButton side="right" onClick={() => step(1)} />

        <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">
          {index + 1} / {paths.length}
        </span>
      </div>

      <div className="mt-3 flex justify-center gap-1.5">
        {paths.map((path, i) => (
          <button
            key={path}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`ไปที่รูปที่ ${i + 1}`}
            className={`h-2 rounded-full transition ${
              i === index ? "w-6 bg-wecci-blue" : "w-2 bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function NavButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "รูปก่อนหน้า" : "รูปถัดไป"}
      className={`absolute top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-wecci-navy shadow transition hover:bg-white ${
        side === "left" ? "left-3" : "right-3"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d={side === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
      </svg>
    </button>
  );
}
