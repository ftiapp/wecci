"use client";

import { useState } from "react";

/** แถบพันธกิจแบบพับเปิด-ปิด กดเปิดได้ทีละข้อ */
export function MissionAccordion({
  items,
}: {
  items: readonly { title: string; detail: string }[];
}) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="mx-auto max-w-4xl space-y-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i;

        return (
          <div
            key={item.title}
            className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
              isOpen
                ? "border-wecci-blue shadow-lg"
                : "border-slate-200 hover:border-wecci-aqua hover:shadow-md"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-4 p-5 text-left"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors duration-300 ${
                  isOpen ? "bg-wecci-blue text-white" : "bg-wecci-sand text-wecci-blue"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <span
                className={`flex-1 font-bold transition-colors duration-300 ${
                  isOpen ? "text-wecci-blue" : "text-wecci-navy"
                }`}
              >
                {item.title}
              </span>

              <span
                className={`shrink-0 text-wecci-blue transition-transform duration-300 ${
                  isOpen ? "rotate-45" : ""
                }`}
                aria-hidden
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </button>

            {/* ใช้ grid-rows เพื่อให้ความสูงค่อย ๆ กางออกได้โดยไม่ต้องกำหนดความสูงตายตัว */}
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="border-t border-slate-100 px-5 pb-5 pt-4 text-slate-600">
                  {item.detail}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
