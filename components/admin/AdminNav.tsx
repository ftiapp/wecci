"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { UnreadBadge } from "@/components/admin/UnreadBadge";

export type NavChild = { href: string; label: string };

export type NavItem = {
  label: string;
  icon: string;
  /** เมนูเดี่ยว มี href / เมนูกลุ่ม มี children */
  href?: string;
  children?: NavChild[];
  /** ตัวเลขป้ายแดง เช่น ข้อความที่ยังไม่อ่าน */
  badge?: number;
};

const linkClass =
  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-white/10 hover:text-white";

/** เมนูแถบข้างของหลังบ้าน — หัวข้อใหญ่กดกางเป็นหัวข้อย่อยได้ */
export function AdminNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  // กลุ่มที่มีหน้าปัจจุบันอยู่ข้างใน ให้กางไว้ตั้งแต่แรก
  const [openGroups, setOpenGroups] = useState<string[]>(() =>
    items
      .filter((item) => item.children?.some((child) => pathname.startsWith(child.href)))
      .map((item) => item.label),
  );

  function toggle(label: string) {
    setOpenGroups((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label],
    );
  }

  return (
    <nav className="flex-1">
      <ul className="space-y-1">
        {items.map((item) => {
          const open = openGroups.includes(item.label);
          const activeChild = item.children?.some((child) => pathname === child.href);

          if (!item.children) {
            const active = pathname === item.href;

            return (
              <li key={item.label}>
                <Link
                  href={item.href ?? "#"}
                  className={`${linkClass} ${active ? "bg-white/10 text-white" : ""}`}
                >
                  <NavIcon path={item.icon} />
                  <span className="flex-1">{item.label}</span>
                  {typeof item.badge === "number" && <UnreadBadge count={item.badge} />}
                </Link>
              </li>
            );
          }

          return (
            <li key={item.label}>
              <button
                type="button"
                onClick={() => toggle(item.label)}
                aria-expanded={open}
                className={`${linkClass} w-full text-left ${
                  activeChild ? "text-white" : ""
                }`}
              >
                <NavIcon path={item.icon} />
                <span className="flex-1">{item.label}</span>
                {typeof item.badge === "number" && <UnreadBadge count={item.badge} />}
                <svg
                  viewBox="0 0 24 24"
                  className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {open && (
                <ul className="mt-1 ml-6 space-y-0.5 border-l border-white/10 pl-3">
                  {item.children.map((child) => {
                    const active = pathname === child.href;

                    return (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className={`block rounded-lg px-3 py-2 text-sm transition ${
                            active
                              ? "bg-white/10 font-semibold text-white"
                              : "text-slate-400 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          {child.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function NavIcon({ path }: { path: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={path} />
    </svg>
  );
}
