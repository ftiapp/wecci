"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { DesktopNav } from "@/components/layout/DesktopNav";
import { Logo } from "@/components/layout/Logo";
import { MobileNav } from "@/components/layout/MobileNav";
import { siteConfig } from "@/lib/site-config";

/**
 * เฮดเดอร์โปร่งใสตอนอยู่บนสุด (ทับภาพ hero) แล้วเปลี่ยนเป็นพื้นขาวเมื่อเลื่อนลง
 * ช่องทางติดต่อรวมอยู่แถวเดียวกับเมนู ไม่มีแถบบนสุดแยกอีก
 */
export function HeaderShell() {
  const [openHref, setOpenHref] = useState<string | null>(null);
  const [solid, setSolid] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpenHref(null);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // เมนูที่กางอยู่ต้องมีพื้นทึบเสมอ ไม่งั้นอ่านไม่ออกตอนทับภาพ
  const opaque = solid || openHref !== null;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        opaque ? "bg-white shadow-sm" : "bg-gradient-to-b from-black/45 to-transparent"
      }`}
    >
      <Container className="flex h-20 items-center justify-between gap-4">
        <Logo tone={opaque ? "dark" : "light"} />

        <div className="flex items-center gap-3">
          <DesktopNav solid={opaque} openHref={openHref} onOpenChange={setOpenHref} />

          {/* ติดต่อ — ซ่อนบนจอที่เมนูกินพื้นที่จนไม่พอ */}
          <div
            className={`hidden items-center gap-4 border-l pl-4 text-xs font-semibold transition-colors duration-300 2xl:flex ${
              opaque
                ? "border-slate-200 text-wecci-navy"
                : "border-white/30 text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.55)]"
            }`}
          >
            <a
              href={`tel:${siteConfig.hotlineTel}`}
              className={`transition ${opaque ? "hover:text-wecci-blue" : "hover:text-wecci-aqua"}`}
            >
              โทร. {siteConfig.hotline}
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className={`transition ${opaque ? "hover:text-wecci-blue" : "hover:text-wecci-aqua"}`}
            >
              {siteConfig.email}
            </a>
          </div>

          <MobileNav solid={opaque} />
        </div>
      </Container>
    </header>
  );
}
