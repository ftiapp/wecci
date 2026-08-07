"use client";

import { useMemo, useState } from "react";
import type { EventItem } from "@/lib/data/events";
import { EventCard } from "@/components/news/EventCard";

type StatusKey = "all" | "upcoming" | "ongoing" | "done";

const statusTabs: { key: StatusKey; label: string }[] = [
  { key: "all", label: "ทั้งหมด" },
  { key: "upcoming", label: "เร็ว ๆ นี้" },
  { key: "ongoing", label: "กำลังจัด" },
  { key: "done", label: "เสร็จสิ้น" },
];

const monthShort = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

/** สถานะของกิจกรรมเทียบกับวันที่อ้างอิง */
function statusOf(event: EventItem, today: Date): Exclude<StatusKey, "all"> {
  const start = new Date(`${event.date}T00:00:00`);
  const end = new Date(`${event.endDate ?? event.date}T23:59:59`);

  if (today < start) return "upcoming";
  if (today > end) return "done";
  return "ongoing";
}

export function EventBoard({ events }: { events: EventItem[] }) {
  // อ่านวันปัจจุบันครั้งเดียวตอน mount กันค่าเปลี่ยนระหว่าง render
  const [today] = useState(() => new Date());
  const [status, setStatus] = useState<StatusKey>("all");
  const [openOnly, setOpenOnly] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");

  const years = useMemo(
    () => [...new Set(events.map((e) => Number(e.date.slice(0, 4))))].sort(),
    [events],
  );
  const [year, setYear] = useState(years[0]);
  /** -1 = ทั้งปี */
  const [month, setMonth] = useState(-1);

  const filtered = useMemo(
    () =>
      events
        .filter((event) => {
          const d = new Date(`${event.date}T00:00:00`);
          if (d.getFullYear() !== year) return false;
          if (month >= 0 && d.getMonth() !== month) return false;
          if (status !== "all" && statusOf(event, today) !== status) return false;
          if (openOnly && statusOf(event, today) === "done") return false;
          return true;
        })
        .sort((a, b) => a.date.localeCompare(b.date)),
    [events, year, month, status, openOnly, today],
  );

  // ยังไม่มีกิจกรรมในระบบ — ไม่ต้องแสดงแถบตัวกรองที่ไม่มีอะไรให้กรอง
  if (events.length === 0) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 p-12 text-center text-sm text-slate-400">
        ยังไม่มีกิจกรรมในช่วงนี้ โปรดติดตามประกาศจากสถาบันฯ อีกครั้ง
      </div>
    );
  }

  return (
    <div>
      {/* แถบเครื่องมือ: สถานะ / ปี / มุมมอง */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatus(tab.key)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                status === tab.key
                  ? "bg-wecci-blue text-white shadow"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}

          <span className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" aria-hidden />

          <button
            type="button"
            onClick={() => setOpenOnly((v) => !v)}
            aria-pressed={openOnly}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${
              openOnly
                ? "bg-wecci-mint/15 text-wecci-mint"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-wecci-mint" aria-hidden />
            เปิดลงทะเบียน
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="relative">
            <span className="sr-only">เลือกปี</span>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="appearance-none rounded-full bg-wecci-navy px-5 py-2 pr-9 text-sm font-semibold text-white outline-none"
            >
              {years.map((y) => (
                <option key={y} value={y} className="text-slate-800">
                  {y + 543}
                </option>
              ))}
            </select>
            <svg
              viewBox="0 0 12 12"
              className="pointer-events-none absolute right-3.5 top-1/2 h-3 w-3 -translate-y-1/2 text-white"
              fill="none"
              stroke="currentColor"
              aria-hidden
            >
              <path d="m3 4.5 3 3 3-3" strokeWidth={1.8} strokeLinecap="round" />
            </svg>
          </label>

          <div className="flex gap-1 rounded-full bg-slate-100 p-1">
            {(["list", "grid"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setView(mode)}
                aria-pressed={view === mode}
                aria-label={mode === "list" ? "มุมมองรายการ" : "มุมมองตาราง"}
                className={`flex h-8 w-9 items-center justify-center rounded-full transition ${
                  view === mode ? "bg-wecci-navy text-white" : "text-slate-500 hover:text-wecci-navy"
                }`}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                  {mode === "list" ? (
                    <path d="M4 6h16v2H4zM4 11h16v2H4zM4 16h16v2H4z" />
                  ) : (
                    <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
                  )}
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* แท็บเดือน */}
      <div className="mt-6 overflow-x-auto border-b border-slate-200">
        {/* จอเล็กเลื่อนแนวนอน จอใหญ่กระจายเต็มความกว้างเท่า ๆ กัน */}
        <ul className="flex min-w-max gap-1 lg:min-w-0 lg:w-full">
          {[{ value: -1, label: "ทั้งปี" }, ...monthShort.map((m, i) => ({ value: i, label: m }))].map(
            (tab) => (
              <li key={tab.value} className="lg:flex-1">
                <button
                  type="button"
                  onClick={() => setMonth(tab.value)}
                  className={`relative w-full px-5 py-3 text-center text-sm font-semibold transition ${
                    month === tab.value ? "text-wecci-blue" : "text-slate-500 hover:text-wecci-navy"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-wecci-blue transition-opacity ${
                      month === tab.value ? "opacity-100" : "opacity-0"
                    }`}
                    aria-hidden
                  />
                </button>
              </li>
            ),
          )}
        </ul>
      </div>

      {/* รายการกิจกรรม */}
      {filtered.length === 0 ? (
        <div className="mt-8 flex min-h-48 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 text-sm text-slate-400">
          ไม่มีกิจกรรมตามเงื่อนไขที่เลือก
        </div>
      ) : (
        <ul
          className={
            view === "grid"
              ? "mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "mt-8 flex flex-col gap-4"
          }
        >
          {filtered.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              status={statusOf(event, today)}
              layout={view}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
