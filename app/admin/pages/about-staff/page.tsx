import { redirect } from "next/navigation";

/**
 * หน้าโครงสร้างบุคลากรไม่ได้แก้แบบบล็อกข้อความอีกแล้ว
 * ย้ายไปจัดการเป็นรายชื่อที่ /admin/staff — ลิงก์เก่าจึงพามาที่นั่นให้เลย
 */
export default function AboutStaffRedirect() {
  redirect("/admin/staff");
}
