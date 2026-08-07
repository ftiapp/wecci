import "server-only";
import { prisma } from "@/lib/prisma";
import type { EventItem } from "@/lib/data/events";

/** แปลง Date เป็น YYYY-MM-DD ตามเวลาท้องถิ่น (เลี่ยง toISOString ที่ขยับวันตาม timezone) */
function toDateKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** ดึงกิจกรรมที่เผยแพร่แล้วสำหรับหน้า /news */
export async function getPublishedEvents(): Promise<EventItem[]> {
  try {
    const rows = await prisma.cms_events.findMany({
      where: { published: true },
      orderBy: { startDate: "asc" },
    });

    return rows.map((row) => ({
      id: String(row.id),
      date: toDateKey(row.startDate),
      endDate: row.endDate ? toDateKey(row.endDate) : undefined,
      title: row.title,
      time: row.time ?? undefined,
      place: row.place ?? undefined,
      category: row.category as EventItem["category"],
      image: row.image ?? undefined,
      registerUrl: row.registerUrl ?? undefined,
    }));
  } catch (error) {
    // ฐานข้อมูลล่มไม่ควรทำให้ทั้งหน้าพัง — ปฏิทินจะขึ้นสถานะว่างแทน
    console.error("[news] ดึงกิจกรรมไม่สำเร็จ", error);
    return [];
  }
}
