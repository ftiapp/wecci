export type GraphicVariant = "skyline" | "topo" | "mesh" | "orbit";

/** เส้นโค้งเรืองแสงพาดพื้นหลัง ใช้ร่วมกันหลายลาย */
function GlowCurves({ opacity = 0.5 }: { opacity?: number }) {
  return (
    <g fill="none" stroke="url(#wecci-glow)" strokeWidth="1.5" opacity={opacity}>
      <path d="M-100 520C220 470 380 300 700 250s560 60 900 -30" />
      <path d="M-100 570C240 530 420 360 760 305s540 70 880 -10" />
      <path d="M-100 620C260 590 460 420 820 360s520 80 860 10" />
    </g>
  );
}

/** จุดเรียงเป็นตาราง ใช้ตกแต่งมุมภาพ */
function DotMatrix({
  x,
  y,
  cols = 6,
  rows = 5,
  gap = 16,
}: {
  x: number;
  y: number;
  cols?: number;
  rows?: number;
  gap?: number;
}) {
  return (
    <g fill="currentColor" opacity="0.25">
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((__, c) => (
          <circle key={`${r}-${c}`} cx={x + c * gap} cy={y + r * gap} r="1.6" />
        )),
      )}
    </g>
  );
}

/**
 * ฉากหลังกราฟิกสำหรับแบนด์เนื้อหา
 * ทุกลายเป็น SVG นิ่ง โทนฟ้า-คราม ความทึบต่ำ ไม่รบกวนการอ่าน
 */
export function GraphicBackdrop({ variant }: { variant: GraphicVariant }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <svg
        viewBox="0 0 1440 640"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full text-wecci-blue"
      >
        <defs>
          <linearGradient id="wecci-glow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0e6ba8" stopOpacity="0" />
            <stop offset="45%" stopColor="#17a2b8" stopOpacity=".55" />
            <stop offset="100%" stopColor="#2bb673" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="wecci-city" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0e6ba8" stopOpacity=".22" />
            <stop offset="100%" stopColor="#0e6ba8" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ลายเมือง — ตึกสูงจาง ๆ สองฝั่ง คล้ายภาพอ้างอิง */}
        {variant === "skyline" && (
          <>
            <g fill="url(#wecci-city)">
              {[
                [40, 250, 46, 390],
                [96, 320, 34, 320],
                [140, 210, 40, 430],
                [188, 300, 30, 340],
                [1180, 280, 42, 360],
                [1230, 200, 52, 440],
                [1290, 300, 36, 340],
                [1334, 240, 48, 400],
              ].map(([x, y, w, h]) => (
                <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx="3" />
              ))}
            </g>
            <GlowCurves />
            <DotMatrix x={1260} y={430} />
            <DotMatrix x={70} y={470} cols={5} rows={4} />
          </>
        )}

        {/* เส้นชั้นความสูง — นึกถึงแผนที่ภูมิประเทศและลุ่มน้ำ */}
        {variant === "topo" && (
          <g fill="none" stroke="currentColor" strokeWidth="1" opacity="0.13">
            {Array.from({ length: 9 }).map((_, i) => (
              <path
                key={i}
                d={`M-80 ${180 + i * 46}C260 ${120 + i * 46} 520 ${300 + i * 40} 860 ${
                  240 + i * 44
                }s420 -70 700 -10`}
              />
            ))}
          </g>
        )}

        {/* ตารางเอียง + แสงพาด */}
        {variant === "mesh" && (
          <>
            <g stroke="currentColor" strokeWidth="1" opacity="0.09">
              {Array.from({ length: 24 }).map((_, i) => (
                <line key={`a${i}`} x1={i * 70 - 200} y1="0" x2={i * 70} y2="640" />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <line key={`b${i}`} x1="0" y1={i * 70} x2="1440" y2={i * 70} />
              ))}
            </g>
            <GlowCurves opacity={0.65} />
          </>
        )}

        {/* วงโคจร — วงกลมซ้อนพร้อมจุดบนเส้น */}
        {variant === "orbit" && (
          <>
            <g fill="none" stroke="currentColor" opacity="0.14">
              {[120, 200, 280, 360].map((r) => (
                <circle key={r} cx="1180" cy="320" r={r} strokeWidth="1" />
              ))}
              {[90, 160, 230].map((r) => (
                <circle key={`s${r}`} cx="180" cy="180" r={r} strokeWidth="1" />
              ))}
            </g>
            <g fill="currentColor" opacity="0.35">
              <circle cx="1180" cy="200" r="4" />
              <circle cx="1460" cy="320" r="4" />
              <circle cx="1020" cy="480" r="4" />
              <circle cx="180" cy="20" r="4" />
              <circle cx="410" cy="180" r="4" />
            </g>
            <DotMatrix x={620} y={520} cols={8} rows={3} gap={18} />
          </>
        )}
      </svg>
    </div>
  );
}
