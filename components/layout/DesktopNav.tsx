"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Container } from "@/components/ui/Container";
import { MediaBackdrop } from "@/components/ui/MediaBackdrop";
import { mainNav } from "@/lib/site-config";

/**
 * เมนูหลักแบบเมกะเมนูเต็มความกว้าง เปิด/ปิดด้วยการคลิก
 * สถานะเปิดถูกยกไปไว้ที่ HeaderShell เพราะเฮดเดอร์ต้องเปลี่ยนเป็นพื้นทึบตามไปด้วย
 */
export function DesktopNav({
  solid,
  openHref,
  onOpenChange,
}: {
  solid: boolean;
  openHref: string | null;
  onOpenChange: (href: string | null) => void;
}) {
  const navRef = useRef<HTMLDivElement>(null);

  // ปิดเมื่อกด Escape หรือคลิกนอกพื้นที่เมนู
  useEffect(() => {
    if (!openHref) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onOpenChange(null);
    }
    function onPointerDown(e: PointerEvent) {
      if (!navRef.current?.contains(e.target as Node)) onOpenChange(null);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openHref, onOpenChange]);

  const activeItem = mainNav.find((item) => item.href === openHref);
  const idleText = solid
    ? "text-slate-700 hover:text-wecci-blue"
    : // พื้นโปร่งใสทับภาพ — ใส่เงาใต้ตัวอักษรให้อ่านออกแม้ภาพช่วงนั้นสว่าง
      "text-white hover:text-white/70 [text-shadow:0_1px_3px_rgba(0,0,0,0.55)]";

  return (
    <div ref={navRef} className="hidden lg:block">
      <nav aria-label="เมนูหลัก">
        <ul className="flex items-center gap-1">
          {mainNav.map((item) => {
            const isOpen = openHref === item.href;

            if (!item.children) {
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block px-3 py-6 text-sm font-semibold transition ${idleText}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            }

            /*
              กดที่ชื่อเมนู = กางเมกะเมนูอย่างเดียว ไม่พาไปไหน
              จะเปลี่ยนหน้าได้ก็ต่อเมื่อเลือกหัวข้อย่อยในแผงที่กางออกมา
            */
            return (
              <li key={item.href} className="relative flex items-center">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls="mega-menu-panel"
                  onClick={() => onOpenChange(isOpen ? null : item.href)}
                  onMouseEnter={() => onOpenChange(item.href)}
                  className={`flex items-center gap-1 px-3 py-6 text-sm font-semibold transition ${
                    isOpen ? "text-wecci-blue" : idleText
                  }`}
                >
                  {item.label}
                  <svg
                    viewBox="0 0 12 12"
                    className={`h-3 w-3 transition ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    aria-hidden
                  >
                    <path d="m3 4.5 3 3 3-3" strokeWidth={1.6} strokeLinecap="round" />
                  </svg>
                </button>

                {/* ขีดเน้นใต้เมนูที่เปิดอยู่ */}
                <span
                  className={`pointer-events-none absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-wecci-blue transition-opacity ${
                    isOpen ? "opacity-100" : "opacity-0"
                  }`}
                  aria-hidden
                />
              </li>
            );
          })}
        </ul>
      </nav>

      {activeItem?.children && (
        <div
          id="mega-menu-panel"
          className="absolute inset-x-0 top-full z-40 border-t border-slate-200 bg-white shadow-[0_18px_40px_-24px_rgba(10,58,92,.55)]"
        >
          {/* จำกัดความกว้างแผงไม่ให้ยืดเต็มจอ รายการจึงไม่กระจายจนหายาก */}
          <Container>
            <div className="mx-auto grid max-w-5xl grid-cols-12 gap-10 py-10">
              {/* คอลัมน์ซ้าย: ภาพประกอบ + ลิงก์ไปหน้าหลักของหมวด */}
              <div className="col-span-5">
                <div className="relative flex aspect-16/10 items-end overflow-hidden rounded-2xl p-5">
                  <MediaBackdrop
                    src={activeItem.featureImage}
                    alt={activeItem.featureCaption ?? ""}
                    gradient={activeItem.featureGradient ?? "from-wecci-navy to-wecci-aqua"}
                    overlay="bg-gradient-to-t from-wecci-navy/85 to-transparent"
                    sizes="40vw"
                  />
                  {activeItem.featureCaption && (
                    <p className="relative z-10 text-sm font-semibold text-white">
                      {activeItem.featureCaption}
                    </p>
                  )}
                </div>

                <Link
                  href={activeItem.href}
                  className="group mt-4 inline-flex items-center gap-2 text-sm font-bold text-wecci-blue transition hover:gap-3"
                >
                  ดู{activeItem.label}ทั้งหมด
                  <span aria-hidden>→</span>
                </Link>
              </div>

              {/* คอลัมน์ขวา: รายการเมนูย่อยเรียงเป็นแถวเดียว อ่านไล่จากบนลงล่าง */}
              <div className="col-span-7">
                <p className="mb-3 border-b border-slate-200 pb-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                  หัวข้อใน{activeItem.label}
                </p>

                <ul className="divide-y divide-slate-100">
                  {activeItem.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className="group flex items-center gap-4 rounded-xl px-3 py-3.5 transition hover:bg-wecci-sand"
                      >
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300 transition group-hover:bg-wecci-aqua"
                          aria-hidden
                        />
                        <span className="flex-1">
                          <span className="block font-semibold text-wecci-navy transition group-hover:text-wecci-blue">
                            {child.label}
                          </span>
                          {child.description && (
                            <span className="mt-0.5 block text-xs text-slate-500">
                              {child.description}
                            </span>
                          )}
                        </span>
                        <span
                          className="shrink-0 text-wecci-blue opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
                          aria-hidden
                        >
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </div>
      )}
    </div>
  );
}
