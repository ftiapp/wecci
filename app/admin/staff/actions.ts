"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";
import { staffLevels, type StaffLevel } from "@/lib/staff/levels";

export type StaffFormState = { error?: string };

function optional(formData: FormData, name: string, max: number) {
  const value = String(formData.get(name) ?? "").trim();
  return value ? value.slice(0, max) : null;
}

function readForm(formData: FormData) {
  const nameTh = String(formData.get("nameTh") ?? "").trim();

  if (!nameTh) return { error: "กรุณากรอกชื่อภาษาไทย" } as const;

  const level = String(formData.get("level") ?? "").trim();
  if (!staffLevels.includes(level as StaffLevel)) {
    return { error: "กรุณาเลือกระดับตำแหน่ง" } as const;
  }

  const email = optional(formData, "email", 150);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "รูปแบบอีเมลไม่ถูกต้อง" } as const;
  }

  return {
    data: {
      level,
      nameTh: nameTh.slice(0, 200),
      phone: optional(formData, "phone", 50),
      email,
      photo: optional(formData, "photo", 255),
      sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
      newRow: formData.get("newRow") === "on",
      published: formData.get("published") === "on",
    },
  } as const;
}

function revalidateStaff() {
  revalidatePath("/admin/staff");
  revalidatePath("/about/staff");
  revalidatePath("/about/staff");
}

/** เพิ่มบุคลากรใหม่ */
export async function createStaffAction(
  _prev: StaffFormState,
  formData: FormData,
): Promise<StaffFormState> {
  await requireAdmin();

  const parsed = readForm(formData);
  if ("error" in parsed) return parsed;

  try {
    await prisma.cms_staff.create({ data: parsed.data });
  } catch (error) {
    console.error("[admin] เพิ่มบุคลากรไม่สำเร็จ", error);
    return { error: "บันทึกไม่สำเร็จ ตรวจสอบการเชื่อมต่อฐานข้อมูล" };
  }

  revalidateStaff();
  redirect("/admin/staff");
}

/** แก้ไขข้อมูลบุคลากร */
export async function updateStaffAction(
  _prev: StaffFormState,
  formData: FormData,
): Promise<StaffFormState> {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return { error: "ไม่พบรายชื่อที่ต้องการแก้ไข" };

  const parsed = readForm(formData);
  if ("error" in parsed) return parsed;

  try {
    await prisma.cms_staff.update({ where: { id }, data: parsed.data });
  } catch (error) {
    console.error("[admin] แก้ไขบุคลากรไม่สำเร็จ", error);
    return { error: "บันทึกไม่สำเร็จ ตรวจสอบการเชื่อมต่อฐานข้อมูล" };
  }

  revalidateStaff();
  redirect("/admin/staff");
}

/** สลับแสดง/ซ่อนบนหน้าเว็บ */
export async function toggleStaffPublishedAction(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  const published = formData.get("published") === "true";
  if (!Number.isInteger(id)) return;

  await prisma.cms_staff.update({ where: { id }, data: { published: !published } });
  revalidateStaff();
}

/** ลบรายชื่อถาวร */
export async function deleteStaffAction(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await prisma.cms_staff.delete({ where: { id } });
  revalidateStaff();
}
