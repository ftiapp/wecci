"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";
import { knowledgeKinds, type KnowledgeKind } from "@/lib/knowledge/kinds";
import { parseBlocks, stripEmptyBlocks } from "@/lib/events/content";

export type KnowledgeFormState = { error?: string };

function optional(formData: FormData, name: string, max: number) {
  const value = String(formData.get(name) ?? "").trim();
  return value ? value.slice(0, max) : null;
}

function readBlocks(formData: FormData, name: string) {
  try {
    return stripEmptyBlocks(parseBlocks(JSON.parse(String(formData.get(name) ?? "[]"))));
  } catch {
    return [];
  }
}

function readForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const kind = String(formData.get("kind") ?? "").trim();

  if (!title) return { error: "กรุณากรอกชื่อเรื่อง" } as const;
  if (!knowledgeKinds.some((item) => item.value === kind)) {
    return { error: "กรุณาเลือกประเภท" } as const;
  }

  return {
    data: {
      title: title.slice(0, 300),
      description: optional(formData, "description", 2000),
      content: readBlocks(formData, "content"),
      kind: kind as KnowledgeKind,
      url: optional(formData, "url", 500),
      image: optional(formData, "image", 255),
      published: formData.get("published") === "on",
      featured: formData.get("featured") === "on",
    },
  } as const;
}

function revalidateKnowledge() {
  revalidatePath("/admin/knowledge");
  revalidatePath("/news/knowledge");
  revalidatePath("/news");
}

/** เพิ่มรายการองค์ความรู้/วีดีโอ */
export async function createKnowledgeAction(
  _prev: KnowledgeFormState,
  formData: FormData,
): Promise<KnowledgeFormState> {
  await requireAdmin();

  const parsed = readForm(formData);
  if ("error" in parsed) return parsed;

  try {
    await prisma.cms_knowledge_items.create({ data: parsed.data });
  } catch (error) {
    console.error("[admin] เพิ่มองค์ความรู้ไม่สำเร็จ", error);
    return { error: "บันทึกไม่สำเร็จ ตรวจสอบการเชื่อมต่อฐานข้อมูล" };
  }

  revalidateKnowledge();
  redirect("/admin/knowledge");
}

/** แก้ไขรายการเดิม */
export async function updateKnowledgeAction(
  _prev: KnowledgeFormState,
  formData: FormData,
): Promise<KnowledgeFormState> {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return { error: "ไม่พบรายการที่ต้องการแก้ไข" };

  const parsed = readForm(formData);
  if ("error" in parsed) return parsed;

  try {
    await prisma.cms_knowledge_items.update({ where: { id }, data: parsed.data });
  } catch (error) {
    console.error("[admin] แก้ไของค์ความรู้ไม่สำเร็จ", error);
    return { error: "บันทึกไม่สำเร็จ ตรวจสอบการเชื่อมต่อฐานข้อมูล" };
  }

  revalidateKnowledge();
  redirect("/admin/knowledge");
}

/** สลับเผยแพร่/ฉบับร่าง */
export async function toggleKnowledgePublishedAction(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  const published = formData.get("published") === "true";
  if (!Number.isInteger(id)) return;

  await prisma.cms_knowledge_items.update({
    where: { id },
    data: { published: !published },
  });
  revalidateKnowledge();
}

/** ลบรายการถาวร */
export async function deleteKnowledgeAction(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await prisma.cms_knowledge_items.delete({ where: { id } });
  revalidateKnowledge();
}
