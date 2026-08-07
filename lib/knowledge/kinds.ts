/** ประเภทของรายการในคลังองค์ความรู้ (ไฟล์ "use server" ส่งออกได้เฉพาะฟังก์ชัน จึงแยกมาไว้ที่นี่) */
export const knowledgeKinds = [
  { value: "video", label: "วีดีโอ" },
  { value: "document", label: "เอกสาร/คู่มือ" },
  { value: "link", label: "ลิงก์ภายนอก" },
] as const;

export type KnowledgeKind = (typeof knowledgeKinds)[number]["value"];

export function kindLabel(kind: string) {
  return knowledgeKinds.find((item) => item.value === kind)?.label ?? kind;
}

/**
 * ดึงรหัสวีดีโอจากลิงก์ YouTube เพื่อใช้ทำภาพปกอัตโนมัติ
 * รองรับทั้ง youtu.be/xxx, watch?v=xxx และ /embed/xxx
 */
export function youtubeId(url: string | null | undefined) {
  if (!url) return null;

  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/,
  );
  return match ? match[1] : null;
}

/** ภาพปกที่ควรใช้ — ใช้ของที่อัปโหลดก่อน ถ้าไม่มีและเป็น YouTube ใช้ภาพปกของคลิป */
export function coverImage(item: { image: string | null; url: string | null }) {
  if (item.image) return item.image;

  const id = youtubeId(item.url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}
