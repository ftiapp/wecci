import Image from "next/image";
import { GrowLine } from "@/components/ui/GrowLine";
import { Reveal } from "@/components/ui/Reveal";

export type OrgPerson = {
  id: number;
  nameTh: string;
  phone: string | null;
  email: string | null;
  photo: string | null;
};

export type OrgLevel = {
  level: string;
  people: OrgPerson[];
};

/**
 * ผังองค์กรแบบบนลงล่าง — ผู้อำนวยการอยู่บนสุด แล้วแตกกิ่งลงมาทีละชั้น
 * เส้นโยงใช้สีเทาอย่างเดียว ไม่ให้แย่งสายตาจากเนื้อหา
 */
export function OrgChart({ levels }: { levels: OrgLevel[] }) {
  const [top, ...rest] = levels;

  return (
    <div className="mx-auto w-full max-w-[1600px] px-2">
      {/* ชั้นบนสุด — การ์ดใหญ่กลางผัง */}
      {top && (
        <div className="flex justify-center">
          <div className="w-[26rem] max-w-full text-center">
            <Reveal>
              <LevelLabel>{top.level}</LevelLabel>
            </Reveal>

            <div className="mt-3 flex flex-wrap justify-center gap-4">
              {top.people.map((person, i) => (
                <Reveal key={person.id} delay={80 + i * 60} className="w-full">
                  <LeadCard person={person} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      )}

      {rest.map((group) => (
        <section key={group.level}>
          {/* ลำต้นจากชั้นบนลงมา — ยืดตัวลงมาเมื่อเลื่อนถึง เหมือนผังกำลังงอกทีละชั้น */}
          <GrowLine className="h-8" spark />

          <Reveal distance={16} fade>
            <div className="flex justify-center">
              <LevelLabel>{group.level}</LevelLabel>
            </div>
          </Reveal>

          {/*
            ไม่มีคานแนวนอนแล้ว — เพราะเมื่อการ์ดตัดบรรทัด CSS ไม่รู้ว่าแถวจบตรงไหน
            คานจึงยื่นเกินเสมอ ใช้ลำต้นกลางเส้นเดียวเชื่อมแต่ละชั้นแทน สะอาดและถูกต้องทุกจำนวนคน
          */}
          <GrowLine className="mt-2 h-6" />

          <div className="mx-auto flex w-fit max-w-full flex-wrap justify-center gap-4">
            {group.people.map((person, i) => (
              // ไล่การ์ดทีละใบจากซ้ายไปขวา หน่วงสูงสุด 240ms กันไม่ให้แถวยาว ๆ รอนาน
              <Reveal
                key={person.id}
                delay={Math.min(i * 90, 360)}
                distance={44}
                fade
                className="w-[18rem] max-w-full"
              >
                <Card person={person} />
              </Reveal>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/** ป้ายชื่อชั้น — ป้ายสีเน้นให้แยกชั้นได้ชัดตั้งแต่ตาแรก */
function LevelLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-flex flex-col items-center">
      {/* เส้นบาง ๆ ทอดออกสองข้างป้าย ให้รู้ว่าเป็นหัวข้อของทั้งชั้น */}
      <span
        className="absolute top-1/2 right-full mr-3 hidden h-px w-16 bg-gradient-to-l from-wecci-aqua/40 to-transparent sm:block"
        aria-hidden
      />
      <span
        className="absolute top-1/2 left-full ml-3 hidden h-px w-16 bg-gradient-to-r from-wecci-aqua/40 to-transparent sm:block"
        aria-hidden
      />

      <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-6 py-2 text-base font-bold text-wecci-navy shadow-sm ring-1 ring-wecci-aqua/30 backdrop-blur">
        <span
          className="h-2 w-2 rounded-full bg-gradient-to-br from-wecci-aqua to-wecci-mint"
          aria-hidden
        />
        {children}
      </span>
      <span
        className="mt-2 block h-[3px] w-12 rounded-full bg-gradient-to-r from-wecci-aqua to-wecci-mint"
        aria-hidden
      />
    </span>
  );
}

/** การ์ดผู้อำนวยการ — ใหญ่ เด่น และเป็นชิ้นเดียวที่ใช้สีเข้ม */
function LeadCard({ person }: { person: OrgPerson }) {
  return (
    <article className="group relative w-full">
      {/* แสงเรืองหลังการ์ด เห็นชัดขึ้นตอนเอาเมาส์ชี้ */}
      <span
        className="absolute -inset-2 rounded-[1.75rem] bg-gradient-to-r from-wecci-aqua/30 to-wecci-mint/30 opacity-0 blur-xl transition duration-500 group-hover:opacity-100"
        aria-hidden
      />

      <div className="wecci-shine relative overflow-hidden rounded-3xl bg-gradient-to-br from-wecci-navy to-wecci-blue p-5 text-center text-white shadow-xl shadow-wecci-navy/25 transition duration-500 group-hover:-translate-y-1">
        <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full ring-4 ring-white/30">
          {person.photo ? (
            <Image
              src={person.photo}
              alt={person.nameTh}
              fill
              sizes="96px"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-white/10 text-white/50">
              <svg viewBox="0 0 24 24" className="h-12 w-12" fill="currentColor" aria-hidden>
                <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4 0-7 2.2-7 5v2h14v-2c0-2.8-3-5-7-5Z" />
              </svg>
            </span>
          )}
        </div>

        <p className="mt-4 text-lg font-bold">{person.nameTh}</p>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm text-slate-200">
          {person.phone && (
            <ContactLine
              href={`tel:${person.phone.replace(/\s|-/g, "")}`}
              icon="M4 5c0 8 7 15 15 15l2-4-5-2-2 2a15 15 0 0 1-6-6l2-2-2-5z"
              tone="light"
            >
              {person.phone}
            </ContactLine>
          )}
          {person.email && (
            <ContactLine
              href={`mailto:${person.email}`}
              icon="M3 6h18v12H3zM3 7l9 6 9-6"
              tone="light"
            >
              {person.email}
            </ContactLine>
          )}
        </div>
      </div>
    </article>
  );
}

/** การ์ดคนทั่วไป — ขาวล้วน ใช้สีเน้นแค่จุดเล็ก ๆ */
function Card({ person }: { person: OrgPerson }) {
  return (
    <article className="wecci-shine group relative flex h-full flex-col items-center overflow-hidden rounded-2xl bg-white p-4 text-center ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-wecci-aqua/60">
      <div className="relative h-16 w-16 overflow-hidden rounded-full bg-slate-100 ring-2 ring-slate-100 transition group-hover:ring-wecci-aqua/40">
        {person.photo ? (
          <Image
            src={person.photo}
            alt={person.nameTh}
            fill
            sizes="64px"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-slate-300">
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor" aria-hidden>
              <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4 0-7 2.2-7 5v2h14v-2c0-2.8-3-5-7-5Z" />
            </svg>
          </span>
        )}
      </div>

      <p className="mt-3 text-sm font-bold text-wecci-navy">{person.nameTh}</p>

      <div className="mt-2 flex w-full items-center justify-center gap-4 text-xs">
        {person.phone && (
          <ContactLine
            href={`tel:${person.phone.replace(/\s|-/g, "")}`}
            icon="M4 5c0 8 7 15 15 15l2-4-5-2-2 2a15 15 0 0 1-6-6l2-2-2-5z"
          >
            {person.phone}
          </ContactLine>
        )}
        {person.email && (
          <ContactLine href={`mailto:${person.email}`} icon="M3 6h18v12H3zM3 7l9 6 9-6">
            {person.email}
          </ContactLine>
        )}
      </div>
    </article>
  );
}

/** บรรทัดช่องทางติดต่อ — ไอคอนนำหน้าแล้วตามด้วยค่าเต็ม */
function ContactLine({
  href,
  icon,
  tone = "dark",
  children,
}: {
  href: string;
  icon: string;
  tone?: "dark" | "light";
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={`flex min-w-0 items-center justify-center gap-1.5 transition ${
        tone === "light" ? "hover:text-white" : "text-slate-500 hover:text-wecci-blue"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-3.5 w-3.5 shrink-0 ${
          tone === "light" ? "text-wecci-aqua" : "text-slate-400"
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d={icon} />
      </svg>
      <span className="truncate">{children}</span>
    </a>
  );
}
