"use client";

import { useEffect, useState } from "react";

/** ปุ่มกลับขึ้นบนสุด โผล่เมื่อเลื่อนลงไปพอสมควรแล้ว */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-wecci-navy to-wecci-blue text-white shadow-xl shadow-wecci-navy/25 transition-all duration-300 hover:scale-110 hover:shadow-2xl ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <span className="sr-only">กลับขึ้นด้านบน</span>
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 19V5m0 0-6 6m6-6 6 6" />
      </svg>
    </button>
  );
}
