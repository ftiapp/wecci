import "server-only";
import type { EventFormValues } from "@/components/admin/EventForm";
import { parseBlocks } from "@/lib/events/content";

type EventRow = {
  id: number;
  title: string;
  titleEn: string | null;
  excerpt: string | null;
  excerptEn: string | null;
  content: unknown;
  contentEn: unknown;
  category: string;
  startDate: Date;
  endDate: Date | null;
  time: string | null;
  place: string | null;
  placeEn: string | null;
  image: string | null;
  registerUrl: string | null;
  registerOpenAt: Date | null;
  registerCloseAt: Date | null;
  published: boolean;
  tags: { id: number }[];
};

/** คืนค่าเป็น YYYY-MM-DD สำหรับ <input type="date"> (คอลัมน์เก็บเป็นเที่ยงคืน UTC) */
function toInputDate(date: Date | null) {
  return date ? date.toISOString().slice(0, 10) : "";
}

/** ค่าเริ่มต้นของฟอร์มตอนเพิ่มกิจกรรมใหม่ */
export function emptyEventValues(): EventFormValues {
  return {
    title: "",
    titleEn: "",
    excerpt: "",
    excerptEn: "",
    content: [],
    contentEn: [],
    category: "อบรม",
    startDate: "",
    endDate: "",
    time: "",
    place: "",
    placeEn: "",
    image: "",
    registerUrl: "",
    registerOpenAt: "",
    registerCloseAt: "",
    tagIds: [],
    published: true,
  };
}

/** แปลงแถวจากฐานข้อมูลเป็นค่าตั้งต้นของฟอร์มแก้ไข */
export function toEventValues(row: EventRow): EventFormValues {
  return {
    id: row.id,
    title: row.title,
    titleEn: row.titleEn ?? "",
    excerpt: row.excerpt ?? "",
    excerptEn: row.excerptEn ?? "",
    content: parseBlocks(row.content),
    contentEn: parseBlocks(row.contentEn),
    category: row.category,
    startDate: toInputDate(row.startDate),
    endDate: toInputDate(row.endDate),
    time: row.time ?? "",
    place: row.place ?? "",
    placeEn: row.placeEn ?? "",
    image: row.image ?? "",
    registerUrl: row.registerUrl ?? "",
    registerOpenAt: toInputDate(row.registerOpenAt),
    registerCloseAt: toInputDate(row.registerCloseAt),
    tagIds: row.tags.map((tag) => tag.id),
    published: row.published,
  };
}
