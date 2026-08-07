import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";

/**
 * ยามหน้าประตูของหลังบ้าน — ตรวจคุกกี้เซสชันก่อนเข้าหน้า /admin
 * (Next 16 เปลี่ยนชื่อไฟล์ middleware เป็น proxy)
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const username = await verifySessionToken(token);

  // ล็อกอินแล้วแต่ยังวนอยู่หน้า login → ส่งเข้าแดชบอร์ด
  if (pathname === "/admin/login") {
    if (username) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!username) {
    const loginUrl = new URL("/admin/login", request.url);
    // จำหน้าที่ตั้งใจจะเข้า เพื่อพากลับไปหลังล็อกอินสำเร็จ
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
