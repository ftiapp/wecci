/**
 * แถบสีรองข้อความบนแบนเนอร์
 *
 * แทนที่จะคลุมเงาทับทั้งภาพจนสีเพี้ยน จะรองสีเฉพาะบริเวณที่มีตัวอักษร
 * แล้วจางหายไปทางขวา ภาพส่วนที่เหลือจึงคงสีจริงไว้ทั้งหมด
 * แถบบานทะลุออกไปชนขอบจอซ้ายเสมอ ไม่ว่า Container จะกว้างเท่าไร
 */
export function HeroPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <div
        className="absolute -bottom-10 -left-[50vw] -top-10 right-[-8%] rounded-r-[2.5rem] bg-gradient-to-r from-wecci-navy/88 via-wecci-navy/78 via-65% to-transparent sm:right-[-14%]"
        aria-hidden
      />
      <div className="relative">{children}</div>
    </div>
  );
}
