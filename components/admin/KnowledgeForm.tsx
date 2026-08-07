"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  createKnowledgeAction,
  updateKnowledgeAction,
  type KnowledgeFormState,
} from "@/app/admin/knowledge/actions";
import { BlockEditor } from "@/components/admin/BlockEditor";
import { ImageField } from "@/components/admin/ImageField";
import type { ContentBlock } from "@/lib/events/content";
import { knowledgeKinds } from "@/lib/knowledge/kinds";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-wecci-blue focus:ring-2 focus:ring-wecci-blue/20";

export type KnowledgeFormValues = {
  id?: number;
  title: string;
  description: string;
  content: ContentBlock[];
  kind: string;
  url: string;
  image: string;
  published: boolean;
  featured: boolean;
};

/** ฟอร์มเพิ่ม/แก้ไของค์ความรู้ — โครงเดียวกับฟอร์มกิจกรรม */
export function KnowledgeForm({ values }: { values: KnowledgeFormValues }) {
  const isEdit = typeof values.id === "number";

  const [state, formAction, pending] = useActionState<KnowledgeFormState, FormData>(
    isEdit ? updateKnowledgeAction : createKnowledgeAction,
    {},
  );

  const [content, setContent] = useState(values.content);

  return (
    <form action={formAction}>
      {isEdit && <input type="hidden" name="id" value={values.id} />}

      {/* แถบบนสุด — ชื่อหน้าและปุ่มหลัก ติดขอบบนตอนเลื่อน */}
      <div className="sticky top-0 z-10 -mx-6 mb-6 flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white/95 px-6 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        <Link
          href="/admin/knowledge"
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
          {isEdit ? "แก้ไของค์ความรู้/วีดีโอ" : "เพิ่มองค์ความรู้/วีดีโอ"}
        </p>

        <div className="ml-auto flex items-center gap-2">
          {isEdit && (
            <a
              href={`/news/knowledge/${values.id}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-wecci-blue hover:text-wecci-blue"
            >
              Preview ↗
            </a>
          )}

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
        {/* คอลัมน์ซ้าย — ข้อมูลกำกับ */}
        <aside className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
          <section className="space-y-4">
            <h2 className="font-bold text-wecci-navy">ประเภทและแหล่งที่มา</h2>

            <Field label="ประเภท *">
              <select name="kind" required defaultValue={values.kind} className={inputClass}>
                {knowledgeKinds.map((kind) => (
                  <option key={kind.value} value={kind.value}>
                    {kind.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="ลิงก์ปลายทาง">
              <input
                type="url"
                name="url"
                defaultValue={values.url}
                placeholder="https://www.youtube.com/watch?v=..."
                className={inputClass}
              />
              <span className="mt-1 block text-xs text-slate-400">
                ถ้าเป็นวีดีโอ YouTube ระบบจะดึงภาพปกมาให้เอง และฝังคลิปในหน้ารายละเอียด
              </span>
            </Field>
          </section>

          <section className="border-t border-slate-100 pt-5">
            <ImageField
              name="image"
              label="ภาพปก"
              help="แนวนอน 16:9 — เว้นว่างได้ถ้าเป็นวีดีโอ YouTube"
              defaultValue={values.image}
            />
          </section>

          <section className="space-y-3 border-t border-slate-100 pt-5">
            <label className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
              <input
                type="checkbox"
                name="published"
                defaultChecked={values.published}
                className="h-4 w-4 rounded border-slate-300 text-wecci-blue focus:ring-wecci-blue/30"
              />
              เผยแพร่บนหน้าเว็บ
            </label>

            <label className="flex items-center gap-3 rounded-xl bg-amber-50 p-4 text-sm text-slate-700">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={values.featured}
                className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400/40"
              />
              ตั้งเป็นไฮไลท์
            </label>
          </section>
        </aside>

        {/* คอลัมน์ขวา — เนื้อหา */}
        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
          <Field label="ชื่อเรื่อง *">
            <input
              name="title"
              required
              defaultValue={values.title}
              placeholder="เช่น คู่มือการประเมิน Water Footprint"
              className={inputClass}
            />
          </Field>

          <Field label="คำอธิบาย">
            <textarea
              name="description"
              rows={3}
              defaultValue={values.description}
              placeholder="อธิบายสั้น ๆ ว่าเนื้อหานี้เกี่ยวกับอะไร แสดงบนการ์ดและหน้ารายละเอียด"
              className={inputClass}
            />
          </Field>

          <Field label="รายละเอียด" hint="(หัวข้อ ข้อความ รูป ตาราง ลิงก์)">
            <BlockEditor name="content" value={content} onChange={setContent} />
          </Field>
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
