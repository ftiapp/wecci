import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/app/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// ตัวเชื่อมต่อรองรับทั้ง MySQL และ MariaDB อ่านค่าจาก DATABASE_URL ใน .env
const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
