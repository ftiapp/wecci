/**
 * ฉากหลังธีมน้ำ — คลื่นซ้อนชั้นเลื่อนคนละความเร็ว ฟองอากาศลอยขึ้น และวงระลอกน้ำ
 * ทั้งหมดเป็น CSS transform ล้วน ไม่มี JavaScript และหยุดเองเมื่อผู้ใช้ตั้งค่าลดการเคลื่อนไหว
 */

const bubbles = [
  { left: "12%", size: 10, delay: 0, duration: 11 },
  { left: "26%", size: 6, delay: 3.5, duration: 9 },
  { left: "48%", size: 13, delay: 1.5, duration: 13 },
  { left: "67%", size: 7, delay: 5, duration: 10 },
  { left: "82%", size: 11, delay: 2.5, duration: 12 },
  { left: "93%", size: 5, delay: 6.5, duration: 9 },
];

/** เส้นคลื่นหนึ่งชั้น กว้างสองเท่าของจอเพื่อให้เลื่อนวนได้ไร้รอยต่อ */
function WaveLayer({
  className,
  duration,
  opacity,
  animated,
}: {
  className: string;
  duration: number;
  opacity: number;
  animated: boolean;
}) {
  return (
    <svg
      viewBox="0 0 2880 160"
      preserveAspectRatio="none"
      className={`absolute bottom-0 left-0 ${animated ? "wecci-wave" : "w-full"} ${className}`}
      style={{ animationDuration: animated ? `${duration}s` : undefined, opacity }}
      aria-hidden
    >
      <path
        d="M0 80c120-34 240-34 360 0s240 34 360 0 240-34 360 0 240 34 360 0 240-34 360 0 240 34 360 0 240-34 360 0 240 34 360 0v80H0V80Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function WaterBackdrop({
  tone = "light",
  animated = true,
}: {
  /** light = ใช้บนพื้นสว่าง, dark = ใช้บนพื้นสีเข้ม */
  tone?: "light" | "dark";
  /** ปิดเมื่ออยากได้คลื่นนิ่ง ๆ ไม่มีฟองและไม่มีระลอกน้ำ */
  animated?: boolean;
}) {
  const waveColor = tone === "dark" ? "text-white" : "text-wecci-blue";
  const bubbleColor = tone === "dark" ? "bg-white/25" : "bg-wecci-aqua/25";
  const rippleColor = tone === "dark" ? "border-white/25" : "border-wecci-aqua/40";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* แสงส่องจากผิวน้ำด้านบน */}
      <div
        className="absolute inset-x-0 top-0 h-2/3"
        style={{
          background:
            tone === "dark"
              ? "radial-gradient(120% 80% at 50% -20%, rgba(255,255,255,.16), transparent 60%)"
              : "radial-gradient(120% 80% at 50% -20%, rgba(23,162,184,.16), transparent 60%)",
        }}
      />

      {animated && (
        <>
          {/* วงระลอกน้ำสองวง */}
          <span
            className={`wecci-ripple absolute left-[14%] top-1/3 h-40 w-40 rounded-full border ${rippleColor}`}
            style={{ animationDuration: "7s" }}
          />
          <span
            className={`wecci-ripple absolute right-[18%] top-1/4 h-56 w-56 rounded-full border ${rippleColor}`}
            style={{ animationDuration: "9s", animationDelay: "2s" }}
          />

          {/* ฟองอากาศ */}
          {bubbles.map((bubble) => (
            <span
              key={bubble.left}
              className={`wecci-bubble absolute bottom-16 rounded-full ${bubbleColor}`}
              style={{
                left: bubble.left,
                height: bubble.size,
                width: bubble.size,
                animationDelay: `${bubble.delay}s`,
                animationDuration: `${bubble.duration}s`,
              }}
            />
          ))}
        </>
      )}

      {/* คลื่นสามชั้น เลื่อนคนละความเร็วให้เกิดมิติ */}
      <div className={`absolute inset-x-0 bottom-0 h-40 ${waveColor}`}>
        <WaveLayer
          className="h-32"
          duration={26}
          opacity={tone === "dark" ? 0.1 : 0.07}
          animated={animated}
        />
        <WaveLayer
          className="h-24"
          duration={18}
          opacity={tone === "dark" ? 0.14 : 0.09}
          animated={animated}
        />
        <WaveLayer
          className="h-16"
          duration={12}
          opacity={tone === "dark" ? 0.18 : 0.11}
          animated={animated}
        />
      </div>
    </div>
  );
}
