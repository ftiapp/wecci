"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";
import { eventCategories, type EventCategory } from "@/lib/events/categories";
import { parseBlocks, stripEmptyBlocks } from "@/lib/events/content";

export type EventFormState = { error?: string };

/** อ่านค่าจากฟอร์ม ตัดช่องว่างหัวท้าย และคืน null เมื่อเว้นว่าง */
function optional(formData: FormData, name: string, max: number) {
  const value = String(formData.get(name) ?? "").trim();
  return value ? value.slice(0, max) : null;
}

/** แปลง YYYY-MM-DD จาก <input type="date"> เป็น Date แบบเที่ยงคืน UTC ให้ตรงกับคอลัมน์ชนิด Date */
function toDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

function optionalDate(formData: FormData, name: string) {
  const value = String(formData.get(name) ?? "").trim();
  return value ? toDate(value) : null;
}

/** แปลง JSON ของ BlockEditor กลับเป็นรายการบล็อกที่ตรวจแล้ว */
function readBlocks(formData: FormData, name: string) {
  try {
    return stripEmptyBlocks(parseBlocks(JSON.parse(String(formData.get(name) ?? "[]"))));
  } catch {
    return [];
  }
}

/** ตรวจและรวบรวมค่าจากฟอร์มก่อนเขียนลงฐานข้อมูล */
function readForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const startDate = String(formData.get("startDate") ?? "").trim();
  const endDateRaw = String(formData.get("endDate") ?? "").trim();
  const openRaw = String(formData.get("registerOpenAt") ?? "").trim();
  const closeRaw = String(formData.get("registerCloseAt") ?? "").trim();

  if (!title) return { error: "กรุณากรอกชื่อกิจกรรม" } as const;
  if (!eventCategories.includes(category as EventCategory)) {
    return { error: "กรุณาเลือกประเภทกิจกรรม" } as const;
  }
  if (!startDate) return { error: "กรุณาเลือกวันที่เริ่ม" } as const;
  if (endDateRaw && endDateRaw < startDate) {
    return { error: "วันสิ้นสุดต้องไม่ก่อนวันที่เริ่ม" } as const;
  }
  if (openRaw && closeRaw && closeRaw < openRaw) {
    return { error: "วันปิดรับสมัครต้องไม่ก่อนวันเปิดรับ" } as const;
  }

  const tagIds = formData
    .getAll("tagIds")
    .map((value) => Number(value))
    .filter(Number.isInteger);

  return {
    tagIds,
    data: {
      title: title.slice(0, 300),
      titleEn: optional(formData, "titleEn", 300),
      excerpt: optional(formData, "excerpt", 2000),
      excerptEn: optional(formData, "excerptEn", 2000),
      content: readBlocks(formData, "content"),
      contentEn: readBlocks(formData, "contentEn"),
      category,
      startDate: toDate(startDate),
      endDate: endDateRaw ? toDate(endDateRaw) : null,
      time: optional(formData, "time", 100),
      place: optional(formData, "place", 300),
      placeEn: optional(formData, "placeEn", 300),
      image: optional(formData, "image", 255),
      registerUrl: optional(formData, "registerUrl", 500),
      registerOpenAt: optionalDate(formData, "registerOpenAt"),
      registerCloseAt: optionalDate(formData, "registerCloseAt"),
      published: formData.get("published") === "on",
    },
  } as const;
}

/** ล้างแคชทุกหน้าที่แสดงกิจกรรม */
function revalidateEvents(id?: number) {
  revalidatePath("/admin/events");
  revalidatePath("/news/events");
  if (id) revalidatePath(`/news/events/${id}`);
}

/** เพิ่มกิจกรรมใหม่ */
export async function createEventAction(
  _prev: EventFormState,
  formData: FormData,
): Promise<EventFormState> {
  await requireAdmin();

  const parsed = readForm(formData);
  if ("error" in parsed) return parsed;

  // กด Preview ตอนยังไม่เคยบันทึก → เก็บเป็นฉบับร่างก่อนแล้วพาไปดูหน้าจริง
  const preview = formData.get("__preview") === "1";

  let created;
  try {
    created = await prisma.cms_events.create({
      data: {
        ...parsed.data,
        published: preview ? false : parsed.data.published,
        tags: { connect: parsed.tagIds.map((id) => ({ id })) },
      },
    });
  } catch (error) {
    console.error("[admin] เพิ่มกิจกรรมไม่สำเร็จ", error);
    return { error: "บันทึกไม่สำเร็จ ตรวจสอบการเชื่อมต่อฐานข้อมูล" };
  }

  revalidateEvents(created.id);
  redirect(preview ? `/news/events/${created.id}` : "/admin/events");
}

/** แก้ไขกิจกรรมเดิม */
export async function updateEventAction(
  _prev: EventFormState,
  formData: FormData,
): Promise<EventFormState> {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return { error: "ไม่พบกิจกรรมที่ต้องการแก้ไข" };

  const parsed = readForm(formData);
  if ("error" in parsed) return parsed;

  try {
    await prisma.cms_events.update({
      where: { id },
      data: {
        ...parsed.data,
        // set แทน connect เพื่อให้ Tag ที่ถูกเอาออกหลุดความสัมพันธ์ไปด้วย
        tags: { set: parsed.tagIds.map((tagId) => ({ id: tagId })) },
      },
    });
  } catch (error) {
    console.error("[admin] แก้ไขกิจกรรมไม่สำเร็จ", error);
    return { error: "บันทึกไม่สำเร็จ ตรวจสอบการเชื่อมต่อฐานข้อมูล" };
  }

  revalidateEvents(id);
  redirect("/admin/events");
}

/** สลับสถานะเผยแพร่/ซ่อน โดยไม่ต้องเข้าหน้าแก้ไข */
export async function togglePublishedAction(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  const published = formData.get("published") === "true";
  if (!Number.isInteger(id)) return;

  await prisma.cms_events.update({ where: { id }, data: { published: !published } });
  revalidateEvents(id);
}

/** ลบกิจกรรมถาวร */
export async function deleteEventAction(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await prisma.cms_events.delete({ where: { id } });
  revalidateEvents(id);
}

/** สร้าง Tag ใหม่จากหน้าจัดการ Tags */
export async function createTagAction(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim().slice(0, 60);
  if (!name) return;

  const nameEn = optional(formData, "nameEn", 60);

  // ชื่อซ้ำไม่ถือเป็นความผิดพลาด — ข้ามไปเฉย ๆ
  await prisma.cms_event_tags.upsert({
    where: { name },
    update: { nameEn },
    create: { name, nameEn },
  });

  revalidatePath("/admin/events/tags");
  revalidatePath("/admin/events");
}

/** ลบ Tag (กิจกรรมที่ใช้อยู่จะหลุดความสัมพันธ์ไปเอง) */
export async function deleteTagAction(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await prisma.cms_event_tags.delete({ where: { id } });

  revalidatePath("/admin/events/tags");
  revalidatePath("/admin/events");
}
