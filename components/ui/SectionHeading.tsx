import Link from "next/link";

export function SectionHeading({
  eyebrow,
  title,
  description,
  moreHref,
  moreLabel = "ดูทั้งหมด",
  align = "left",
  tone = "light",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  moreHref?: string;
  moreLabel?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
}) {
  const isDark = tone === "dark";

  return (
    <div
      className={`mb-10 flex flex-col gap-4 ${
        align === "center"
          ? "items-center text-center"
          : "sm:flex-row sm:items-end sm:justify-between"
      }`}
    >
      <div className={align === "center" ? "mx-auto max-w-4xl" : "max-w-3xl"}>
        {eyebrow && (
          <p
            className={`mb-2 text-sm font-semibold tracking-wide ${
              isDark ? "text-wecci-aqua" : "text-wecci-blue"
            }`}
          >
            {eyebrow}
          </p>
        )}
        <h2
          className={`text-2xl font-bold tracking-tight sm:text-3xl 2xl:text-4xl ${
            isDark ? "text-white" : "text-wecci-navy"
          }`}
        >
          {title}
        </h2>
        {/* ขีดสองสีใต้หัวข้อ ช่วยแบ่งจังหวะสายตาระหว่างเซกชัน */}
        <span
          className={`mt-4 flex gap-1.5 ${align === "center" ? "justify-center" : ""}`}
          aria-hidden
        >
          <span className="block h-1 w-10 rounded-full bg-wecci-blue" />
          <span className="block h-1 w-5 rounded-full bg-wecci-aqua" />
        </span>
        {description && (
          <p
            className={`mt-3 text-base ${
              isDark ? "text-slate-200" : "text-slate-600"
            }`}
          >
            {description}
          </p>
        )}
      </div>

      {moreHref && (
        <Link
          href={moreHref}
          className={`inline-flex shrink-0 items-center gap-2 text-sm font-semibold transition hover:gap-3 ${
            isDark ? "text-white" : "text-wecci-blue"
          }`}
        >
          {moreLabel}
          <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  );
}
