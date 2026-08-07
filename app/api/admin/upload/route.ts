import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 15 * 1024 * 1024;

/** รับไฟล์รูปจากหลังบ้าน ย่อและแปลงเป็น WebP แล้วเก็บไว้ที่ public/uploads */
export async function POST(request: Request) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const username = await verifySessionToken(token);
  if (!username) {
    return NextResponse.json({ error: "ต้องเข้าสู่ระบบก่อน" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "ไม่พบไฟล์" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "รองรับเฉพาะไฟล์รูปภาพ" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "ไฟล์ใหญ่เกิน 15 MB" }, { status: 400 });
  }

  const input = Buffer.from(await file.arrayBuffer());

  // ย่อกว้างไม่เกิน 2400px และแปลงเป็น WebP เพื่อให้หน้าเว็บโหลดเร็ว
  const output = await sharp(input)
    .resize({ width: 2400, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer({ resolveWithObject: true });

  const safeName = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9ก-๙-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "image";

  const fileName = `${safeName}-${Date.now()}.webp`;

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, fileName), output.data);

  const publicPath = `/uploads/${fileName}`;

  try {
    await prisma.cms_media_assets.create({
      data: {
        path: publicPath,
        originalName: file.name,
        width: output.info.width,
        height: output.info.height,
        bytes: output.info.size,
      },
    });
  } catch (error) {
    // บันทึกทะเบียนไฟล์ไม่สำเร็จก็ยังใช้รูปได้ จึงไม่ถือเป็นข้อผิดพลาดร้ายแรง
    console.error("[upload] บันทึกข้อมูลไฟล์ลงฐานข้อมูลไม่สำเร็จ", error);
  }

  return NextResponse.json({
    path: publicPath,
    width: output.info.width,
    height: output.info.height,
    bytes: output.info.size,
  });
}
