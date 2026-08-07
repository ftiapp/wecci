import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { requireAdmin } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";
import { deleteStaffAction, toggleStaffPublishedAction } from "./actions";

export const dynamic = "force-dynamic";

/** รายชื่อบุคลากรที่แสดงในหน้า /about/staff */
export default async function AdminStaffPage() {
  const username = await requireAdmin();

  const staff = await prisma.cms_staff.findMany({
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });

  return (
    <AdminShell username={username} title="โครงสร้างบุคลากร" bare>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-wecci-navy">โครงสร้างบุคลากร</h1>

        <div className="ml-auto flex flex-wrap gap-2">
          <Link
            href="/about/staff"
            target="_blank"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-wecci-blue hover:text-wecci-blue"
          >
            ดูหน้าจริง ↗
          </Link>

          <Link
            href="/admin/staff/new"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-wecci-navy to-wecci-blue px-5 py-2 text-sm font-semibold text-white transition hover:from-wecci-blue hover:to-wecci-aqua"
          >
            + เพิ่มบุคลากร
          </Link>
        </div>
      </div>

      {staff.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-16 text-center">
          <p className="text-lg font-bold text-wecci-navy">ยังไม่มีรายชื่อในระบบ</p>
          <p className="mt-2 text-sm text-slate-500">
            หน้าโครงสร้างบุคลากรจะยังว่างอยู่จนกว่าจะเพิ่มรายชื่อแรก
          </p>
          <Link
            href="/admin/staff/new"
            className="mt-6 inline-block rounded-xl bg-gradient-to-r from-wecci-navy to-wecci-blue px-6 py-2.5 text-sm font-semibold text-white"
          >
            + เพิ่มบุคลากร
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-4xl text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="px-5 py-3.5 font-semibold whitespace-nowrap">ลำดับ</th>
                <th className="px-5 py-3.5 font-semibold whitespace-nowrap">ระดับ</th>
                <th className="px-5 py-3.5 font-semibold">ชื่อ-นามสกุล</th>
                <th className="px-5 py-3.5 font-semibold whitespace-nowrap">เบอร์โทร</th>
                <th className="px-5 py-3.5 font-semibold">อีเมล</th>
                <th className="px-5 py-3.5 font-semibold whitespace-nowrap">
                  สถานะ
                  <span className="ml-1 text-xs font-normal text-slate-400">(กดเพื่อสลับ)</span>
                </th>
                <th className="px-5 py-3.5 text-right font-semibold">จัดการ</th>
              </tr>
            </thead>

            <tbody>
              {staff.map((person) => (
                <tr
                  key={person.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                >
                  <td className="px-5 py-3.5 whitespace-nowrap text-slate-400">
                    <span className="inline-flex items-center gap-1.5">
                      {person.sortOrder}
                      {person.newRow && (
                        <span
                          title="เริ่มแถวใหม่บนหน้าเว็บ"
                          className="rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-bold text-wecci-blue"
                        >
                          ขึ้นแถวใหม่
                        </span>
                      )}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="rounded-md bg-wecci-sand px-2 py-0.5 text-xs text-wecci-blue">
                      {person.level}
                    </span>
                  </td>

                  <td className="max-w-0 px-5 py-3.5">
                    <Link
                      href={`/admin/staff/${person.id}`}
                      title={person.nameTh}
                      className="block truncate font-medium text-wecci-navy transition hover:text-wecci-blue"
                    >
                      {person.nameTh}
                    </Link>
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap text-slate-500">
                    {person.phone || <span className="text-slate-300">—</span>}
                  </td>

                  <td className="max-w-0 px-5 py-3.5">
                    {person.email ? (
                      <a
                        href={`mailto:${person.email}`}
                        title={person.email}
                        className="block truncate text-slate-500 hover:text-wecci-blue"
                      >
                        {person.email}
                      </a>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <form action={toggleStaffPublishedAction}>
                      <input type="hidden" name="id" value={person.id} />
                      <input type="hidden" name="published" value={String(person.published)} />
                      <button
                        type="submit"
                        title={
                          person.published
                            ? "คลิกเพื่อซ่อนจากหน้าเว็บ"
                            : "คลิกเพื่อแสดงบนหน้าเว็บ"
                        }
                        className={`group/status inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ring-1 transition ${
                          person.published
                            ? "bg-emerald-50 text-emerald-600 ring-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-500 ring-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            person.published ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        {person.published ? "แสดง" : "ซ่อน"}
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
                        href={`/admin/staff/${person.id}`}
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

                      <form action={deleteStaffAction}>
                        <input type="hidden" name="id" value={person.id} />
                        <ConfirmButton
                          message={`ลบ “${person.nameTh}” ถาวรหรือไม่?`}
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
