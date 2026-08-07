import "server-only";

/** ดึงพิกัดออกจาก URL ของ Google Maps ทั้งรูปแบบ @lat,lng และ !3dlat!4dlng */
function coordsFromUrl(url: string) {
  const at = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (at) return `${at[1]},${at[2]}`;

  const bang = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (bang) return `${bang[1]},${bang[2]}`;

  return null;
}

/** ลิงก์ย่อฝังตรง ๆ ไม่ได้ ต้องตามรีไดเรกต์ไปหา URL เต็มก่อน */
async function expandShortLink(url: string) {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      // ผลลัพธ์แทบไม่เปลี่ยน เก็บแคชไว้หนึ่งวันพอ
      next: { revalidate: 86400 },
    });
    return response.url || null;
  } catch (error) {
    console.error("[map] ตามลิงก์ย่อไม่สำเร็จ", error);
    return null;
  }
}

/**
 * แปลงค่าที่แอดมินกรอกให้เป็น src ของ iframe
 * รองรับ: โค้ด <iframe> · ลิงก์ Google Maps (รวมลิงก์ย่อ) · พิกัด · ชื่อสถานที่
 * คืน null เมื่อยังไม่ได้กรอกอะไร
 */
export async function toMapEmbedSrc(raw: string): Promise<string | null> {
  const value = raw.trim();
  if (!value) return null;

  // 1) วางโค้ดฝังทั้งก้อนมา — ดึงเฉพาะ src ออกมาใช้
  const iframeSrc = value.match(/<iframe[^>]+src=["']([^"']+)["']/i);
  if (iframeSrc) return iframeSrc[1];

  // 2) เป็น URL อยู่แล้ว
  if (/^https?:\/\//i.test(value)) {
    if (value.includes("/maps/embed")) return value;

    const target = /goo\.gl|maps\.app\.goo\.gl/i.test(value)
      ? ((await expandShortLink(value)) ?? value)
      : value;

    const coords = coordsFromUrl(target);
    if (coords) return `https://www.google.com/maps?q=${coords}&hl=th&z=17&output=embed`;

    // ไม่มีพิกัดในลิงก์ ใช้ชื่อสถานที่ที่อยู่ในพาธแทน
    const place = target.match(/\/place\/([^/@?]+)/);
    if (place) {
      return `https://www.google.com/maps?q=${place[1]}&hl=th&z=17&output=embed`;
    }

    return null;
  }

  // 3) พิกัดหรือชื่อสถานที่ที่พิมพ์เอง
  const query = encodeURIComponent(value.replace(/\s+/g, " "));
  return `https://www.google.com/maps?q=${query}&hl=th&z=17&output=embed`;
}
