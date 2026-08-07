"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ตัวเลขวิ่งนับขึ้นเมื่อเลื่อนมาถึง
 * นับจากค่าเริ่มต้นถึงค่าจริงด้วย requestAnimationFrame แล้วหยุด
 */
export function CountUp({
  to,
  from,
  duration = 1400,
  className = "",
}: {
  to: number;
  /** ค่าเริ่มนับ ปกติใช้ค่าที่ไม่ห่างจนตัวเลขกระโดดเร็วเกินไป */
  from?: number;
  duration?: number;
  className?: string;
}) {
  const start = from ?? Math.max(0, to - 60);
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(start);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(to);
      return;
    }

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const startedAt = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - startedAt) / duration, 1);
          // ชะลอตอนท้ายให้ดูนุ่ม
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Math.round(start + (to - start) * eased));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to, start, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
