"use client";

import { useEffect, useState } from "react";

/** แถบบอกความคืบหน้าการอ่าน ติดขอบบนสุดของหน้าจอ */
export function ReadingProgress() {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollable = document.body.scrollHeight - window.innerHeight;
      setPercent(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-60 h-0.5 bg-transparent" aria-hidden>
      <div
        className="h-full bg-gradient-to-r from-wecci-blue to-wecci-aqua transition-[width] duration-150 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
