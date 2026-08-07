"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { mainNav, siteConfig } from "@/lib/site-config";

export function MobileNav({ solid = true }: { solid?: boolean }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const pathname = usePathname();

  // ปิดเมนูอัตโนมัติเมื่อเปลี่ยนหน้า
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className={`flex h-11 w-11 items-center justify-center rounded-lg border transition ${
          solid || open
            ? "border-slate-200 text-wecci-navy"
            : "border-white/50 text-white"
        }`}
      >
        <span className="sr-only">{open ? "ปิดเมนู" : "เปิดเมนู"}</span>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
          {open ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {open && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full z-50 max-h-[80vh] overflow-y-auto border-t border-slate-200 bg-white shadow-xl"
        >
          <ul className="divide-y divide-slate-100 px-5 py-2">
            {mainNav.map((item) => {
              const isOpen = expanded === item.href;
              return (
                <li key={item.href} className="py-1">
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.href}
                      className="block flex-1 py-3 text-sm font-semibold text-wecci-navy"
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : item.href)}
                        aria-expanded={isOpen}
                        className="p-3 text-slate-400"
                      >
                        <span className="sr-only">แสดงเมนูย่อยของ {item.label}</span>
                        <svg
                          viewBox="0 0 12 12"
                          className={`h-3 w-3 transition ${isOpen ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          aria-hidden
                        >
                          <path d="m3 4.5 3 3 3-3" strokeWidth={1.8} strokeLinecap="round" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {item.children && isOpen && (
                    <ul className="mb-2 space-y-1 rounded-xl bg-wecci-sand p-2">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block rounded-lg px-3 py-2 text-sm text-slate-600"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="bg-wecci-navy px-5 py-4 text-sm text-white">
            <p>โทร. {siteConfig.hotline}</p>
            <p className="text-slate-300">{siteConfig.email}</p>
          </div>
        </div>
      )}
    </div>
  );
}
