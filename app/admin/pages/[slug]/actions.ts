"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/current-user";
import { getPageDef } from "@/lib/content/schema";
import { saveBlock } from "@/lib/content/store";
import type { BlockData } from "@/lib/content/defaults";

export type SaveState = { ok?: boolean; error?: string; savedAt?: string };

/** บันทึกเนื้อหาหนึ่งบล็อก โดยรับเฉพาะฟิลด์ที่นิยามไว้ใน schema */
export async function saveBlockAction(
  _prev: SaveState,
  formData: FormData,
): Promise<SaveState> {
  const username = await requireAdmin();

  const slug = String(formData.get("__page") ?? "");
  const blockKey = String(formData.get("__block") ?? "");

  const pageDef = getPageDef(slug);
  const blockDef = pageDef?.blocks.find((block) => block.key === blockKey);

  if (!pageDef || !blockDef) {
    return { error: "ไม่พบบล็อกที่ต้องการบันทึก" };
  }

  const data: BlockData = {};
  for (const field of blockDef.fields) {
    const raw = formData.get(field.name);
    data[field.name] =
      field.type === "switch" ? raw === "on" : String(raw ?? "").trim();
  }

  try {
    await saveBlock(slug, blockKey, data, username);
  } catch (error) {
    console.error("[admin] บันทึกเนื้อหาไม่สำเร็จ", error);
    return { error: "บันทึกไม่สำเร็จ ตรวจสอบการเชื่อมต่อฐานข้อมูล" };
  }

  // ล้างแคชหน้าเว็บสาธารณะให้เห็นผลทันที
  revalidatePath(pageDef.href);
  revalidatePath(`/admin/pages/${slug}`);

  return { ok: true, savedAt: new Date().toLocaleTimeString("th-TH") };
}
