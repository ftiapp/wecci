import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";
import { createTagAction, deleteTagAction } from "../actions";

export const dynamic = "force-dynamic";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-wecci-blue focus:ring-2 focus:ring-wecci-blue/20";

/** สร้างและลบ Tag ที่ใช้ติดกิจกรรม */
export default async function EventTagsPage() {
  const username = await requireAdmin();

  const tags = await prisma.cms_event_tags.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { events: true } } },
  });

  return (
    <AdminShell
      username={username}
      title="จัดการ Tags"
      description="Tag ใช้จัดกลุ่มกิจกรรม เลือกติดได้ในหน้าเพิ่ม/แก้ไขกิจกรรม"
    >
      <div>
        <Link
          href="/admin/events"
          className="mb-5 inline-block rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-600 transition hover:border-wecci-blue hover:text-wecci-blue"
        >
          ← กลับไปรายการกิจกรรม
        </Link>

        <form
          action={createTagAction}
          className="mb-6 rounded-2xl border border-slate-200 bg-white p-5"
        >
          <p className="mb-3 font-bold text-wecci-navy">เพิ่ม Tag ใหม่</p>

          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <input name="name" required placeholder="ชื่อ Tag (ไทย)" className={inputClass} />
            <input name="nameEn" placeholder="Tag name (English)" className={inputClass} />
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-wecci-navy to-wecci-blue px-6 py-2.5 text-sm font-semibold text-white transition hover:from-wecci-blue hover:to-wecci-aqua"
            >
              เพิ่ม
            </button>
          </div>
        </form>

        {tags.length === 0 ? (
          <p className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-400">
            ยังไม่มี Tag ในระบบ
          </p>
        ) : (
          <ul className="space-y-2">
            {tags.map((tag) => (
              <li
                key={tag.id}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"
              >
                <span className="rounded-full bg-wecci-sand px-3 py-1 text-xs font-semibold text-wecci-blue">
                  {tag.name}
                </span>
                {tag.nameEn && <span className="text-sm text-slate-400">{tag.nameEn}</span>}

                <span className="ml-auto text-xs text-slate-400">
                  ใช้อยู่ {tag._count.events} กิจกรรม
                </span>

                <form action={deleteTagAction}>
                  <input type="hidden" name="id" value={tag.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-red-200 px-4 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    ลบ
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}
