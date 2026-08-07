/** ประเภทกิจกรรมที่เลือกได้ในหลังบ้าน (ไฟล์ "use server" ส่งออกได้เฉพาะฟังก์ชัน จึงแยกมาไว้ที่นี่) */
export const eventCategories = ["อบรม", "สัมมนา", "ประชุม", "ศึกษาดูงาน"] as const;

export type EventCategory = (typeof eventCategories)[number];
