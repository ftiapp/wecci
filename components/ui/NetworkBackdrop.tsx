/**
 * ฉากหลังธีมเครือข่าย/โลกออนไลน์ — เส้นละติจูด-ลองจิจูดของลูกโลก
 * กับจุดโหนดที่เชื่อมถึงกัน สื่อถึงการเชื่อมโยงเป็นเครือข่าย
 * เป็น SVG นิ่ง ไม่มีแอนิเมชัน
 */

const nodes = [
  { x: 180, y: 210 },
  { x: 360, y: 130 },
  { x: 520, y: 260 },
  { x: 700, y: 90 },
  { x: 860, y: 230 },
  { x: 1040, y: 140 },
  { x: 1200, y: 280 },
  { x: 1340, y: 120 },
];

/** เชื่อมเฉพาะโหนดที่อยู่ติดกันและข้ามหนึ่งช่วง ให้เห็นเป็นตาข่ายไม่รก */
const links = nodes.flatMap((node, i) =>
  [nodes[i + 1], nodes[i + 2]]
    .filter(Boolean)
    .map((target) => ({ from: node, to: target, key: `${i}-${target.x}` })),
);

export function NetworkBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <svg
        viewBox="0 0 1440 400"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full text-wecci-blue"
      >
        {/* เส้นโครงลูกโลก — วงกลมนอกกับเส้นเมริเดียน */}
        <g stroke="currentColor" fill="none" opacity="0.12">
          <circle cx="1150" cy="200" r="240" strokeWidth="1" />
          <ellipse cx="1150" cy="200" rx="90" ry="240" strokeWidth="1" />
          <ellipse cx="1150" cy="200" rx="170" ry="240" strokeWidth="1" />
          <line x1="910" y1="200" x2="1390" y2="200" strokeWidth="1" />
          <ellipse cx="1150" cy="200" rx="240" ry="90" strokeWidth="1" />
          <ellipse cx="1150" cy="200" rx="240" ry="170" strokeWidth="1" />
        </g>

        <g stroke="currentColor" fill="none" opacity="0.1">
          <circle cx="180" cy="320" r="150" strokeWidth="1" />
          <ellipse cx="180" cy="320" rx="60" ry="150" strokeWidth="1" />
        </g>

        {/* เส้นเชื่อมระหว่างโหนด */}
        <g stroke="currentColor" strokeWidth="1" opacity="0.14">
          {links.map((link) => (
            <line
              key={link.key}
              x1={link.from.x}
              y1={link.from.y}
              x2={link.to.x}
              y2={link.to.y}
            />
          ))}
        </g>

        {/* จุดโหนด */}
        <g fill="currentColor">
          {nodes.map((node) => (
            <g key={`${node.x}-${node.y}`}>
              <circle cx={node.x} cy={node.y} r="9" opacity="0.08" />
              <circle cx={node.x} cy={node.y} r="3.5" opacity="0.3" />
            </g>
          ))}
        </g>
      </svg>

      {/* ไล่ขาวจากกลางออก ให้ตัวหนังสือกลางจอยังอ่านชัด */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 45%, rgba(255,255,255,.92) 35%, rgba(255,255,255,0) 80%)",
        }}
      />
    </div>
  );
}
