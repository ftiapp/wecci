import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { UnreadBadge } from "@/components/admin/UnreadBadge";
import { requireAdmin } from "@/lib/auth/current-user";
import { pageDefs } from "@/lib/content/schema";
import { getPageUpdatedAt } from "@/lib/content/store";
import { countUnreadMessages } from "@/lib/messages";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const username = await requireAdmin();
  const unread = await countUnreadMessages();
  const eventCount = await prisma.cms_events.count({ where: { published: true } });

  const pages = await Promise.all(
    pageDefs.map(async (page) => ({
      ...page,
      latest: await getPageUpdatedAt(page.slug),
    })),
  );

  return (
    <AdminShell
      username={username}
      title="ภาพรวมระบบจัดการเว็บไซต์"
      description="เลือกหน้าที่ต้องการแก้ไของค์ประกอบและเนื้อหา"
    >
      <div className="mb-6 grid gap-5 sm:grid-cols-2">
      {/* การ์ดข่าวสาร/กิจกรรม */}
      <Link
        href="/admin/events"
        className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-wecci-aqua hover:shadow-lg"
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-wecci-blue to-wecci-aqua text-white">
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M4 5h16v15H4zM4 9h16M8 3v4M16 3v4" />
          </svg>
        </span>

        <div>
          <p className="font-bold text-wecci-navy group-hover:text-wecci-blue">
            ข่าวสารและกิจกรรม
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {eventCount > 0
              ? `เผยแพร่อยู่ ${eventCount} กิจกรรม`
              : "ยังไม่มีกิจกรรม — กดเพื่อเพิ่ม"}
          </p>
        </div>
      </Link>

      {/* การ์ดข้อความ — มีป้ายแดงบอกจำนวนที่ยังไม่อ่านเหมือนไอคอนแอปบนมือถือ */}
      <Link
        href="/admin/messages"
        className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-wecci-aqua hover:shadow-lg"
      >
        <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-wecci-navy to-wecci-blue text-white">
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M3 6h18v12H3zM3 7l9 6 9-6" />
          </svg>
          <span className="absolute -right-2 -top-2">
            <UnreadBadge count={unread} size="lg" />
          </span>
        </span>

        <div>
          <p className="font-bold text-wecci-navy group-hover:text-wecci-blue">
            ข้อความจากฟอร์ม
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {unread > 0
              ? `มีข้อความใหม่ ${unread} รายการรอการอ่าน`
              : "อ่านครบทุกข้อความแล้ว"}
          </p>
        </div>
      </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {pages.map((page) => (
          <Link
            key={page.slug}
            href={`/admin/pages/${page.slug}`}
            className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-wecci-aqua hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-wecci-navy group-hover:text-wecci-blue">
                  {page.label}
                </p>
                <p className="mt-1 text-xs text-slate-400">{page.href}</p>
              </div>
              <span className="rounded-full bg-wecci-sand px-3 py-1 text-xs font-semibold text-wecci-blue">
                {page.blocks.length} บล็อก
              </span>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              {page.latest
                ? `แก้ไขล่าสุด ${page.latest.updatedAt.toLocaleString("th-TH")} โดย ${page.latest.updatedBy ?? "-"}`
                : "ยังไม่เคยแก้ไข (ใช้ค่าตั้งต้น)"}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
        หน้าอื่น ๆ จะทยอยเพิ่มเข้ามาในระบบจัดการ — เพิ่มได้ที่{" "}
        <code className="rounded bg-slate-100 px-1.5 py-0.5">lib/content/schema.ts</code>
      </div>
    </AdminShell>
  );
}
