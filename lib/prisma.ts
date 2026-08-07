import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/app/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/*
  ตัวเชื่อมต่อรองรับทั้ง MySQL และ MariaDB อ่านค่าจาก DATABASE_URL ใน .env
  ตอน build บนเซิร์ฟเวอร์ deploy บางที่ยังไม่มี DATABASE_URL ให้ใช้
  ถ้าสร้าง adapter ตรง ๆ จะพังตั้งแต่ตอน import ทำให้ build ล้มทั้งงาน
  จึงสร้างแบบหน่วงไว้ และปล่อยให้ล้มตอนเรียกใช้จริง ซึ่งทุกหน้ามี catch รออยู่แล้ว
*/
function createClient() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    console.error("[prisma] ไม่พบ DATABASE_URL — คำสั่งที่แตะฐานข้อมูลจะล้มเหลว");
  }

  return new PrismaClient({ adapter: new PrismaMariaDb(url ?? "") });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
