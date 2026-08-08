"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/current-user";
import { executiveLevels, type ExecutiveLevel } from "@/lib/executives/levels";
import { normalizeExecutivePhoto } from "@/lib/executives/normalize-photo";
import { prisma } from "@/lib/prisma";

export type ExecutiveFormState = { error?: string };

function optional(formData: FormData, name: string, max: number) {
  const value = String(formData.get(name) ?? "").trim();
  return value ? value.slice(0, max) : null;
}

function readForm(formData: FormData) {
  const nameTh = String(formData.get("nameTh") ?? "").trim();
  if (!nameTh) return { error: "กรุณากรอกชื่อ-นามสกุล" } as const;

  const level = String(formData.get("level") ?? "").trim();
  if (!executiveLevels.includes(level as ExecutiveLevel)) {
    return { error: "กรุณาเลือกระดับในคณะผู้บริหาร" } as const;
  }

  const email = optional(formData, "email", 150);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "รูปแบบอีเมลไม่ถูกต้อง" } as const;
  }

  return {
    data: {
      level,
      nameTh: nameTh.slice(0, 200),
      position: optional(formData, "position", 200),
      duty: optional(formData, "duty", 300),
      org: optional(formData, "org", 200),
      phone: optional(formData, "phone", 50),
      email,
      photo: optional(formData, "photo", 255),
      sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
      published: formData.get("published") === "on",
    },
  } as const;
}

function revalidateExecutives() {
  revalidatePath("/admin/executives");
  revalidatePath("/about/executives");
}

/** เพิ่มผู้บริหารใหม่ */
export async function createExecutiveAction(
  _prev: ExecutiveFormState,
  formData: FormData,
): Promise<ExecutiveFormState> {
  await requireAdmin();

  const parsed = readForm(formData);
  if ("error" in parsed) return parsed;

  /* จัดรูปให้เป็นผืนมาตรฐานก่อนบันทึก หัวของทุกคนบนหน้าเว็บจะได้อยู่แนวเดียวกัน */
  const photo = await normalizeExecutivePhoto(parsed.data.photo);

  try {
    await prisma.cms_executive.create({ data: { ...parsed.data, photo } });
  } catch (error) {
    console.error("[admin] เพิ่มผู้บริหารไม่สำเร็จ", error);
    return { error: "บันทึกไม่สำเร็จ ตรวจสอบการเชื่อมต่อฐานข้อมูล" };
  }

  revalidateExecutives();
  redirect("/admin/executives");
}

/** แก้ไขข้อมูลผู้บริหาร */
export async function updateExecutiveAction(
  _prev: ExecutiveFormState,
  formData: FormData,
): Promise<ExecutiveFormState> {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return { error: "ไม่พบรายชื่อที่ต้องการแก้ไข" };

  const parsed = readForm(formData);
  if ("error" in parsed) return parsed;

  const photo = await normalizeExecutivePhoto(parsed.data.photo);

  try {
    await prisma.cms_executive.update({ where: { id }, data: { ...parsed.data, photo } });
  } catch (error) {
    console.error("[admin] แก้ไขผู้บริหารไม่สำเร็จ", error);
    return { error: "บันทึกไม่สำเร็จ ตรวจสอบการเชื่อมต่อฐานข้อมูล" };
  }

  revalidateExecutives();
  redirect("/admin/executives");
}

/** สลับแสดง/ซ่อนบนหน้าเว็บ */
export async function toggleExecutivePublishedAction(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  const published = formData.get("published") === "true";
  if (!Number.isInteger(id)) return;

  await prisma.cms_executive.update({ where: { id }, data: { published: !published } });
  revalidateExecutives();
}

/** ลบรายชื่อถาวร */
export async function deleteExecutiveAction(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await prisma.cms_executive.delete({ where: { id } });
  revalidateExecutives();
}
