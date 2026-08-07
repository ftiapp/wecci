import Image from "next/image";
import { ContentCarousel } from "@/components/news/ContentCarousel";
import type { ContentBlock } from "@/lib/events/content";

/** เรนเดอร์บล็อกเนื้อหาหนึ่งชิ้น */
export function BlockView({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "heading":
      return <h3 className="text-lg font-bold text-wecci-navy">{block.text}</h3>;

    case "paragraph":
      return (
        <p className="whitespace-pre-wrap leading-relaxed text-slate-700">{block.text}</p>
      );

    case "images":
      return (
        <figure>
          {block.paths.length > 1 ? (
            <ContentCarousel paths={block.paths} alt={block.caption} />
          ) : (
            <div className="relative aspect-16/9 overflow-hidden rounded-2xl bg-slate-100">
              <Image
                src={block.paths[0]}
                alt={block.caption}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
          )}
          {block.caption && (
            <figcaption className="mt-2 text-center text-xs text-slate-400">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "link":
      return (
        <a
          href={block.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 font-semibold text-wecci-blue underline decoration-wecci-aqua underline-offset-4 transition hover:text-wecci-navy"
        >
          {block.label || block.url} ↗
        </a>
      );

    case "divider":
      return <hr className="border-slate-200" />;

    case "spacer":
      return (
        <div
          className={block.size === "sm" ? "h-4" : block.size === "lg" ? "h-16" : "h-9"}
          aria-hidden
        />
      );

    case "table": {
      const [head, ...body] = block.rows;

      return (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-md border-collapse text-sm">
            <thead>
              <tr className="bg-wecci-navy text-white">
                {head.map((cell, index) => (
                  <th key={index} className="px-4 py-2.5 text-left font-semibold">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t border-slate-100 even:bg-slate-50">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-2.5 text-slate-700">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  }
}
