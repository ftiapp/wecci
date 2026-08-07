"use client";

import { useEffect, useState } from "react";

const networks = [
  {
    key: "facebook",
    label: "แชร์บน Facebook",
    color: "bg-[#1877f2]",
    href: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    icon: "M13 22v-8h3l1-4h-4V8c0-1 .3-1.7 1.8-1.7H17V2.8C16.4 2.7 15.3 2.6 14 2.6 11.4 2.6 9.6 4.2 9.6 7.1V10H7v4h2.6v8Z",
  },
  {
    key: "x",
    label: "แชร์บน X",
    color: "bg-black",
    href: (url: string, text: string) => `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
    icon: "M3 3h4.5l4.2 5.8L16.8 3H21l-6.9 8.1L21.4 21h-4.6l-4.5-6.2L6.9 21H3l7.3-8.5Z",
  },
  {
    key: "line",
    label: "แชร์บน LINE",
    color: "bg-[#06c755]",
    href: (url: string) => `https://social-plugins.line.me/lineit/share?url=${url}`,
    icon: "M12 3C6.9 3 3 6.4 3 10.6c0 3.7 3.1 6.8 7.3 7.5.3.1.7.2.8.5.1.3 0 .7 0 1l-.1.8c0 .3-.2 1 .9.6 1.1-.5 5.9-3.5 8-6 1.4-1.5 2.1-3.1 2.1-4.4C21 6.4 17.1 3 12 3Z",
  },
  {
    key: "linkedin",
    label: "แชร์บน LinkedIn",
    color: "bg-[#0a66c2]",
    href: (url: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    icon: "M4.5 3a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6ZM3 8.5h3V21H3ZM9 8.5h2.9v1.7h.1c.4-.8 1.4-1.7 3-1.7 3.2 0 3.8 2 3.8 4.7V21h-3v-5.5c0-1.3 0-3-1.9-3-1.8 0-2.1 1.4-2.1 2.9V21H9Z",
  },
] as const;

/** แถบปุ่มแชร์ด้านซ้ายของเนื้อหา — อ่าน URL ปัจจุบันจากเบราว์เซอร์ */
export function ShareRail({ title }: { title: string }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => setUrl(window.location.href), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // เบราว์เซอร์ไม่ให้เข้าถึงคลิปบอร์ด — ไม่ต้องทำอะไร
    }
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    // ตัวนอกสูงเท่าคอลัมน์เนื้อหา ตัวในจึงเลื่อนตามได้แค่ในช่วงเนื้อหา ไม่ล้นขึ้นไปทับแบนเนอร์
    <div className="lg:h-full">
      {/* แคปซูลขาวมีเงา ให้ปุ่มเด่นออกจากพื้นหลัง — เว้นจากเฮดเดอร์ที่ลอยอยู่ด้วย */}
      <div className="inline-flex flex-row items-center gap-3 rounded-full bg-white px-3 py-3 shadow-[0_8px_30px_rgba(34,62,153,0.14)] ring-1 ring-slate-100 lg:sticky lg:top-40 lg:flex-col">
        <span className="hidden pt-1 text-center text-xs font-semibold text-slate-400 lg:block">
          แชร์
        </span>

        {networks.map((network) => (
          <a
            key={network.key}
            href={network.href(encodedUrl, encodedTitle)}
            target="_blank"
            rel="noreferrer"
            title={network.label}
            aria-label={network.label}
            className={`flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:scale-110 ${network.color}`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
              <path d={network.icon} />
            </svg>
          </a>
        ))}

        <button
          type="button"
          onClick={copy}
          title="คัดลอกลิงก์"
          aria-label="คัดลอกลิงก์"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition hover:scale-110 hover:bg-slate-300"
        >
          {copied ? (
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="m5 13 4 4L19 7" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M9 15 15 9M8 12H6a3 3 0 0 1 0-6h2M16 12h2a3 3 0 0 1 0 6h-2" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
