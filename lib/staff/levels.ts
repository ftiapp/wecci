/**
 * ระดับตำแหน่งในโครงสร้างบุคลากร เรียงจากบนลงล่างตามผังองค์กร
 * หน้าเว็บจัดกลุ่มตามลำดับนี้ (ไฟล์ "use server" ส่งออกได้เฉพาะฟังก์ชัน จึงแยกมาไว้ที่นี่)
 */
export const staffLevels = [
  "ผู้อำนวยการ",
  "ผู้จัดการ",
  "รองผู้จัดการ",
  "ผู้ชำนาญการ",
  "เจ้าหน้าที่อาวุโส",
  "เจ้าหน้าที่",
  "เจ้าหน้าที่โครงการ",
] as const;

export type StaffLevel = (typeof staffLevels)[number];

/** ลำดับของระดับ ใช้เรียงกลุ่ม — ระดับที่ไม่รู้จักให้ไปอยู่ท้ายสุด */
export function levelRank(level: string) {
  const index = staffLevels.indexOf(level as StaffLevel);
  return index < 0 ? staffLevels.length : index;
}
