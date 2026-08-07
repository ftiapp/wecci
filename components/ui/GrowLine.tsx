"use client";

import { useEffect, useRef, useState } from "react";

/**
 * เส้นแนวตั้งที่ค่อย ๆ ยืดลงมาเมื่อเลื่อนมาถึง ใช้เชื่อมชั้นของผังองค์กร
 * ยืดครั้งเดียวแล้วหยุด และข้ามการเคลื่อนไหวให้อัตโนมัติเมื่อผู้ใช้ตั้งค่าลดการเคลื่อนไหว
 */
export function GrowLine({
  className = "",
  spark = false,
}: {
  className?: string;
  /** ปล่อยจุดแสงวิ่งลงหนึ่งรอบตอนเส้นยืดเสร็จ ใช้เฉพาะเส้นหลักของแต่ละชั้น */
  spark?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [grown, setGrown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGrown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGrown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden
      className={`relative mx-auto block w-px origin-top bg-slate-300 ${className}`}
      style={{
        transform: `scaleY(${grown ? 1 : 0})`,
        transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* จุดแสงวิ่งลงตามเส้นหนึ่งรอบ ย้ำทิศทางการอ่านจากชั้นบนลงชั้นล่าง */}
      {spark && grown && (
        <span className="wecci-spark absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-wecci-aqua shadow-[0_0_8px_2px_rgba(0,175,225,0.45)]" />
      )}
    </span>
  );
}
