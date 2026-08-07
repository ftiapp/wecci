import Image from "next/image";
import Link from "next/link";
import { categoryColors, thaiMonths, type EventItem } from "@/lib/data/events";

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

export type EventStatus = "upcoming" | "ongoing" | "done";

const statusStyles: Record<EventStatus, string> = {
  upcoming: "bg-wecci-aqua text-white",
  ongoing: "bg-wecci-mint text-white",
  done: "bg-slate-500 text-white",
};

const statusLabels: Record<EventStatus, string> = {
  upcoming: "เร็ว ๆ นี้",
  ongoing: "กำลังจัด",
  done: "เสร็จสิ้น",
};

/** ช่วงวันที่แบบสั้น เช่น "19 – 21 ส.ค." */
function dateRange(event: EventItem) {
  const start = new Date(`${event.date}T00:00:00`);
  const month = monthShort[start.getMonth()];

  if (!event.endDate || event.endDate === event.date) return `${start.getDate()} ${month}`;

  const end = new Date(`${event.endDate}T00:00:00`);
  const endMonth = monthShort[end.getMonth()];

  return start.getMonth() === end.getMonth()
    ? `${start.getDate()} – ${end.getDate()} ${month}`
    : `${start.getDate()} ${month} – ${end.getDate()} ${endMonth}`;
}

export function EventCard({
  event,
  status,
  layout = "grid",
}: {
  event: EventItem;
  status: EventStatus;
  layout?: "grid" | "list";
}) {
  const start = new Date(`${event.date}T00:00:00`);
  const end =
    event.endDate && event.endDate !== event.date
      ? new Date(`${event.endDate}T00:00:00`)
      : null;
  const detailHref = `/news/events/${event.id}`;

  /** บล็อกวันที่มุมซ้าย ใช้ทั้งสองมุมมอง */
  const dateBlock = (
    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-wecci-blue text-white shadow-md">
      <span className="text-base font-bold leading-none">
        {end ? `${start.getDate()}–${end.getDate()}` : start.getDate()}
      </span>
      <span className="mt-0.5 text-[10px]">{monthShort[start.getMonth()]}</span>
    </div>
  );

  const badges = (
    <>
      <span
        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold text-white shadow ${
          categoryColors[event.category]
        }`}
      >
        {event.category}
      </span>
      <span
        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold shadow ${statusStyles[status]}`}
      >
        {statusLabels[status]}
      </span>
    </>
  );

  const footer = (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
      <span className="flex items-center gap-2 text-xs text-slate-500">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          aria-hidden
        >
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M8 3v4M16 3v4M3 10h18" />
        </svg>
        {dateRange(event)}
        {event.time && ` · ${event.time}`}
      </span>

      <div className="flex items-center gap-2">
        <Link
          href={detailHref}
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-wecci-navy to-wecci-blue px-4 py-1.5 text-xs font-semibold text-white transition hover:from-wecci-blue hover:to-wecci-aqua"
        >
          รายละเอียด
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>

        {event.registerUrl && status !== "done" && (
        <a
          href={event.registerUrl}
          target="_blank"
          rel="noreferrer"
          title="เปิดลิงก์ลงทะเบียน"
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-4 py-1.5 text-xs font-semibold text-wecci-navy transition hover:border-wecci-blue hover:text-wecci-blue"
        >
          ลงทะเบียน
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        </a>
        )}
      </div>
    </div>
  );

  /** พื้นที่โปสเตอร์ — ถ้ายังไม่มีรูปจะแสดงไล่เฉดสีพร้อมไอคอนแทน */
  const poster = (
    // กรอบขาวรอบรูป ให้โปสเตอร์ดูเหมือนภาพติดกรอบไม่ชนขอบการ์ด
    <Link href={detailHref} className={`block bg-white p-2.5 ${layout === "list" ? "h-full" : ""}`}>
      <div
        className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-wecci-navy via-wecci-blue to-wecci-aqua ${
          layout === "grid" ? "aspect-3/4" : "aspect-4/3 h-full w-full"
        }`}
      >
      {event.image ? (
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes={layout === "grid" ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" : "240px"}
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-white/40">
          <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden>
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M8 3v4M16 3v4M3 10h18" strokeLinecap="round" />
          </svg>
        </span>
      )}

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">{badges}</div>
      </div>
    </Link>
  );

  if (layout === "list") {
    return (
      <li className="group flex overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-wecci-aqua hover:shadow-lg">
        <div className="w-48 shrink-0 sm:w-60">{poster}</div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex gap-4">
            {dateBlock}
            <div>
              <Link href={detailHref} className="font-bold text-wecci-navy transition hover:text-wecci-blue">
                {event.title}
              </Link>
              {event.place && <p className="mt-1 text-sm text-slate-500">{event.place}</p>}
            </div>
          </div>
          <div className="mt-auto">{footer}</div>
        </div>
      </li>
    );
  }

  return (
    <li className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white wecci-shine relative transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-wecci-aqua hover:shadow-2xl">
      {poster}

      <div className="flex flex-1 flex-col p-4">
        <div className="flex gap-3">
          {dateBlock}
          <div className="min-w-0">
            <Link
              href={`/news/events/${event.id}`}
              className="line-clamp-2 text-sm font-bold leading-snug text-wecci-navy transition hover:text-wecci-blue"
            >
              {event.title}
            </Link>
            {event.place && <p className="mt-1 line-clamp-1 text-xs text-slate-500">{event.place}</p>}
          </div>
        </div>

        <div className="mt-auto">{footer}</div>
      </div>
    </li>
  );
}

export { thaiMonths };
