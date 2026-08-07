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
      {/*
        มือถือ: ข้อความกินเต็มความกว้าง ถ้าไล่จางไปทางขวาตัวอักษรฝั่งขวาจะลอยอยู่บนภาพจนอ่านไม่ออก
        จึงใช้แถบทึบพาดเต็มจอแทน แล้วค่อยเปลี่ยนเป็นแบบไล่จางตั้งแต่ sm ขึ้นไปที่ข้อความไม่เต็มจอแล้ว
      */}
      <div
        className="absolute -bottom-6 -left-[50vw] -right-[50vw] -top-6 bg-wecci-forest/88 sm:-bottom-10 sm:-top-10 sm:right-[-14%] sm:rounded-r-[2.5rem] sm:bg-gradient-to-r sm:from-wecci-forest/92 sm:via-wecci-blue/62 sm:via-72% sm:to-transparent"
        aria-hidden
      />
      <div className="relative">{children}</div>
    </div>
  );
}
