"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ScrollHint } from "@/components/news/ScrollHint";
import { knowledgeKinds, kindLabel } from "@/lib/knowledge/kinds";

export type KnowledgeCard = {
  id: number;
  title: string;
  description: string | null;
  kind: string;
  url: string | null;
  featured: boolean;
  /** ภาพปกที่คำนวณมาแล้วจากฝั่งเซิร์ฟเวอร์ */
  cover: string | null;
};

/** รายการองค์ความรู้พร้อมช่องค้นหาและตัวกรองประเภท */
export function KnowledgeGrid({
  items,
  showSearch = true,
}: {
  items: KnowledgeCard[];
  /** ปิดแถบค้นหาเมื่อเอาไปวางเป็นเซกชันย่อยในหน้ารวม */
  showSearch?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<string>("all");

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return items.filter((item) => {
      if (kind !== "all" && item.kind !== kind) return false;
      if (!keyword) return true;

      return [item.title, item.description ?? ""].some((field) =>
        field.toLowerCase().includes(keyword),
      );
    });
  }, [items, query, kind]);

  // แสดงเฉพาะประเภทที่มีเนื้อหาจริง จะได้ไม่มีปุ่มที่กดแล้วว่างเปล่า
  const availableKinds = knowledgeKinds.filter((option) =>
    items.some((item) => item.kind === option.value),
  );

  const featuredAll = filtered.filter((item) => item.featured);
  // โชว์ไฮไลท์แค่ 6 อันแรก ที่เหลือไปดูต่อในส่วนทั้งหมด
  const featured = featuredAll.slice(0, 6);

  return (
    <div>
      {/* แถบค้นหา — คาดเต็มความกว้างจอ ทะลุขอบคอนเทนเนอร์ออกไปทั้งสองด้าน */}
      {showSearch && (
      <section className="relative left-1/2 mb-10 w-screen -translate-x-1/2 overflow-hidden bg-gradient-to-br from-wecci-navy via-wecci-blue to-wecci-navy py-14 text-center text-white">
        <div
          className="wecci-float pointer-events-none absolute -right-24 -top-20 h-72 w-72 rounded-full bg-wecci-aqua/25 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full border border-white/10"
          aria-hidden
        />

        <div className="relative mx-auto max-w-3xl px-6">
          <h2 className="text-2xl font-bold sm:text-3xl">ค้นหาองค์ความรู้</h2>
          <span
            className="mx-auto mt-3 block h-[3px] w-44 bg-gradient-to-r from-wecci-aqua to-wecci-mint"
            aria-hidden
          />

          <p className="mt-5 text-sm text-slate-200 sm:text-base">
            ค้นหาเอกสาร คู่มือ และวีดีโอที่คุณสนใจ พิมพ์คำค้น หรือเลือกกรองตามประเภท
          </p>

          <div className="relative mt-7">
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
              placeholder="ค้นหาองค์ความรู้... / Search knowledge..."
              aria-label="ค้นหาองค์ความรู้"
              className="w-full rounded-full bg-white py-4 pl-14 pr-12 text-sm text-slate-700 shadow-2xl outline-none placeholder:text-slate-400"
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="ล้างคำค้นหา"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  aria-hidden
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>
      )}

      {/* ตัวกรองประเภทและจำนวนผลลัพธ์ */}
      {showSearch && (
      <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold text-slate-400">กรองตาม</span>

            <FilterChip active={kind === "all"} onClick={() => setKind("all")}>
              ทั้งหมด
              <span className="ml-1.5 text-xs opacity-60">{items.length}</span>
            </FilterChip>

            {availableKinds.map((option) => (
              <FilterChip
                key={option.value}
                active={kind === option.value}
                onClick={() => setKind(option.value)}
              >
                {option.label}
                <span className="ml-1.5 text-xs opacity-60">
                  {items.filter((item) => item.kind === option.value).length}
                </span>
              </FilterChip>
            ))}

            <span className="ml-auto text-xs text-slate-400">
              พบ <span className="font-semibold text-wecci-navy">{filtered.length}</span> จาก{" "}
              {items.length} รายการ
            </span>
          </div>
      </div>
      )}

      {/* องค์ความรู้ไฮไลท์ */}
      {showSearch && featuredAll.length > 0 && (
        <section id="featured" key={`featured-${kind}-${query}`} className="wecci-tab-in">
          <SectionTitle title="องค์ความรู้ไฮไลท์" count={featuredAll.length} />

          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((item) => (
              <li key={item.id} className="h-full">
                <Card item={item} />
              </li>
            ))}
          </ul>

          <ScrollHint href="#all">เลื่อนลงเพื่อดูองค์ความรู้ทั้งหมด</ScrollHint>
        </section>
      )}

      {/* แถบคั่นก่อนเข้าส่วนรายการทั้งหมด */}
      {showSearch && featuredAll.length > 0 && (
        <section className="relative left-1/2 my-12 w-screen -translate-x-1/2 overflow-hidden bg-gradient-to-br from-wecci-navy via-wecci-blue to-wecci-navy py-12 text-center text-white">
          <div
            className="wecci-float pointer-events-none absolute -left-20 -bottom-16 h-64 w-64 rounded-full bg-wecci-aqua/20 blur-3xl"
            aria-hidden
          />

          <div className="relative mx-auto max-w-3xl px-6">
            <h3 className="text-2xl font-bold sm:text-3xl">องค์ความรู้เพิ่มเติม</h3>
            <span
              className="mx-auto mt-3 block h-[3px] w-44 bg-gradient-to-r from-wecci-aqua to-wecci-mint"
              aria-hidden
            />
            <p className="mt-4 text-sm text-slate-200 sm:text-base">
              รวมเอกสาร คู่มือ และวีดีโอทั้งหมดของสถาบันฯ เลือกดูตามประเภทที่สนใจ
            </p>
          </div>
        </section>
      )}

      {/* รายการทั้งหมด */}
      <section id="all" key={`all-${kind}-${query}`} className="wecci-tab-in">
        {showSearch && featuredAll.length > 0 && (
          <SectionTitle title="องค์ความรู้ทั้งหมด" count={filtered.length} />
        )}

        {filtered.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white/60 p-16 text-center">
            <p className="font-bold text-wecci-navy">ไม่พบเนื้อหาที่ค้นหา</p>
            <p className="mt-2 text-sm text-slate-500">ลองเปลี่ยนคำค้นหรือเลือกประเภทอื่น</p>
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <li key={item.id} className="h-full">
                <Card item={item} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
        active
          ? "bg-gradient-to-r from-wecci-navy to-wecci-blue text-white shadow-md shadow-wecci-blue/20"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-wecci-navy"
      }`}
    >
      {children}
    </button>
  );
}

function Card({ item }: { item: KnowledgeCard }) {
  const isVideo = item.kind === "video";

  const inner = (
    <>
      <div className="relative aspect-16/9 overflow-hidden bg-gradient-to-br from-wecci-navy to-wecci-aqua">
        {item.cover ? (
          <Image
            src={item.cover}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            // ภาพปกจาก YouTube เป็นโดเมนภายนอก ไม่ต้องผ่านตัวปรับขนาดของ Next
            unoptimized={item.cover.startsWith("http")}
          />
        ) : (
          <span className="flex h-full items-center justify-center text-white/40">
            <svg
              viewBox="0 0 24 24"
              className="h-10 w-10"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.4}
              aria-hidden
            >
              <path d="M4 5h16v14H4zM9 9l6 3-6 3z" strokeLinejoin="round" />
            </svg>
          </span>
        )}

        {isVideo && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-wecci-navy shadow-lg transition group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        )}

        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
          {kindLabel(item.kind)}
        </span>

        {/* ป้ายไฮไลท์มุมขวาบน ทำให้แยกออกจากรายการทั่วไปได้แม้อยู่ในแท็บเดียวกัน */}
        {item.featured && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-amber-950 shadow">
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden>
              <path d="m12 2 2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8Z" />
            </svg>
            ไฮไลท์
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-bold leading-snug text-wecci-navy group-hover:text-wecci-blue">
          {item.title}
        </p>
        {item.description && (
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
            {item.description}
          </p>
        )}
      </div>
    </>
  );

  const className =
    "group wecci-shine relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-wecci-aqua hover:shadow-2xl";

  // กดที่การ์ดเข้าหน้ารายละเอียดในเว็บ ไม่กระโดดออกไปลิงก์ภายนอกทันที
  return (
    <Link href={`/news/knowledge/${item.id}`} className={className}>
      {inner}
    </Link>
  );
}

/** หัวข้อกลางหน้าพร้อมเส้นคาดและจำนวนรายการ */
function SectionTitle({ title, count }: { title: string; count: number }) {
  return (
    <div className="mb-8 text-center">
      <h3 className="text-2xl font-bold text-wecci-navy">{title}</h3>
      <span
        className="mx-auto mt-3 block h-[3px] w-40 bg-gradient-to-r from-wecci-aqua to-wecci-mint"
        aria-hidden
      />
      <p className="mt-3 text-sm text-slate-500">
        พบ <span className="font-semibold text-wecci-navy">{count}</span> รายการ
      </p>
    </div>
  );
}
