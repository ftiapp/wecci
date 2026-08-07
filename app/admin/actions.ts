"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  isValidCredential,
} from "@/lib/auth/session";

export type LoginState = { error?: string };

/** ตรวจรหัสจากฟอร์มล็อกอิน แล้ววางคุกกี้เซสชันถ้าถูกต้อง */
export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/admin");

  if (!username || !password) {
    return { error: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน" };
  }

  if (!isValidCredential(username, password)) {
    return { error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, await createSessionToken(username), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  // กันการเด้งออกนอกเว็บ: รับเฉพาะพาธภายในที่ขึ้นต้นด้วย /admin
  redirect(from.startsWith("/admin") ? from : "/admin");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/admin/login");
}
