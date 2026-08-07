/** ก้อนเมฆส่วนบน กำหนดตำแหน่งและจังหวะตายตัว ไม่สุ่ม เพื่อให้เรนเดอร์สองฝั่งตรงกัน */
const clouds = [
  { top: "6%", width: 230, opacity: 0.95, duration: "90s", delay: "0s" },
  { top: "20%", width: 150, opacity: 0.8, duration: "130s", delay: "-40s" },
  { top: "3%", width: 290, opacity: 0.7, duration: "160s", delay: "-90s" },
  { top: "32%", width: 110, opacity: 0.65, duration: "110s", delay: "-20s" },
  { top: "14%", width: 180, opacity: 0.55, duration: "145s", delay: "-115s" },
  { top: "27%", width: 120, opacity: 0.5, duration: "175s", delay: "-60s" },
];

/**
 * พื้นหลังกังหันลม — เมฆลอยด้านบน กังหันหมุนด้านล่าง
 * เสาขนาดต่างกัน ใบพัดหมุนช้า ๆ ไม่รบกวนการอ่าน
 * ทุกอย่างเป็น SVG กับ CSS ล้วน ไม่มีสคริปต์ จึงเบาและใช้ในเซิร์ฟเวอร์คอมโพเนนต์ได้
 */
export type WindmillVariant = 1 | 2 | 3 | 4;

export function WindmillBackdrop({
  tone = "light",
  variant = 1,
  tall = false,
}: {
  tone?: "light" | "dark";
  /** สลับองค์ประกอบฉากหน้า เพื่อไม่ให้แบนด์ที่ต่อกันดูซ้ำ */
  variant?: WindmillVariant;
  /** สำหรับแบนด์สูง ๆ — กระจายเมฆและแสงให้ทั่วทั้งความสูง ไม่กระจุกแค่ด้านบน */
  tall?: boolean;
}) {
  const isDark = tone === "dark";
  // แบนด์สูง ๆ ใช้ชุดเมฆที่กระจายลงมาถึงกลางจอ ไม่ให้ช่วงกลางว่างเปล่า
  const sky = tall
    ? [
        ...clouds,
        { top: "38%", width: 200, opacity: 0.8, duration: "120s", delay: "-30s" },
        { top: "45%", width: 130, opacity: 0.6, duration: "165s", delay: "-100s" },
        { top: "52%", width: 260, opacity: 0.7, duration: "140s", delay: "-70s" },
        { top: "59%", width: 140, opacity: 0.5, duration: "185s", delay: "-10s" },
        { top: "66%", width: 210, opacity: 0.6, duration: "128s", delay: "-55s" },
        { top: "74%", width: 120, opacity: 0.45, duration: "155s", delay: "-135s" },
        { top: "81%", width: 240, opacity: 0.5, duration: "170s", delay: "-25s" },
        { top: "88%", width: 150, opacity: 0.4, duration: "195s", delay: "-85s" },
      ]
    : clouds;

  // ฝูงนกเล็ก ๆ กระจายตามความสูง ให้ท้องฟ้าไม่ว่าง
  const birds = tall
    ? [
        { top: "30%", left: "18%", width: 46, opacity: 0.35 },
        { top: "44%", left: "76%", width: 60, opacity: 0.3 },
        { top: "57%", left: "34%", width: 38, opacity: 0.28 },
        { top: "70%", left: "64%", width: 52, opacity: 0.3 },
        { top: "84%", left: "22%", width: 40, opacity: 0.25 },
      ]
    : [];
  const stroke = isDark ? "rgba(255,255,255,0.5)" : "rgba(34,62,153,0.3)";
  const blade = isDark ? "rgba(0,175,225,0.7)" : "rgba(22,104,189,0.4)";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* ก้อนแสงนุ่ม ๆ ให้พื้นหลังไม่แบน */}
      <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-wecci-aqua/10 blur-3xl" />
      <div className="absolute -bottom-48 -right-32 h-[32rem] w-[32rem] rounded-full bg-wecci-blue/10 blur-3xl" />

      {/* แสงเสริมช่วงกลาง สำหรับแบนด์ที่สูงมาก */}
      {tall && (
        <>
          <div className="absolute top-[30%] -left-32 h-[26rem] w-[26rem] rounded-full bg-wecci-mint/10 blur-3xl" />
          <div className="absolute top-[48%] -right-40 h-[30rem] w-[30rem] rounded-full bg-wecci-aqua/10 blur-3xl" />
          <div className="absolute top-[66%] -left-40 h-[30rem] w-[30rem] rounded-full bg-wecci-blue/10 blur-3xl" />
          <div className="absolute top-[82%] right-[-8rem] h-[26rem] w-[26rem] rounded-full bg-wecci-mint/10 blur-3xl" />

          {/* ลายจุดจาง ๆ คลุมทั้งพื้นที่ ให้พื้นหลังมีเนื้อ ไม่เรียบโล่ง */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(rgba(34,62,153,0.16) 1.3px, transparent 1.3px)",
              backgroundSize: "24px 24px",
              maskImage:
                "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
            }}
          />
        </>
      )}

      {/* ดวงอาทิตย์ — วงกลมนวลซ้อนแสงฟุ้ง เห็นชัดขึ้นในโทนสว่าง */}
      <div
        className={`absolute right-[12%] top-10 h-52 w-52 rounded-full blur-3xl ${
          isDark ? "bg-wecci-aqua/20" : "bg-amber-200/50"
        }`}
      />
      {!isDark && (
        <>
          <div className="absolute right-[16%] top-16 h-24 w-24 rounded-full bg-amber-100/70 blur-xl" />
          <div className="absolute right-[18%] top-20 h-14 w-14 rounded-full bg-amber-50" />
        </>
      )}

      {/* ก้อนเมฆลอยข้ามจอ คนละความสูงและความเร็ว */}
      {sky.map((cloud) => (
        <svg
          key={cloud.top}
          viewBox="0 0 200 70"
          className="wecci-cloud absolute"
          style={{
            top: cloud.top,
            width: cloud.width,
            opacity: cloud.opacity,
            animationDuration: cloud.duration,
            animationDelay: cloud.delay,
          }}
        >
          <path
            d="M45 60c-14 0-25-9-25-21s11-21 25-21c4-11 15-18 27-18 15 0 28 10 31 24 12 1 22 10 22 21 0 8-7 15-17 15Z"
            fill={isDark ? "rgba(255,255,255,0.16)" : "#ffffff"}
            stroke={isDark ? "none" : "rgba(22,104,189,0.28)"}
            strokeWidth={isDark ? 0 : 1.6}
          />
        </svg>
      ))}

      {/* ฝูงนก — เส้นโค้งคู่แบบเรียบง่าย */}
      {birds.map((bird) => (
        <svg
          key={`${bird.top}-${bird.left}`}
          viewBox="0 0 60 20"
          className="absolute"
          style={{ top: bird.top, left: bird.left, width: bird.width, opacity: bird.opacity }}
          fill="none"
          stroke={isDark ? "rgba(255,255,255,0.6)" : "rgba(34,62,153,0.75)"}
          strokeWidth={1.8}
          strokeLinecap="round"
        >
          <path d="M4 10c3-4 6-4 8 0 2-4 5-4 8 0" />
          <path d="M32 6c2.5-3.5 5-3.5 7 0 2-3.5 4.5-3.5 7 0" />
        </svg>
      ))}

      {/* เส้นขอบฟ้าเมือง ซ่อนอยู่หลังเนินเขา — เฉพาะโทนสว่าง */}
      {!isDark && (
        <svg
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-24 h-32 w-full"
        >
          <g fill="rgba(34,62,153,0.16)">
            <rect x="90" y="96" width="34" height="104" />
            <rect x="132" y="60" width="26" height="140" />
            <rect x="166" y="112" width="40" height="88" />
            <rect x="214" y="78" width="30" height="122" />
            <rect x="252" y="126" width="46" height="74" />
            <rect x="306" y="92" width="28" height="108" />
            <rect x="1042" y="120" width="38" height="80" />
            <rect x="1088" y="84" width="26" height="116" />
            <rect x="1122" y="132" width="44" height="68" />
            <rect x="1174" y="100" width="30" height="100" />
            <rect x="1212" y="70" width="24" height="130" />
            <rect x="1244" y="118" width="40" height="82" />
          </g>
        </svg>
      )}

      {/* เนินเขาซ้อนกันหลายชั้น ให้ระยะลึกแบบภาพวาดพาสเทล */}
      <svg
        viewBox="0 0 1440 240"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-48 w-full"
      >
        {/* ชั้นไกลสุด สีจางที่สุด */}
        <path
          d="M0 150 C 200 110, 400 170, 640 140 C 880 110, 1120 165, 1440 130 L1440 240 L0 240 Z"
          fill={isDark ? "rgba(255,255,255,0.03)" : "rgba(0,175,225,0.16)"}
        />
        {/* ชั้นกลาง */}
        <path
          d="M0 185 C 240 140, 420 215, 720 178 C 1020 140, 1220 210, 1440 168 L1440 240 L0 240 Z"
          fill={isDark ? "rgba(255,255,255,0.04)" : "rgba(34,179,76,0.22)"}
        />
        {/* ชั้นหน้าสุด เข้มสุด */}
        <path
          d="M0 215 C 300 190, 560 228, 860 208 C 1120 190, 1280 222, 1440 205 L1440 240 L0 240 Z"
          fill={isDark ? "rgba(255,255,255,0.05)" : "rgba(34,179,76,0.34)"}
        />
      </svg>

      {/* สายน้ำคดเคี้ยวตัดผ่านเนิน — เฉพาะโทนสว่าง */}
      {!isDark && (
        <svg
          viewBox="0 0 1440 240"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-0 h-48 w-full"
        >
          <path
            d="M690 240 C 700 200, 660 180, 672 150 C 682 126, 716 120, 726 150 C 738 184, 760 205, 790 240 Z"
            fill="rgba(0,175,225,0.3)"
          />
        </svg>
      )}

      {/* ฉากหน้า — สลับตาม variant ให้แต่ละแบนด์ไม่ซ้ำกัน */}
      {variant === 1 && (
        <>
          <Windmill className="absolute bottom-16 left-[6%] w-40 opacity-70" stroke={stroke} blade={blade} speed="18s" />
          <Windmill className="absolute bottom-24 left-[24%] w-24 opacity-50" stroke={stroke} blade={blade} speed="26s" reverse />
          <Windmill className="absolute bottom-12 right-[8%] w-52 opacity-60" stroke={stroke} blade={blade} speed="22s" />
          <Windmill className="absolute bottom-28 right-[28%] w-28 opacity-40" stroke={stroke} blade={blade} speed="30s" reverse />
        </>
      )}

      {variant === 2 && (
        <>
          <SolarRow className="absolute bottom-10 left-[8%] w-72 opacity-70" tint={blade} />
          <Windmill className="absolute bottom-14 right-[12%] w-44 opacity-65" stroke={stroke} blade={blade} speed="20s" />
          <Windmill className="absolute bottom-24 right-[30%] w-24 opacity-45" stroke={stroke} blade={blade} speed="28s" reverse />
          <Trees className="absolute bottom-12 left-[42%] w-40 opacity-55" tint={stroke} />
        </>
      )}

      {variant === 3 && (
        <>
          <Trees className="absolute bottom-10 left-[5%] w-52 opacity-60" tint={stroke} />
          <Windmill className="absolute bottom-16 left-[34%] w-28 opacity-45" stroke={stroke} blade={blade} speed="24s" />
          <SolarRow className="absolute bottom-12 right-[10%] w-64 opacity-60" tint={blade} />
        </>
      )}

      {variant === 4 && (
        <>
          <Windmill className="absolute bottom-14 left-[12%] w-48 opacity-65" stroke={stroke} blade={blade} speed="21s" reverse />
          <Trees className="absolute bottom-10 right-[8%] w-64 opacity-60" tint={stroke} />
          <Windmill className="absolute bottom-26 right-[34%] w-20 opacity-40" stroke={stroke} blade={blade} speed="32s" />
        </>
      )}
    </div>
  );
}

/** กังหันหนึ่งต้น — เสา + ดุม + ใบพัดสามใบที่หมุนรอบดุม */
function Windmill({
  className,
  stroke,
  blade,
  speed,
  reverse = false,
}: {
  className: string;
  stroke: string;
  blade: string;
  /** เวลาในการหมุนครบหนึ่งรอบ ยิ่งมากยิ่งช้า */
  speed: string;
  reverse?: boolean;
}) {
  return (
    <svg viewBox="0 0 100 160" className={className}>
      {/* เสา */}
      <path d="M48.6 150 L50 52 L51.4 150 Z" fill={stroke} />

      {/* ใบพัด — หมุนรอบจุดดุมที่ (50,50) */}
      <g
        className="wecci-spin"
        style={{
          transformOrigin: "50px 50px",
          animationDuration: speed,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {[0, 120, 240].map((angle) => (
          <path
            key={angle}
            d="M50 50 L47.5 12 Q50 6 52.5 12 Z"
            fill={blade}
            transform={`rotate(${angle} 50 50)`}
          />
        ))}
      </g>

      {/* ดุมกลาง */}
      <circle cx="50" cy="50" r="3.4" fill={stroke} />
    </svg>
  );
}

/** แผงโซลาร์เรียงกันแบบมองเฉียง */
function SolarRow({ className, tint }: { className: string; tint: string }) {
  return (
    <svg viewBox="0 0 240 90" className={className}>
      {[0, 58, 116, 174].map((x) => (
        <g key={x} fill={tint}>
          <path d={`M${x + 6} 62 L${x + 20} 30 L${x + 56} 30 L${x + 42} 62 Z`} />
          <rect x={x + 22} y="62" width="3" height="16" />
          <rect x={x + 36} y="62" width="3" height="16" />
        </g>
      ))}
    </svg>
  );
}

/** แนวต้นไม้ ทรงกลมสามต้นสูงต่ำสลับกัน */
function Trees({ className, tint }: { className: string; tint: string }) {
  const trees = [
    { x: 20, y: 52, r: 20 },
    { x: 68, y: 40, r: 26 },
    { x: 120, y: 56, r: 17 },
    { x: 158, y: 46, r: 22 },
  ];

  return (
    <svg viewBox="0 0 190 100" className={className}>
      {trees.map((tree) => (
        <g key={tree.x} fill={tint}>
          <circle cx={tree.x} cy={tree.y} r={tree.r} />
          <rect x={tree.x - 2} y={tree.y} width="4" height={96 - tree.y} />
        </g>
      ))}
    </svg>
  );
}
