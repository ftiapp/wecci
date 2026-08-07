import "server-only";
import { prisma } from "@/lib/prisma";
import { contentDefaults, type BlockData } from "@/lib/content/defaults";

/**
 * อ่านเนื้อหาของทั้งหน้า — เอาค่าจากฐานข้อมูลทับค่าตั้งต้น
 * ถ้าต่อฐานข้อมูลไม่ได้ จะคืนค่าตั้งต้นแทนเพื่อให้เว็บยังแสดงผลได้
 */
export async function getPageBlocks(page: string) {
  const defaults = contentDefaults[page] ?? {};
  const merged: Record<string, BlockData> = structuredClone(defaults);

  try {
    const rows = await prisma.cms_page_contents.findMany({
      where: { page, enabled: true },
    });

    for (const row of rows) {
      merged[row.key] = {
        ...(defaults[row.key] ?? {}),
        ...((row.data ?? {}) as BlockData),
      };
    }
  } catch (error) {
    console.error("[content] อ่านเนื้อหาจากฐานข้อมูลไม่สำเร็จ ใช้ค่าตั้งต้นแทน", error);
  }

  return merged;
}

/** อ่านบล็อกเดียว สะดวกเวลาเรียกจาก component */
export async function getBlock(page: string, key: string) {
  const blocks = await getPageBlocks(page);
  return blocks[key] ?? {};
}

/** บันทึกบล็อกเดียว (สร้างใหม่ถ้ายังไม่มี) */
export async function saveBlock(
  page: string,
  key: string,
  data: BlockData,
  updatedBy: string,
) {
  await prisma.cms_page_contents.upsert({
    where: { page_key: { page, key } },
    create: { page, key, data, updatedBy },
    update: { data, updatedBy },
  });
}

/** เวลาที่แก้ไขล่าสุดของแต่ละหน้า ใช้แสดงในแดชบอร์ด */
export async function getPageUpdatedAt(page: string) {
  try {
    const latest = await prisma.cms_page_contents.findFirst({
      where: { page },
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true, updatedBy: true },
    });
    return latest;
  } catch {
    return null;
  }
}
