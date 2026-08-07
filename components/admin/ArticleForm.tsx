"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  createArticleAction,
  updateArticleAction,
  type ArticleFormState,
} from "@/app/admin/articles/actions";
import { BlockEditor } from "@/components/admin/BlockEditor";
import { ImageField } from "@/components/admin/ImageField";
import type { ContentBlock } from "@/lib/events/content";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-wecci-blue focus:ring-2 focus:ring-wecci-blue/20";

export type ArticleFormValues = {
  id?: number;
  title: string;
  excerpt: string;
  content: ContentBlock[];
  category: string;
  image: string;
  publishedAt: string;
  published: boolean;
  featured: boolean;
};

/** ฟอร์มเพิ่ม/แก้ไขบทความ */
export function ArticleForm({
  values,
  categories,
}: {
  values: ArticleFormValues;
  /** หมวดที่เคยใช้แล้ว เอามาเป็นตัวเลือกให้พิมพ์ซ้ำน้อยลง */
  categories: string[];
}) {
  const isEdit = typeof values.id === "number";

  const [state, formAction, pending] = useActionState<ArticleFormState, FormData>(
    isEdit ? updateArticleAction : createArticleAction,
    {},
  );

  const [content, setContent] = useState(values.content);

  return (
    <form action={formAction}>
      {isEdit && <input type="hidden" name="id" value={values.id} />}

      {/* แถบบนสุด — ชื่อหน้าและปุ่มหลัก ติดขอบบนตอนเลื่อน */}
      <div className="sticky top-0 z-10 -mx-6 mb-6 flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white/95 px-6 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        <Link
          href="/admin/articles"
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
          {isEdit ? "แก้ไขบทความ" : "เพิ่มบทความใหม่"}
        </p>

        <div className="ml-auto flex items-center gap-2">
          {isEdit && (
            <a
              href={`/news/articles/${values.id}`}
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

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
              หัวข้อบทความ *
            </span>
            <input
              name="title"
              required
              defaultValue={values.title}
              placeholder="เช่น รู้จักภาษีคาร์บอน (Carbon TAX)"
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">เกริ่นนำ</span>
            <textarea
              name="excerpt"
              rows={3}
              defaultValue={values.excerpt}
              placeholder="สรุปสั้น ๆ ว่าบทความนี้พูดถึงอะไร แสดงบนการ์ดในหน้ารายการ"
              className={inputClass}
            />
          </label>

          <div>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
              เนื้อหาบทความ
              <span className="ml-1 font-normal text-slate-400">
                (หัวข้อ ข้อความ รูป ตาราง ลิงก์)
              </span>
            </span>
            <BlockEditor name="content" value={content} onChange={setContent} />
          </div>
        </div>

        <aside className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
              วันที่ลงบทความ *
            </span>
            <input
              type="date"
              name="publishedAt"
              required
              defaultValue={values.publishedAt}
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">หมวดหมู่</span>
            <input
              name="category"
              defaultValue={values.category}
              list="article-categories"
              placeholder="เช่น สิ่งแวดล้อม"
              className={inputClass}
            />
            <datalist id="article-categories">
              {categories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
            <span className="mt-1 block text-xs text-slate-400">
              ใช้เป็นแท็กบนการ์ดและตัวกรองในหน้าเว็บ
            </span>
          </label>

          <ImageField
            name="image"
            label="ภาพปก"
            help="แนะนำแนวนอน 16:9 กว้างอย่างน้อย 1200px"
            defaultValue={values.image}
          />

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
            ตั้งเป็นไฮไลท์บทความ
          </label>
        </aside>
      </div>

    </form>
  );
}
