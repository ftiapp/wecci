import Link from "next/link";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import type { ServiceGroup } from "@/lib/data/services";

/** การ์ดบริการ — ใบที่ตั้ง featured จะยกเด่นขึ้นพร้อมป้ายกำกับ */
export function ServiceCard({ service }: { service: ServiceGroup }) {
  const { featured } = service;

  return (
    <div
      className={`group relative flex h-full flex-col items-center rounded-2xl border bg-white p-6 text-center transition duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
        featured
          ? "border-2 border-wecci-blue shadow-lg"
          : "border-slate-200 hover:border-wecci-aqua"
      }`}
    >
      {featured && service.badge && (
        <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-wecci-navy px-3 py-1 text-xs font-semibold text-white shadow">
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden>
            <path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.2l5.9-.9L12 3Z" />
          </svg>
          {service.badge}
        </span>
      )}

      <span
        className={`flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 ${
          featured
            ? `bg-gradient-to-br ${service.gradient} text-white`
            : "bg-wecci-sand text-wecci-blue"
        }`}
      >
        <ServiceIcon icon={service.icon} className="h-7 w-7" />
      </span>

      <h3
        className={`mt-5 font-bold transition ${
          featured ? "text-wecci-blue" : "text-wecci-navy group-hover:text-wecci-blue"
        }`}
      >
        {service.title}
      </h3>
      <p className="mt-2 flex-1 text-sm text-slate-600">{service.summary}</p>

      <Link
        href={service.href}
        className={`mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition hover:gap-3 ${
          featured
            ? "bg-wecci-blue text-white hover:bg-wecci-navy"
            : "border border-slate-300 text-wecci-navy hover:border-wecci-blue hover:text-wecci-blue"
        }`}
      >
        ดูรายละเอียด
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
