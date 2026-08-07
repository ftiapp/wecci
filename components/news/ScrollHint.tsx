/** คำชวนให้เลื่อนลงไปดูรายการทั้งหมด กดแล้วเด้งไปยังเซกชันที่อ้างถึง */
export function ScrollHint({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <div className="mt-10 text-center">
      <a
        href={href}
        className="group inline-flex flex-col items-center gap-2 text-sm font-semibold text-wecci-navy transition hover:text-wecci-blue"
      >
        {children}
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 transition group-hover:translate-y-1"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </a>
    </div>
  );
}
