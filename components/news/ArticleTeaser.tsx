import Image from "next/image";
import Link from "next/link";

export type ArticleCard = {
  id: number;
  title: string;
  excerpt: string | null;
  category: string;
  image: string | null;
  featured: boolean;
  /** จัดรูปแบบมาจากฝั่งเซิร์ฟเวอร์แล้ว กัน hydration ไม่ตรงกัน */
  dateText: string;
};

/** การ์ดบทความ — ภาพเต็มใบพร้อมชั้นไล่สีทับ ข้อความอยู่ล่างซ้าย */
export function ArticleTeaser({ article }: { article: ArticleCard }) {
  return (
    <Link
      href={`/news/articles/${article.id}`}
      className="group wecci-shine relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-wecci-aqua hover:shadow-2xl"
    >
      <div className="relative aspect-16/9 overflow-hidden bg-gradient-to-br from-wecci-navy to-wecci-aqua">
        {article.image ? (
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
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
              <path d="M4 5h16v14H4zM8 9h8M8 13h5" strokeLinecap="round" />
            </svg>
          </span>
        )}

        {article.featured && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-amber-950 shadow">
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden>
              <path d="m12 2 2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8Z" />
            </svg>
            ไฮไลท์
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-bold text-wecci-aqua">#{article.category}</span>

        <h4 className="mt-2 font-bold leading-snug text-wecci-navy group-hover:text-wecci-blue">
          {article.title}
        </h4>

        {article.excerpt && (
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
            {article.excerpt}
          </p>
        )}

        <span className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-400">
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            aria-hidden
          >
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M8 3v4M16 3v4M3 10h18" />
          </svg>
          {article.dateText}
        </span>
      </div>
    </Link>
  );
}
