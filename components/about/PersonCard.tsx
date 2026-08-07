import Image from "next/image";

export type Person = {
  name: string;
  position: string;
  org?: string;
  /** รูปบุคคล วางไฟล์ที่ public/images/people/ (แนะนำสี่เหลี่ยมจัตุรัส 600x600) */
  photo?: string;
};

/** การ์ดบุคลากร — เรียบ ไม่มีแอนิเมชัน รอใส่รูปจริง */
export function PersonCard({ person }: { person: Person }) {
  return (
    <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 text-center">
      <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full bg-slate-100">
        {person.photo ? (
          <Image
            src={person.photo}
            alt={person.name}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          /* ที่ว่างรอรูปจริง */
          <span className="flex h-full w-full items-center justify-center text-slate-300">
            <svg viewBox="0 0 24 24" className="h-11 w-11" fill="currentColor" aria-hidden>
              <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4 0-7 2.2-7 5v2h14v-2c0-2.8-3-5-7-5Z" />
            </svg>
          </span>
        )}
      </div>

      <p className="mt-4 font-bold text-wecci-navy">{person.name}</p>
      <p className="mt-1 text-sm text-slate-600">{person.position}</p>
      {person.org && <p className="mt-1 text-xs text-slate-400">{person.org}</p>}
    </div>
  );
}
