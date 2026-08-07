"use client";

import Link from "next/link";
import { useState } from "react";
import { useActionState } from "react";
import {
  createEventAction,
  updateEventAction,
  type EventFormState,
} from "@/app/admin/events/actions";
import { eventCategories } from "@/lib/events/categories";
import type { ContentBlock } from "@/lib/events/content";
import { BlockEditor } from "@/components/admin/BlockEditor";
import { ImageField } from "@/components/admin/ImageField";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-wecci-blue focus:ring-2 focus:ring-wecci-blue/20";

export type EventTagOption = { id: number; name: string };

export type EventFormValues = {
  id?: number;
  title: string;
  titleEn: string;
  excerpt: string;
  excerptEn: string;
  content: ContentBlock[];
  contentEn: ContentBlock[];
  category: string;
  startDate: string;
  endDate: string;
  time: string;
  place: string;
  placeEn: string;
  image: string;
  registerUrl: string;
  registerOpenAt: string;
  registerCloseAt: string;
  tagIds: number[];
  published: boolean;
};

/** ฟอร์มเพิ่ม/แก้ไขกิจกรรม — คอลัมน์ซ้ายเป็นข้อมูลกำกับ ขวาเป็นเนื้อหาสองภาษา */
export function EventForm({
  values,
  tags,
}: {
  values: EventFormValues;
  tags: EventTagOption[];
}) {
  const isEdit = typeof values.id === "number";

  const [state, formAction, pending] = useActionState<EventFormState, FormData>(
    isEdit ? updateEventAction : createEventAction,
    {},
  );

  const [lang, setLang] = useState<"th" | "en">("th");
  const [content, setContent] = useState(values.content);
  const [contentEn, setContentEn] = useState(values.contentEn);
  const [selectedTags, setSelectedTags] = useState<number[]>(values.tagIds);

  function toggleTag(id: number) {
    setSelectedTags((current) =>
      current.includes(id) ? current.filter((tag) => tag !== id) : [...current, id],
    );
  }

  return (
    <form action={formAction}>
      {isEdit && <input type="hidden" name="id" value={values.id} />}
      {selectedTags.map((id) => (
        <input key={id} type="hidden" name="tagIds" value={id} />
      ))}

      {/* แถบบนสุด — ชื่อหน้าและปุ่มหลัก ติดขอบบนตอนเลื่อน */}
      <div className="sticky top-0 z-10 -mx-6 mb-6 flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white/95 px-6 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        <Link
          href="/admin/events"
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
          {isEdit ? "แก้ไขกิจกรรม" : "เพิ่มกิจกรรมใหม่"}
        </p>

        <div className="ml-auto flex items-center gap-2">
          {isEdit ? (
            <a
              href={`/news/events/${values.id}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-wecci-blue hover:text-wecci-blue"
            >
              Preview ↗
            </a>
          ) : (
            <button
              type="submit"
              name="__preview"
              value="1"
              disabled={pending}
              title="บันทึกเป็นฉบับร่างแล้วเปิดหน้าจริง"
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-wecci-blue hover:text-wecci-blue disabled:opacity-50"
            >
              Preview
            </button>
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
        {/* คอลัมน์ซ้าย — กำหนดการ ลงทะเบียน Tags โปสเตอร์ */}
        <aside className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
          <section className="space-y-4">
            <h2 className="font-bold text-wecci-navy">กำหนดการ</h2>

            <Field label="ประเภท">
              <select
                name="category"
                required
                defaultValue={values.category}
                className={inputClass}
              >
                {eventCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </Field>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="วันเริ่ม">
                <input
                  type="date"
                  name="startDate"
                  required
                  defaultValue={values.startDate}
                  className={inputClass}
                />
              </Field>
              <Field label="วันสิ้นสุด" hint="(ถ้ามี)">
                <input
                  type="date"
                  name="endDate"
                  defaultValue={values.endDate}
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="เวลา" hint="(เช่น 09.00 – 16.00 น.)">
              <input
                name="time"
                defaultValue={values.time}
                placeholder="09.00 – 16.00 น."
                className={inputClass}
              />
            </Field>

            <Field label={lang === "th" ? "สถานที่ (ไทย)" : "สถานที่ (English)"}>
              {/* เก็บทั้งสองภาษาไว้ในฟอร์มเสมอ ซ่อนแค่ตัวที่ไม่ได้เลือก */}
              <input
                name="place"
                defaultValue={values.place}
                placeholder="เช่น ณ อาคาร ส.อ.ท."
                className={`${inputClass} ${lang === "th" ? "" : "hidden"}`}
              />
              <input
                name="placeEn"
                defaultValue={values.placeEn}
                placeholder="e.g. F.T.I. Building"
                className={`${inputClass} ${lang === "en" ? "" : "hidden"}`}
              />
            </Field>
          </section>

          <section className="space-y-4 border-t border-slate-100 pt-5">
            <h2 className="font-bold text-wecci-navy">การลงทะเบียน</h2>

            <Field label="ลิงก์ลงทะเบียน">
              <input
                type="url"
                name="registerUrl"
                defaultValue={values.registerUrl}
                placeholder="https://..."
                className={inputClass}
              />
              <span className="mt-1 block text-xs text-slate-400">
                ใส่ลิงก์เพื่อสร้าง QR code อัตโนมัติในหน้ารายละเอียด
              </span>
            </Field>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="เปิดรับ">
                <input
                  type="date"
                  name="registerOpenAt"
                  defaultValue={values.registerOpenAt}
                  className={inputClass}
                />
              </Field>
              <Field label="ปิดรับ">
                <input
                  type="date"
                  name="registerCloseAt"
                  defaultValue={values.registerCloseAt}
                  className={inputClass}
                />
              </Field>
            </div>
          </section>

          <section className="border-t border-slate-100 pt-5">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h2 className="font-bold text-wecci-navy">
                Tags <span className="text-xs font-normal text-slate-400">(กดเพื่อเลือก)</span>
              </h2>
              <Link
                href="/admin/events/tags"
                className="text-xs font-semibold text-wecci-blue hover:underline"
              >
                จัดการ Tags
              </Link>
            </div>

            {tags.length === 0 ? (
              <p className="text-xs text-slate-400">
                ยังไม่มี Tag — ไปที่ “จัดการ Tags” เพื่อสร้างก่อน
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const active = selectedTags.includes(tag.id);

                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      aria-pressed={active}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        active
                          ? "bg-wecci-blue text-white"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section className="border-t border-slate-100 pt-5">
            <ImageField
              name="image"
              label="โปสเตอร์"
              help="แนวตั้ง 3:4 — แนะนำ 1200 × 1600 px"
              defaultValue={values.image}
            />
          </section>

          <label className="flex items-center gap-3 border-t border-slate-100 pt-5 text-sm text-slate-700">
            <input
              type="checkbox"
              name="published"
              defaultChecked={values.published}
              className="h-4 w-4 rounded border-slate-300 text-wecci-blue focus:ring-wecci-blue/30"
            />
            เผยแพร่บนหน้าเว็บ
          </label>
        </aside>

        {/* คอลัมน์ขวา — เนื้อหาสองภาษา */}
        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="inline-flex gap-1 rounded-full bg-slate-100 p-1">
            {(["th", "en"] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                className={`rounded-full px-5 py-1.5 text-sm font-semibold transition ${
                  lang === code
                    ? "bg-white text-wecci-navy shadow-sm"
                    : "text-slate-500 hover:text-wecci-navy"
                }`}
              >
                {code === "th" ? "ไทย" : "English"}
              </button>
            ))}
          </div>

          {/* ภาษาไทย */}
          <div className={lang === "th" ? "space-y-5" : "hidden"}>
            <Field label="ชื่อกิจกรรม">
              <input
                name="title"
                required
                defaultValue={values.title}
                placeholder="พิมพ์ชื่อกิจกรรม..."
                className={inputClass}
              />
            </Field>

            <Field label="คำโปรย">
              <textarea
                name="excerpt"
                rows={3}
                defaultValue={values.excerpt}
                placeholder="เขียนคำโปรยสั้น ๆ..."
                className={inputClass}
              />
            </Field>

            <Field label="รายละเอียด" hint="(หัวข้อ ข้อความ รูป ตาราง ลิงก์)">
              <BlockEditor name="content" value={content} onChange={setContent} />
            </Field>
          </div>

          {/* ภาษาอังกฤษ */}
          <div className={lang === "en" ? "space-y-5" : "hidden"}>
            <Field label="Event title" hint="(ไม่บังคับ)">
              <input
                name="titleEn"
                defaultValue={values.titleEn}
                placeholder="Type the event title..."
                className={inputClass}
              />
            </Field>

            <Field label="Summary">
              <textarea
                name="excerptEn"
                rows={3}
                defaultValue={values.excerptEn}
                placeholder="Write a short summary..."
                className={inputClass}
              />
            </Field>

            <Field label="Details">
              <BlockEditor name="contentEn" value={contentEn} onChange={setContentEn} />
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
