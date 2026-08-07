/** การ์ดเป้าหมาย — มีเลขลายน้ำด้านหลังและแถบสีที่ยืดออกตอนชี้เมาส์ */
export function GoalCard({ index, text }: { index: number; text: string }) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <li className="group relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1.5 hover:border-wecci-aqua hover:shadow-xl">
      {/* แถบสีด้านบน ยืดเต็มความกว้างเมื่อชี้เมาส์ */}
      <span
        className="absolute inset-x-0 top-0 h-1 w-12 bg-gradient-to-r from-wecci-blue to-wecci-aqua transition-all duration-500 group-hover:w-full"
        aria-hidden
      />

      {/* เลขลายน้ำ */}
      <span
        className="pointer-events-none absolute -right-2 -top-4 text-8xl font-bold text-wecci-navy/5 transition-all duration-500 group-hover:text-wecci-aqua/10"
        aria-hidden
      >
        {number}
      </span>

      <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-wecci-sand text-sm font-bold text-wecci-blue transition-colors duration-300 group-hover:bg-wecci-blue group-hover:text-white">
        {number}
      </span>

      <p className="relative mt-4 text-slate-700">{text}</p>
    </li>
  );
}
