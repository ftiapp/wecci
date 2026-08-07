import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { requireAdmin } from "@/lib/auth/current-user";
import { kindLabel } from "@/lib/knowledge/kinds";
import { prisma } from "@/lib/prisma";
import { deleteKnowledgeAction, toggleKnowledgePublishedAction } from "./actions";

export const dynamic = "force-dynamic";

const dateFormat = new Intl.DateTimeFormat("th-TH", {
  day: "numeric",
  month: "numeric",
  year: "numeric",
});

/** รายการองค์ความรู้และวีดีโอที่แสดงในหน้า /news/knowledge */
export default async function AdminKnowledgePage() {
  const username = await requireAdmin();

  const items = await prisma.cms_knowledge_items.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <AdminShell username={username} title="องค์ความรู้/วีดีโอ" bare>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-wecci-navy">องค์ความรู้/วีดีโอ</h1>

        <div className="ml-auto flex flex-wrap gap-2">
          <Link
            href="/news/knowledge"
            target="_blank"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-wecci-blue hover:text-wecci-blue"
          >
            ดูหน้าจริง ↗
          </Link>

          <Link
            href="/admin/knowledge/new"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-wecci-navy to-wecci-blue px-5 py-2 text-sm font-semibold text-white transition hover:from-wecci-blue hover:to-wecci-aqua"
          >
            + เพิ่มรายการ
          </Link>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-16 text-center">
          <p className="text-lg font-bold text-wecci-navy">ยังไม่มีรายการในระบบ</p>
          <p className="mt-2 text-sm text-slate-500">
            หน้าองค์ความรู้/วีดีโอจะยังว่างอยู่จนกว่าจะเพิ่มรายการแรก
          </p>
          <Link
            href="/admin/knowledge/new"
            className="mt-6 inline-block rounded-xl bg-gradient-to-r from-wecci-navy to-wecci-blue px-6 py-2.5 text-sm font-semibold text-white"
          >
            + เพิ่มรายการ
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-4xl text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="px-5 py-3.5 font-semibold">ชื่อเรื่อง</th>
                <th className="px-5 py-3.5 font-semibold whitespace-nowrap">ประเภท</th>
                <th className="px-5 py-3.5 font-semibold">ลิงก์</th>
                <th className="px-5 py-3.5 font-semibold whitespace-nowrap">วันที่เพิ่ม</th>
                <th className="px-5 py-3.5 font-semibold whitespace-nowrap">
                  สถานะ
                  <span className="ml-1 text-xs font-normal text-slate-400">(กดเพื่อสลับ)</span>
                </th>
                <th className="px-5 py-3.5 text-right font-semibold">จัดการ</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                >
                  {/* ชื่อยาวให้ตัดด้วย ... เอาเมาส์ชี้เพื่อดูข้อความเต็ม */}
                  <td className="max-w-0 px-5 py-3.5">
                    <Link
                      href={`/admin/knowledge/${item.id}`}
                      title={item.title}
                      className="flex items-center gap-2 font-medium text-wecci-navy transition hover:text-wecci-blue"
                    >
                      {/* ดาวเหลืองบอกว่ารายการนี้ถูกตั้งเป็นไฮไลท์ */}
                      {item.featured && (
                        <span className="shrink-0 text-amber-500" title="ไฮไลท์">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="currentColor"
                            aria-label="ไฮไลท์"
                          >
                            <path d="m12 2 2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8Z" />
                          </svg>
                        </span>
                      )}
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="rounded-md bg-wecci-sand px-2 py-0.5 text-xs text-wecci-blue">
                      {kindLabel(item.kind)}
                    </span>
                  </td>

                  <td className="max-w-0 px-5 py-3.5">
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        title={item.url}
                        className="block truncate text-slate-500 hover:text-wecci-blue"
                      >
                        {item.url}
                      </a>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap text-slate-500">
                    {dateFormat.format(item.createdAt)}
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <form action={toggleKnowledgePublishedAction}>
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="published" value={String(item.published)} />
                      <button
                        type="submit"
                        title={
                          item.published
                            ? "คลิกเพื่อเปลี่ยนเป็น “ฉบับร่าง” (ซ่อนจากหน้าเว็บ)"
                            : "คลิกเพื่อเปลี่ยนเป็น “เผยแพร่” (แสดงบนหน้าเว็บ)"
                        }
                        className={`group/status inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ring-1 transition ${
                          item.published
                            ? "bg-emerald-50 text-emerald-600 ring-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-500 ring-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            item.published ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        {item.published ? "เผยแพร่" : "ฉบับร่าง"}
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
                        href={`/admin/knowledge/${item.id}`}
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

                      <form action={deleteKnowledgeAction}>
                        <input type="hidden" name="id" value={item.id} />
                        <ConfirmButton
                          message={`ลบ “${item.title}” ถาวรหรือไม่?`}
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
