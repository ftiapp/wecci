/**
 * ม่านสีเขียวโค้งพาดครึ่งซ้ายของแบนเนอร์
 *
 * ใช้ SVG เพราะขอบโค้งแบบนี้ทำด้วย border-radius ไม่ได้ — ต้องเป็นเส้นโค้งอิสระ
 * preserveAspectRatio="none" ให้ทรงยืดตามกรอบ ไม่ว่าแบนเนอร์จะสูงเท่าไร
 *
 * ซ่อนบนมือถือ เพราะพื้นที่แคบเกินกว่าจะเหลือภาพให้เห็นข้างขวา
 * จอเล็กใช้แถบทึบของ HeroPanel แทน
 */
export function HeroCurtain() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] hidden sm:block" aria-hidden>
      <svg
        className="h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          {/* เฉดเดียวกับแถบเขียวชุดแรก: เขียวเข้ม -> mint -> จางหาย */}
          <linearGradient id="wecci-curtain" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--wecci-forest)" stopOpacity="0.92" />
            <stop offset="72%" stopColor="var(--wecci-mint)" stopOpacity="0.62" />
            <stop offset="100%" stopColor="var(--wecci-mint)" stopOpacity="0.28" />
          </linearGradient>
          <linearGradient id="wecci-curtain-accent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--wecci-mint)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--wecci-mint)" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* ผืนหลัก — ขอบบนลาดขึ้นจากซ้าย แล้วโค้งยาวลงมาจนสุดขอบล่าง */}
        <path
          d="M0 150 C 340 60, 700 8, 1010 0 L1010 0 C 968 300, 946 620, 1002 900 L0 900 Z"
          fill="url(#wecci-curtain)"
        />

        {/* ทรงเล็กมุมบนขวา ถ่วงน้ำหนักให้ผืนใหญ่ไม่หนักไปข้างเดียว */}
        <path
          d="M1180 0 L1440 0 L1440 96 C 1360 132, 1258 140, 1178 122 C 1150 78, 1156 30, 1180 0 Z"
          fill="url(#wecci-curtain-accent)"
        />
      </svg>
    </div>
  );
}
