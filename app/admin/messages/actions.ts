"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";

/** สลับสถานะอ่าน/ยังไม่อ่านของข้อความหนึ่งรายการ */
export async function toggleReadAction(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  const isRead = formData.get("isRead") === "true";
  if (!Number.isInteger(id)) return;

  await prisma.cms_contact_messages.update({
    where: { id },
    data: { isRead: !isRead },
  });

  revalidatePath("/admin/messages");
  // ป้ายแดงโผล่ที่หน้าภาพรวมด้วย ต้องล้างแคชหน้านั้นพร้อมกัน
  revalidatePath("/admin");
}

/** ลบข้อความถาวร */
export async function deleteMessageAction(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await prisma.cms_contact_messages.delete({ where: { id } });

  revalidatePath("/admin/messages");
  // ป้ายแดงโผล่ที่หน้าภาพรวมด้วย ต้องล้างแคชหน้านั้นพร้อมกัน
  revalidatePath("/admin");
}
