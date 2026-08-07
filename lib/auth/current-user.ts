import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";

/**
 * อ่านชื่อผู้ใช้จากคุกกี้เซสชัน
 * proxy กันหน้า /admin ไว้อีกชั้นแล้ว ตรงนี้เป็นการกันซ้ำระดับหน้า
 */
export async function requireAdmin() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const username = await verifySessionToken(token);

  if (!username) redirect("/admin/login");

  return username;
}
