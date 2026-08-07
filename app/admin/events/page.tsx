import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { requireAdmin } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";
import { deleteEventAction, togglePublishedAction } from "./actions";

export const dynamic = "force-dynamic";

/** วันที่แบบไทย เช่น 23/9/2568 */
const dateFormat = new Intl.DateTimeFormat("th-TH", {
  day: "numeric",
  month: "numeric",
  year: "numeric",
});

/** รายการกิจกรรมทั้งหมดที่แสดงในปฏิทินหน้า /news */
export default async function AdminEventsPage() {
  const username = await requireAdmin();

  const events = await prisma.cms_events.findMany({
    orderBy: { startDate: "desc" },
    include: { tags: true },
  });

  return (
    <AdminShell username={username} title="ข่าวสารและกิจกรรม" bare>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-wecci-navy">ข่าวสารและกิจกรรม</h1>

        <div className="ml-auto flex flex-wrap gap-2">
          <Link
            href="/news/events"
            target="_blank"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-wecci-blue hover:text-wecci-blue"
          >
            ดูหน้าจริง ↗
          </Link>

          <Link
            href="/admin/events/tags"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-wecci-blue hover:text-wecci-blue"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
            </svg>
            จัดการ Tags
          </Link>

          <Link
            href="/admin/events/new"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-wecci-navy to-wecci-blue px-5 py-2 text-sm font-semibold text-white transition hover:from-wecci-blue hover:to-wecci-aqua"
          >
            + เพิ่มกิจกรรม
          </Link>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-16 text-center">
          <p className="text-lg font-bold text-wecci-navy">ยังไม่มีกิจกรรมในระบบ</p>
          <p className="mt-2 text-sm text-slate-500">
            ปฏิทินหน้าข่าวสารจะยังว่างอยู่จนกว่าจะเพิ่มกิจกรรมแรก
          </p>
          <Link
            href="/admin/events/new"
            className="mt-6 inline-block rounded-xl bg-gradient-to-r from-wecci-navy to-wecci-blue px-6 py-2.5 text-sm font-semibold text-white"
          >
            + เพิ่มกิจกรรม
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-4xl text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="px-5 py-3.5 font-semibold">หัวข้อ</th>
                <th className="px-5 py-3.5 font-semibold">Tags</th>
                <th className="px-5 py-3.5 font-semibold whitespace-nowrap">วันที่จัด</th>
                <th className="px-5 py-3.5 font-semibold whitespace-nowrap">ยอดวิว</th>
                <th className="px-5 py-3.5 font-semibold whitespace-nowrap">
                  สถานะ
                  <span className="ml-1 text-xs font-normal text-slate-400">(กดเพื่อสลับ)</span>
                </th>
                <th className="px-5 py-3.5 text-right font-semibold">จัดการ</th>
              </tr>
            </thead>

            <tbody>
              {events.map((event) => (
                <tr
                  key={event.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                >
                  {/* หัวข้อยาวให้ตัดด้วย ... แล้วเอาเมาส์ชี้เพื่อดูข้อความเต็ม */}
                  <td className="max-w-0 px-5 py-3.5">
                    <Link
                      href={`/admin/events/${event.id}`}
                      title={event.title}
                      className="block truncate font-medium text-wecci-navy transition hover:text-wecci-blue"
                    >
                      {event.title}
                    </Link>
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                        {event.category}
                      </span>
                      {event.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="rounded-md bg-wecci-sand px-2 py-0.5 text-xs text-wecci-blue"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap text-slate-500">
                    {dateFormat.format(event.startDate)}
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.6}
                        aria-hidden
                      >
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      {event.views}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap">
                    {/* ป้ายสถานะกดสลับได้ — ไอคอนลูกศรวนบอกว่าคลิกเปลี่ยนค่าได้ */}
                    <form action={togglePublishedAction}>
                      <input type="hidden" name="id" value={event.id} />
                      <input type="hidden" name="published" value={String(event.published)} />
                      <button
                        type="submit"
                        title={
                          event.published
                            ? "คลิกเพื่อเปลี่ยนเป็น “ฉบับร่าง” (ซ่อนจากหน้าเว็บ)"
                            : "คลิกเพื่อเปลี่ยนเป็น “เผยแพร่” (แสดงบนหน้าเว็บ)"
                        }
                        className={`group/status inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ring-1 transition ${
                          event.published
                            ? "bg-emerald-50 text-emerald-600 ring-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-500 ring-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            event.published ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        {event.published ? "เผยแพร่" : "ฉบับร่าง"}
                        <svg
                          viewBox="0 0 24 24"
                          className="h-3 w-3 opacity-40 transition group-hover/status:opacity-100"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          <path d="M17 2v6h-6M7 22v-6h6M21 12a9 9 0 0 1-15 6.7M3 12a9 9 0 0 1 15-6.7" />
                        </svg>
                      </button>
                    </form>
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1">
                      <Link
                        href={`/admin/events/${event.id}`}
                        title="แก้ไข"
                        aria-label="แก้ไข"
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-wecci-blue"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.6}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                        </svg>
                      </Link>

                      <form action={deleteEventAction}>
                        <input type="hidden" name="id" value={event.id} />
                        <ConfirmButton
                          message={`ลบ “${event.title}” ถาวรหรือไม่?`}
                          label="ลบ"
                          className="rounded-lg p-1.5 text-red-400 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.6}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden
                          >
                            <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />
                          </svg>
                        </ConfirmButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
