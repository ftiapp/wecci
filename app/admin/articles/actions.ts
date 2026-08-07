"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/current-user";
import { parseBlocks, stripEmptyBlocks } from "@/lib/events/content";
import { prisma } from "@/lib/prisma";

export type ArticleFormState = { error?: string };

function optional(formData: FormData, name: string, max: number) {
  const value = String(formData.get(name) ?? "").trim();
  return value ? value.slice(0, max) : null;
}

/** แปลง YYYY-MM-DD เป็น Date เที่ยงคืน UTC ให้ตรงกับคอลัมน์ชนิด Date */
function toDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
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
  const publishedAt = String(formData.get("publishedAt") ?? "").trim();

  if (!title) return { error: "กรุณากรอกหัวข้อบทความ" } as const;
  if (!publishedAt) return { error: "กรุณาเลือกวันที่ลงบทความ" } as const;

  return {
    data: {
      title: title.slice(0, 300),
      excerpt: optional(formData, "excerpt", 2000),
      content: readBlocks(formData, "content"),
      category: optional(formData, "category", 60) ?? "ทั่วไป",
      image: optional(formData, "image", 255),
      publishedAt: toDate(publishedAt),
      published: formData.get("published") === "on",
      featured: formData.get("featured") === "on",
    },
  } as const;
}

function revalidateArticles(id?: number) {
  revalidatePath("/admin/articles");
  revalidatePath("/news");
  revalidatePath("/news/articles");
  if (id) revalidatePath(`/news/articles/${id}`);
}

/** เพิ่มบทความใหม่ */
export async function createArticleAction(
  _prev: ArticleFormState,
  formData: FormData,
): Promise<ArticleFormState> {
  await requireAdmin();

  const parsed = readForm(formData);
  if ("error" in parsed) return parsed;

  try {
    await prisma.cms_articles.create({ data: parsed.data });
  } catch (error) {
    console.error("[admin] เพิ่มบทความไม่สำเร็จ", error);
    return { error: "บันทึกไม่สำเร็จ ตรวจสอบการเชื่อมต่อฐานข้อมูล" };
  }

  revalidateArticles();
  redirect("/admin/articles");
}

/** แก้ไขบทความเดิม */
export async function updateArticleAction(
  _prev: ArticleFormState,
  formData: FormData,
): Promise<ArticleFormState> {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return { error: "ไม่พบบทความที่ต้องการแก้ไข" };

  const parsed = readForm(formData);
  if ("error" in parsed) return parsed;

  try {
    await prisma.cms_articles.update({ where: { id }, data: parsed.data });
  } catch (error) {
    console.error("[admin] แก้ไขบทความไม่สำเร็จ", error);
    return { error: "บันทึกไม่สำเร็จ ตรวจสอบการเชื่อมต่อฐานข้อมูล" };
  }

  revalidateArticles(id);
  redirect("/admin/articles");
}

/** สลับเผยแพร่/ฉบับร่าง */
export async function toggleArticlePublishedAction(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  const published = formData.get("published") === "true";
  if (!Number.isInteger(id)) return;

  await prisma.cms_articles.update({ where: { id }, data: { published: !published } });
  revalidateArticles(id);
}

/** ลบบทความถาวร */
export async function deleteArticleAction(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await prisma.cms_articles.delete({ where: { id } });
  revalidateArticles(id);
}
