/** ป้ายตัวเลขสีแดงแบบไอคอนแอปบนมือถือ — ไม่แสดงอะไรเลยถ้าอ่านครบแล้ว */
export function UnreadBadge({
  count,
  size = "sm",
}: {
  count: number;
  size?: "sm" | "lg";
}) {
  if (count <= 0) return null;

  const label = count > 99 ? "99+" : String(count);

  return (
    <span
      className={
        size === "lg"
          ? "inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-red-500 px-2 text-sm font-bold text-white shadow-md shadow-red-500/30"
          : "inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white"
      }
      aria-label={`ยังไม่อ่าน ${count} ข้อความ`}
    >
      {label}
    </span>
  );
}
