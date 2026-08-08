import "server-only";
import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

/**
 * จัดรูปผู้บริหารให้ "หัว" ของทุกคนใหญ่เท่ากันและอยู่ระดับเดียวกัน
 *
 * ปัญหาที่แก้: รูปที่ส่งมาถ่ายคนละระยะ บางใบครึ่งอก บางใบเต็มตัว
 * ถ้าจัดด้วยความสูงของตัวคน คนที่ถ่ายเต็มตัวจะได้หน้าจิ๋วเมื่อเทียบกับคนที่ถ่ายครึ่งอก
 * ต่อให้ยืนบนเส้นเดียวกันก็ยังดูไม่เป็นชุดเดียวกันอยู่ดี
 *
 * จึงวัดจากหัวแทน โดยอ่านช่องอัลฟาของไฟล์ที่ไดคัตมาแล้ว
 *   1. ไล่หาแถวบนสุดที่เริ่มมีเนื้อภาพ = ยอดหัว
 *   2. ไล่ลงมาจนความกว้างเริ่มหดเข้า = คอ ความกว้างสูงสุดช่วงนั้นคือความกว้างหัว
 *   3. ย่อ/ขยายให้หัวกว้างเท่ากันทุกใบ แล้ววางให้ยอดหัวอยู่ระดับเดียวกัน จัดกลางที่หัว
 * ส่วนที่ล้นผืนถูกตัดทิ้ง รูปเต็มตัวจึงกลายเป็นครึ่งอกให้เองโดยอัตโนมัติ
 *
 * ใช้การอ่านพิกเซลล้วน ไม่ต้องพึ่งโมเดลตรวจจับใบหน้า จึงเบาและไม่ต้องต่อบริการภายนอก
 */

/** ขนาดผืน ต้องตรงกับ aspect-4/5 ของการ์ดใน ExecutiveBoard */
const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 1600;

/** ความกว้างหัวเทียบกับความกว้างผืน — ตัวเลขนี้คุมว่าหน้าจะใหญ่แค่ไหนบนการ์ด */
const HEAD_WIDTH_RATIO = 0.26;

/** ระยะจากขอบบนผืนถึงยอดหัว เว้นไว้ให้หัวไม่ชนขอบ */
const HEAD_TOP_RATIO = 0.1;

/** ถือว่าเป็นเนื้อภาพเมื่ออัลฟาเกินค่านี้ กันขอบฟุ้งจาง ๆ ของการไดคัต */
const ALPHA_THRESHOLD = 40;

/** ต่อท้ายชื่อไฟล์ที่ผ่านการจัดแล้ว ใช้กันไม่ให้จัดซ้ำจนตัวคนเล็กลงเรื่อย ๆ */
const SUFFIX = "-portrait.webp";

const PUBLIC_ROOT = path.join(process.cwd(), "public");

type HeadBox = { headTop: number; headWidth: number; centerX: number; width: number; height: number };

async function exists(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

/** หาตำแหน่งยอดหัว ความกว้างหัว และจุดกึ่งกลางหัว จากช่องอัลฟา */
async function measureHead(source: string): Promise<HeadBox | null> {
  const { data, info } = await sharp(source)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  /* ช่วงซ้าย-ขวาของเนื้อภาพในแต่ละแถว */
  const spans: ({ min: number; max: number; width: number } | null)[] = [];

  for (let y = 0; y < height; y++) {
    let min = -1;
    let max = -1;

    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * channels + 3] > ALPHA_THRESHOLD) {
        if (min < 0) min = x;
        max = x;
      }
    }

    spans.push(min < 0 ? null : { min, max, width: max - min + 1 });
  }

  /* ข้ามเศษจุดเล็ก ๆ ที่หลุดจากการไดคัต ถือว่าเริ่มเป็นหัวเมื่อกว้างเกิน 0.8% ของภาพ */
  const headTop = spans.findIndex((span) => span !== null && span.width > width * 0.008);
  if (headTop < 0) return null;

  let peak = 0;
  let peakY = headTop;

  for (let y = headTop; y < height; y++) {
    const span = spans[y];
    if (!span) continue;

    if (span.width >= peak) {
      peak = span.width;
      peakY = y;
      continue;
    }

    /*
      หดเข้ามาเกิน 8% จากจุดที่กว้างสุด แปลว่าพ้นหัวลงมาถึงคอแล้ว
      ต้องไล่ลงมาแล้วอย่างน้อย 20 แถว กันเส้นผมหยักเล็ก ๆ ทำให้ตัดสินผิดตั้งแต่แถวแรก ๆ
    */
    if (span.width < peak * 0.92 && y - headTop > 20) break;
  }

  const peakSpan = spans[peakY];
  if (!peakSpan || peak <= 0) return null;

  return {
    headTop,
    headWidth: peak,
    centerX: (peakSpan.min + peakSpan.max) / 2,
    width,
    height,
  };
}

/**
 * คืนพาธใหม่ที่จัดแล้ว หรือคืนพาธเดิมถ้าจัดไม่ได้
 *
 * ตั้งใจไม่ให้ throw — รูปเพี้ยนหนึ่งใบไม่ควรทำให้บันทึกข้อมูลผู้บริหารทั้งรายการล้มเหลว
 * กรณีจัดไม่สำเร็จจะใช้ไฟล์เดิมไปก่อน หน้าเว็บยังแสดงได้ แค่หัวอาจไม่ตรงแนวคนอื่น
 */
export async function normalizeExecutivePhoto(photo: string | null): Promise<string | null> {
  if (!photo) return null;

  /* จัดเฉพาะไฟล์ที่อยู่ในเว็บนี้เอง ไม่ยุ่งกับ URL ภายนอก */
  if (!photo.startsWith("/")) return photo;

  /* จัดไปแล้วไม่ต้องจัดซ้ำ */
  if (photo.endsWith(SUFFIX)) return photo;

  const source = path.join(PUBLIC_ROOT, photo);
  if (!(await exists(source))) return photo;

  const outputPath = photo.replace(/\.[^./]+$/, "") + SUFFIX;
  const target = path.join(PUBLIC_ROOT, outputPath);

  try {
    const head = await measureHead(source);
    if (!head) return photo;

    /*
      กันกรณีตรวจพลาด เช่นรูปที่ถ่ายชิดมากจนหัวกับไหล่กว้างพอ ๆ กัน
      อัลกอริทึมอาจไปจับไหล่มาเป็นหัว แล้วย่อรูปจนเล็กผิดปกติ
      ถ้าค่าที่วัดได้หลุดช่วงที่เป็นไปได้ ให้ถอยไปใช้ค่ากลางแทนการดันต่อ
    */
    const ratio = head.headWidth / head.width;
    const headWidth = ratio > 0.55 ? head.width * 0.4 : head.headWidth;

    const scale = (CANVAS_WIDTH * HEAD_WIDTH_RATIO) / headWidth;
    const scaledWidth = Math.max(1, Math.round(head.width * scale));
    const scaledHeight = Math.max(1, Math.round(head.height * scale));

    const resized = await sharp(source)
      .resize(scaledWidth, scaledHeight, { fit: "fill" })
      .toBuffer();

    /* วางให้ยอดหัวอยู่ระดับที่กำหนด และกึ่งกลางหัวตรงกับกึ่งกลางผืน */
    const left = Math.round(CANVAS_WIDTH / 2 - head.centerX * scale);
    const top = Math.round(CANVAS_HEIGHT * HEAD_TOP_RATIO - head.headTop * scale);

    /*
      sharp ไม่ยอมให้วางภาพที่ใหญ่กว่าผืน ต้องตัดส่วนที่ล้นทิ้งก่อน
      ตรงนี้เองที่ทำให้รูปเต็มตัวกลายเป็นครึ่งอกโดยอัตโนมัติ
    */
    const cropLeft = Math.max(0, -left);
    const cropTop = Math.max(0, -top);
    const cropRight = Math.min(scaledWidth, CANVAS_WIDTH - left);
    const cropBottom = Math.min(scaledHeight, CANVAS_HEIGHT - top);

    if (cropRight <= cropLeft || cropBottom <= cropTop) return photo;

    const cropped = await sharp(resized)
      .extract({
        left: cropLeft,
        top: cropTop,
        width: cropRight - cropLeft,
        height: cropBottom - cropTop,
      })
      .toBuffer();

    const output = await sharp({
      create: {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: cropped, left: left + cropLeft, top: top + cropTop }])
      .webp({ quality: 90 })
      .toBuffer();

    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, output);

    return outputPath;
  } catch (error) {
    console.error("[executives] จัดรูปผู้บริหารไม่สำเร็จ ใช้ไฟล์เดิมแทน", photo, error);
    return photo;
  }
}
