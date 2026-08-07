import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const LIMITS = {
  firstName: 100,
  lastName: 100,
  email: 150,
  phone: 50,
  subject: 200,
  message: 5000,
} as const;

type Field = keyof typeof LIMITS;

/** อ่านค่าจากฟอร์ม ตัดช่องว่างหัวท้าย และตัดความยาวไม่ให้เกินที่ฐานข้อมูลรับได้ */
function pick(body: Record<string, unknown>, field: Field) {
  return String(body[field] ?? "").trim().slice(0, LIMITS[field]);
}

/** รับข้อความจากฟอร์มหน้าติดต่อ แล้วเก็บลงตาราง cms_contact_messages */
export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }

  const data = {
    firstName: pick(body, "firstName"),
    lastName: pick(body, "lastName"),
    email: pick(body, "email"),
    phone: pick(body, "phone"),
    subject: pick(body, "subject"),
    message: pick(body, "message"),
  };

  const missing = (Object.keys(data) as Field[]).filter((key) => !data[key]);
  if (missing.length > 0) {
    return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบทุกช่อง" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return NextResponse.json({ error: "รูปแบบอีเมลไม่ถูกต้อง" }, { status: 400 });
  }

  try {
    await prisma.cms_contact_messages.create({ data });
  } catch (error) {
    console.error("[contact] บันทึกข้อความไม่สำเร็จ", error);
    return NextResponse.json({ error: "ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
