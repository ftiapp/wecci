"use client";

import { useMemo, useState } from "react";
import { ArticleTeaser, type ArticleCard } from "@/components/news/ArticleTeaser";
import { ScrollHint } from "@/components/news/ScrollHint";

export type { ArticleCard };

/**
 * หน้ารายการบทความ — แท็บไฮไลท์/ทั้งหมด แถบค้นหาสีเข้ม และตัวกรองหมวดหมู่
 * ทำตามโครงของเว็บ ส.อ.ท. ที่ใช้เป็นต้นแบบ
 */
export function ArticleExplorer({ articles }: { articles: ArticleCard[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo(
    () => [...new Set(articles.map((article) => article.category))].sort(),
    [articles],
  );

  const matched = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return articles.filter((article) => {
      if (category !== "all" && article.category !== category) return false;
      if (!keyword) return true;

      return [article.title, article.excerpt ?? "", article.category].some((field) =>
        field.toLowerCase().includes(keyword),
      );
    });
  }, [articles, query, category]);

  const featuredAll = matched.filter((article) => article.featured);
  // โชว์ไฮไลท์แค่ 6 เรื่องแรก ที่เหลือไปดูต่อในส่วนบทความทั้งหมด
  const featured = featuredAll.slice(0, 6);

  return (
    <div>
      {/* แถบค้นหาสีเข้ม คาดเต็มความกว้าง */}
      <section className="relative left-1/2 mb-12 w-screen -translate-x-1/2 overflow-hidden bg-gradient-to-br from-wecci-navy via-wecci-blue to-wecci-navy py-14 text-center text-white">
        <div
          className="wecci-float pointer-events-none absolute -right-24 -top-20 h-72 w-72 rounded-full bg-wecci-aqua/25 blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto max-w-3xl px-6">
          <h2 className="text-2xl font-bold sm:text-3xl">ค้นหาบทความ</h2>
          <span
            className="mx-auto mt-3 block h-[3px] w-40 bg-gradient-to-r from-wecci-aqua to-wecci-mint"
            aria-hidden
          />

          <p className="mt-5 text-sm text-slate-200 sm:text-base">
            ค้นหาบทความที่คุณสนใจ พิมพ์คำค้น หรือเลือกกรองตามหมวดหมู่
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <svg
                viewBox="0 0 24 24"
                className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                aria-hidden
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>

              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="ค้นหาบทความ... / Search articles..."
                aria-label="ค้นหาบทความ"
                className="w-full rounded-full bg-white py-3.5 pl-14 pr-5 text-sm text-slate-700 shadow-2xl outline-none placeholder:text-slate-400"
              />
            </div>

            {categories.length > 0 && (
              <div className="relative">
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  aria-label="เลือกหมวดหมู่"
                  className="w-full appearance-none rounded-full bg-white/15 py-3.5 pl-12 pr-10 text-sm font-semibold text-white ring-1 ring-white/30 outline-none backdrop-blur transition hover:bg-white/25 sm:w-56"
                >
                  <option value="all" className="text-slate-700">
                    ทุกหมวดหมู่
                  </option>
                  {categories.map((item) => (
                    <option key={item} value={item} className="text-slate-700">
                      {item}
                    </option>
                  ))}
                </select>

                <svg
                  viewBox="0 0 24 24"
                  className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M20.6 13.4 12 22l-9-9V3h10Z" />
                  <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" />
                </svg>

                <svg
                  viewBox="0 0 24 24"
                  className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* บทความไฮไลท์ */}
      {featuredAll.length > 0 && (
        <section id="featured" key={`featured-${category}-${query}`} className="wecci-tab-in">
          <SectionTitle title="บทความไฮไลท์" count={featuredAll.length} />

          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((article) => (
              <li key={article.id} className="h-full">
                <ArticleTeaser article={article} />
              </li>
            ))}
          </ul>

          <ScrollHint href="#all">เลื่อนลงเพื่อดูบทความทั้งหมด</ScrollHint>
        </section>
      )}

      {/* แถบคั่นก่อนเข้าส่วนบทความทั้งหมด */}
      <section className="relative left-1/2 my-12 w-screen -translate-x-1/2 overflow-hidden bg-gradient-to-br from-wecci-navy via-wecci-blue to-wecci-navy py-12 text-center text-white">
        <div
          className="wecci-float pointer-events-none absolute -left-20 -bottom-16 h-64 w-64 rounded-full bg-wecci-aqua/20 blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto max-w-3xl px-6">
          <h3 className="text-2xl font-bold sm:text-3xl">บทความเพิ่มเติม</h3>
          <span
            className="mx-auto mt-3 block h-[3px] w-44 bg-gradient-to-r from-wecci-aqua to-wecci-mint"
            aria-hidden
          />
          <p className="mt-4 text-sm text-slate-200 sm:text-base">
            รวมบทความทั้งหมดของสถาบันฯ เลือกดูตามหมวดหมู่ที่สนใจ
          </p>
        </div>
      </section>

      {/* บทความทั้งหมด */}
      <section id="all" key={`all-${category}-${query}`} className="wecci-tab-in">
        <SectionTitle title="บทความทั้งหมด" count={matched.length} />

        {matched.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white/60 p-16 text-center">
            <p className="font-bold text-wecci-navy">ไม่พบบทความที่ค้นหา</p>
            <p className="mt-2 text-sm text-slate-500">ลองเปลี่ยนคำค้นหรือเลือกหมวดหมู่อื่น</p>
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {matched.map((article) => (
              <li key={article.id} className="h-full">
                <ArticleTeaser article={article} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

/** หัวข้อกลางหน้าพร้อมเส้นคาดและจำนวนบทความ */
function SectionTitle({ title, count }: { title: string; count: number }) {
  return (
    <div className="mb-8 text-center">
      <h3 className="text-2xl font-bold text-wecci-navy">{title}</h3>
      <span
        className="mx-auto mt-3 block h-[3px] w-40 bg-gradient-to-r from-wecci-aqua to-wecci-mint"
        aria-hidden
      />
      <p className="mt-3 text-sm text-slate-500">
        พบ <span className="font-semibold text-wecci-navy">{count}</span> บทความ
      </p>
    </div>
  );
}
