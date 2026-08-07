export type RoleIcon = "target" | "check" | "handshake";

/** เส้น path ของไอคอนแต่ละแบบ วาดเป็นเส้นอย่างเดียวให้เข้ากับโทนของเว็บ */
const icons: Record<RoleIcon, string[]> = {
  target: [
    "M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z",
    "M12 16.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Z",
    "M12 12h.01",
  ],
  check: [
    "M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1Z",
    "M16 6h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h2",
    "M9 13l2 2 4-4",
  ],
  handshake: [
    "M12 7.5 9.8 5.9a2 2 0 0 0-2.4 0L3 9.2",
    "M12 7.5l2.2-1.6a2 2 0 0 1 2.4 0L21 9.2",
    "M3 9.2v5.3l4.6 3.4a2 2 0 0 0 2.5-.1L12 16.2l1.9 1.6a2 2 0 0 0 2.5.1L21 14.5V9.2",
  ],
};

/**
 * แยกข้อความตามวลีที่ต้องการเน้น แล้วห่อวลีนั้นด้วยตัวหนาสีแบรนด์
 * ทำที่ฝั่งเรนเดอร์เพื่อให้ข้อมูลใน lib/data ยังเป็นข้อความล้วน แก้ง่าย
 */
function withEmphasis(text: string, emphasis: string[]) {
  let parts: (string | { mark: string })[] = [text];

  for (const phrase of emphasis) {
    parts = parts.flatMap((part) => {
      if (typeof part !== "string" || !part.includes(phrase)) return [part];

      const [before, ...after] = part.split(phrase);
      return [before, { mark: phrase }, after.join(phrase)];
    });
  }

  return parts
    .filter((part) => part !== "")
    .map((part, i) =>
      typeof part === "string" ? (
        part
      ) : (
        <strong key={i} className="font-bold text-wecci-blue">
          {part.mark}
        </strong>
      ),
    );
}

/** การ์ดบทบาทหน้าที่ — ไอคอนซ้าย เนื้อหาขวา แบบเดียวกับเอกสารนำเสนอของสถาบันฯ */
export function RoleCard({
  role,
}: {
  role: { icon: RoleIcon; title: string; detail: string; emphasis: string[] };
}) {
  return (
    <article className="flex h-full gap-5 rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:border-wecci-aqua hover:shadow-lg sm:p-7">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-wecci-navy to-wecci-blue text-white">
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          {icons[role.icon].map((d) => (
            <path key={d} d={d} />
          ))}
        </svg>
      </span>

      <div>
        <p className="font-bold text-wecci-navy">{role.title}</p>
        <p className="mt-2 leading-loose text-slate-600">
          {withEmphasis(role.detail, role.emphasis)}
        </p>
      </div>
    </article>
  );
}
