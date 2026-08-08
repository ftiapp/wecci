/**
 * ระดับในคณะผู้บริหาร เรียงจากบนลงล่างตามลำดับชั้น
 * หน้าเว็บจัดกลุ่มตามลำดับนี้ (ไฟล์ "use server" ส่งออกได้เฉพาะฟังก์ชัน จึงแยกมาไว้ที่นี่)
 *
 * แยกจาก staffLevels เพราะเป็นคนละโครงสร้าง — ชุดนี้เป็นคณะกรรมการ
 * ส่วน staffLevels เป็นสายบังคับบัญชาของพนักงานประจำ
 */
export const executiveLevels = [
  "ประธานสถาบัน",
  "รองประธานสถาบัน",
  "เลขานุการสถาบัน",
  "ที่ปรึกษา",
] as const;

export type ExecutiveLevel = (typeof executiveLevels)[number];

/** ลำดับของระดับ ใช้เรียงกลุ่ม — ระดับที่ไม่รู้จักให้ไปอยู่ท้ายสุด */
export function executiveLevelRank(level: string) {
  const index = executiveLevels.indexOf(level as ExecutiveLevel);
  return index < 0 ? executiveLevels.length : index;
}
