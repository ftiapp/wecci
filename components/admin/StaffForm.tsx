"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  createStaffAction,
  updateStaffAction,
  type StaffFormState,
} from "@/app/admin/staff/actions";
import { ImageField } from "@/components/admin/ImageField";
import { staffLevels } from "@/lib/staff/levels";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-wecci-blue focus:ring-2 focus:ring-wecci-blue/20";

export type StaffFormValues = {
  id?: number;
  level: string;
  nameTh: string;
  phone: string;
  email: string;
  photo: string;
  sortOrder: number;
  newRow: boolean;
  published: boolean;
};

/** ฟอร์มเพิ่ม/แก้ไขบุคลากร — โครงเดียวกับฟอร์มกิจกรรม */
export function StaffForm({ values }: { values: StaffFormValues }) {
  const isEdit = typeof values.id === "number";

  const [state, formAction, pending] = useActionState<StaffFormState, FormData>(
    isEdit ? updateStaffAction : createStaffAction,
    {},
  );

  return (
    <form action={formAction}>
      {isEdit && <input type="hidden" name="id" value={values.id} />}

      {/* แถบบนสุด — ชื่อหน้าและปุ่มหลัก ติดขอบบนตอนเลื่อน */}
      <div className="sticky top-0 z-10 -mx-6 mb-6 flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white/95 px-6 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        <Link
          href="/admin/staff"
          aria-label="กลับไปหน้ารายการ"
          className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-wecci-navy"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
        </Link>

        <p className="text-lg font-bold text-wecci-navy">
          {isEdit ? "แก้ไขข้อมูลบุคลากร" : "เพิ่มบุคลากร"}
        </p>

        <div className="ml-auto flex items-center gap-2">
          <a
            href="/about/staff"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-wecci-blue hover:text-wecci-blue"
          >
            ดูหน้าจริง ↗
          </a>

          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-gradient-to-r from-wecci-navy to-wecci-blue px-6 py-2 text-sm font-semibold text-white transition hover:from-wecci-blue hover:to-wecci-aqua disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "กำลังบันทึก..." : isEdit ? "บันทึก" : "เพิ่ม"}
          </button>
        </div>
      </div>

      {state.error && (
        <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        {/* คอลัมน์ซ้าย — รูปและการแสดงผล */}
        <aside className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
          <ImageField
            name="photo"
            label="รูปบุคลากร"
            help="แนะนำสี่เหลี่ยมจัตุรัส 600 × 600 px"
            defaultValue={values.photo}
          />

          <Field label="ลำดับการแสดงผล" hint="(ยิ่งน้อยยิ่งอยู่บน)">
            <input
              type="number"
              name="sortOrder"
              defaultValue={values.sortOrder}
              className={inputClass}
            />
          </Field>

          <label className="flex items-start gap-3 rounded-xl bg-sky-50 p-4 text-sm text-slate-700">
            <input
              type="checkbox"
              name="newRow"
              defaultChecked={values.newRow}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-wecci-blue focus:ring-wecci-blue/30"
            />
            <span>
              ขึ้นแถวใหม่บนหน้าเว็บ
              <span className="mt-0.5 block text-xs text-slate-400">
                ใช้เมื่ออยากให้คนนี้เริ่มบรรทัดถัดไป เช่น แยกกลุ่มสายงาน
              </span>
            </span>
          </label>

          <label className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
            <input
              type="checkbox"
              name="published"
              defaultChecked={values.published}
              className="h-4 w-4 rounded border-slate-300 text-wecci-blue focus:ring-wecci-blue/30"
            />
            แสดงบนหน้าเว็บ
          </label>
        </aside>

        {/* คอลัมน์ขวา — ข้อมูลบุคคล */}
        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
          <Field label="ระดับตำแหน่ง *" hint="(ใช้จัดกลุ่มบนหน้าเว็บ)">
            <select name="level" required defaultValue={values.level} className={inputClass}>
              {staffLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </Field>

          <Field label="ชื่อ-นามสกุล *">
            <input
              name="nameTh"
              required
              defaultValue={values.nameTh}
              placeholder="เช่น นางสรวงระวี คุณธนกาญจน์"
              className={inputClass}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="เบอร์โทรศัพท์">
              <input
                name="phone"
                defaultValue={values.phone}
                placeholder="02 345 1261 ต่อ 100"
                className={inputClass}
              />
            </Field>

            <Field label="อีเมล">
              <input
                type="email"
                name="email"
                defaultValue={values.email}
                placeholder="name@fti.or.th"
                className={inputClass}
              />
            </Field>
          </div>


        </section>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
        {hint && <span className="ml-1 font-normal text-slate-400">{hint}</span>}
      </span>
      {children}
    </label>
  );
}
