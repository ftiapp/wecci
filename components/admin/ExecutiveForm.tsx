"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  createExecutiveAction,
  updateExecutiveAction,
  type ExecutiveFormState,
} from "@/app/admin/executives/actions";
import { ImageField } from "@/components/admin/ImageField";
import { executiveLevels } from "@/lib/executives/levels";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-wecci-blue focus:ring-2 focus:ring-wecci-blue/20";

export type ExecutiveFormValues = {
  id?: number;
  level: string;
  nameTh: string;
  position: string;
  duty: string;
  org: string;
  phone: string;
  email: string;
  photo: string;
  sortOrder: number;
  published: boolean;
};

/** ฟอร์มเพิ่ม/แก้ไขผู้บริหาร — โครงเดียวกับฟอร์มบุคลากร แต่มีตำแหน่งเต็มกับต้นสังกัดเพิ่ม */
export function ExecutiveForm({ values }: { values: ExecutiveFormValues }) {
  const isEdit = typeof values.id === "number";

  const [state, formAction, pending] = useActionState<ExecutiveFormState, FormData>(
    isEdit ? updateExecutiveAction : createExecutiveAction,
    {},
  );

  return (
    <form action={formAction}>
      {isEdit && <input type="hidden" name="id" value={values.id} />}

      <div className="sticky top-0 z-10 -mx-6 mb-6 flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white/95 px-6 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        <Link
          href="/admin/executives"
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
          {isEdit ? "แก้ไขข้อมูลผู้บริหาร" : "เพิ่มผู้บริหาร"}
        </p>

        <div className="ml-auto flex items-center gap-2">
          <a
            href="/about/executives"
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
        <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{state.error}</p>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <aside className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
          <ImageField
            name="photo"
            label="รูปผู้บริหาร"
            help="แนะนำครึ่งตัวหน้าตรง ไดคัตพื้นหลังออกเป็นไฟล์พื้นโปร่งใส (PNG/WebP) เพราะหน้าเว็บวางตัวคนทับแผ่นสี ให้หัวล้นขึ้นเหนือแผ่น — ไฟล์นี้จะเปิดให้คนทั่วไปกดดาวน์โหลดจากหน้าเว็บได้ด้วย"
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

        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
          <Field label="ระดับในคณะผู้บริหาร *" hint="(ใช้จัดกลุ่มบนหน้าเว็บ)">
            <select name="level" required defaultValue={values.level} className={inputClass}>
              {executiveLevels.map((level) => (
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
              placeholder="เช่น นายสมชาย ใจดี"
              className={inputClass}
            />
          </Field>

          <Field label="ตำแหน่งเต็ม" hint="(ตามที่ใช้ในเอกสารทางการ)">
            <input
              name="position"
              defaultValue={values.position}
              placeholder="เช่น ประธานคณะกรรมการบริหารสถาบันฯ"
              className={inputClass}
            />
          </Field>

          <Field label="งานที่กำกับดูแล" hint="(เว้นว่างได้ถ้าไม่มี)">
            <input
              name="duty"
              defaultValue={values.duty}
              placeholder="เช่น งานด้านกลยุทธ์ แผนงาน และกฎหมาย"
              className={inputClass}
            />
          </Field>

          <Field label="หน่วยงานต้นสังกัด">
            <input
              name="org"
              defaultValue={values.org}
              placeholder="เช่น สภาอุตสาหกรรมแห่งประเทศไทย"
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
