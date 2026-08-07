import "server-only";
import { prisma } from "@/lib/prisma";

/** จำนวนข้อความที่ยังไม่ได้อ่าน ใช้ทำป้ายแดงบนเมนูและการ์ดหน้าภาพรวม */
export async function countUnreadMessages() {
  try {
    return await prisma.cms_contact_messages.count({ where: { isRead: false } });
  } catch (error) {
    // ถ้าฐานข้อมูลล่ม ไม่ควรทำให้ทั้งหน้าหลังบ้านพัง — แค่ไม่ต้องขึ้นป้าย
    console.error("[admin] นับข้อความที่ยังไม่อ่านไม่สำเร็จ", error);
    return 0;
  }
}
