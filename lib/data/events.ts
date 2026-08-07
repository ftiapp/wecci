export type EventItem = {
  id: string;
  /** วันที่เริ่มกิจกรรม รูปแบบ YYYY-MM-DD */
  date: string;
  /** วันสิ้นสุด (ถ้าเป็นกิจกรรมหลายวัน) */
  endDate?: string;
  title: string;
  time?: string;
  place?: string;
  category: "อบรม" | "สัมมนา" | "ประชุม" | "ศึกษาดูงาน";
  /** โปสเตอร์กิจกรรม วางไฟล์ที่ public/images/events/ (แนวตั้ง 3:4 หรือ 4:5) */
  image?: string;
  /** ลิงก์ลงทะเบียน ถ้าไม่ใส่จะไม่แสดงปุ่ม */
  registerUrl?: string;
};

export const categoryColors: Record<EventItem["category"], string> = {
  อบรม: "bg-wecci-blue",
  สัมมนา: "bg-wecci-aqua",
  ประชุม: "bg-wecci-navy",
  ศึกษาดูงาน: "bg-wecci-mint",
};

export const thaiMonths = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

export const thaiWeekdays = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

/** คืนรายการวันที่ทั้งหมดที่กิจกรรมกินเวลา (รองรับกิจกรรมหลายวัน) */
export function eventDates(event: EventItem): string[] {
  if (!event.endDate) return [event.date];

  const dates: string[] = [];
  const start = new Date(`${event.date}T00:00:00`);
  const end = new Date(`${event.endDate}T00:00:00`);

  for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}
