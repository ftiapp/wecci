import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

export type BoardMember = {
  id: number;
  level: string;
  nameTh: string;
  position: string | null;
  duty: string | null;
  org: string | null;
  phone: string | null;
  email: string | null;
  photo: string | null;
};

export type BoardGroup = { level: string; people: BoardMember[] };

/**
 * คณะผู้บริหาร — วางแบบหน้าคณะกรรมการของเว็บองค์กร
 *
 * ตั้งใจให้ต่างจากผังบุคลากรในหน้า /about/staff ชัดเจน
 * ผังบุคลากรเป็นการ์ดเล็ก รูปกลม มีเส้นเชื่อมสายบังคับบัญชาและเมฆลอย
 * หน้านี้เป็นรูปใหญ่เต็มแผ่นสี่เหลี่ยมมุมมน ไม่มีเส้นเชื่อม ใช้หัวข้อระดับคั่นเป็นชั้น ๆ แทน
 */
export function ExecutiveBoard({ groups }: { groups: BoardGroup[] }) {
  if (groups.length === 0) return null;

  return (
    <div className="space-y-16">
      {groups.map((group) => (
        <section key={group.level}>
          <LevelHeading>{group.level}</LevelHeading>

          <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {group.people.map((person, i) => (
              <Reveal key={person.id} delay={60 * i} repeat>
                <MemberCard person={person} />
              </Reveal>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/** หัวข้อระดับ — ตัวหนาใหญ่ชิดซ้าย ขนาบด้วยขีดสีแบรนด์หัวท้าย */
function LevelHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 sm:gap-6">
      {/* ขีดตั้งสีแบรนด์หน้าหัวข้อ ทำให้แต่ละชั้นเริ่มต้นชัดเจนโดยไม่ต้องใช้กล่อง */}
      <span
        className="h-9 w-2.5 shrink-0 rounded-full bg-gradient-to-b from-wecci-aqua to-wecci-mint sm:h-11"
        aria-hidden
      />

      <h3 className="text-2xl font-bold text-wecci-navy sm:text-3xl">{children}</h3>

      {/*
        เส้นคาดสีแบรนด์เต็ม ๆ ไม่ใช่เส้นเทาจาง — เข้มที่ต้นเส้นแล้วไล่จางไปทางขวา
        สายตาจึงวิ่งจากหัวข้อไปตามเส้นแล้วไปจบที่ขีดแดง ไม่ใช่เห็นเป็นเส้นแบ่งเฉย ๆ
      */}
      <span
        className="h-1.5 flex-1 rounded-full bg-gradient-to-r from-wecci-aqua via-wecci-aqua/50 to-wecci-aqua/15"
        aria-hidden
      />

      {/* ขีดสั้นสีสามเหลี่ยม ส.อ.ท. ปิดท้ายแถว ถ่วงน้ำหนักกับขีดสีน้ำที่ต้นแถว */}
      <span className="h-2.5 w-14 shrink-0 rounded-full bg-wecci-red" aria-hidden />
    </div>
  );
}

function MemberCard({ person }: { person: BoardMember }) {
  return (
    /* group ให้แผ่นสีกับรูปขยับพร้อมกันตอนชี้ ทั้งใบจึงตอบสนองเป็นชิ้นเดียว */
    <article className="group h-full">
      <Portrait person={person} />

      <div className="mt-5">
        <p className="text-lg font-bold text-wecci-navy transition group-hover:text-wecci-blue">
          {person.nameTh}
        </p>

        {person.position && <p className="mt-1.5 text-sm text-slate-600">{person.position}</p>}

        {person.duty && (
          <p className="mt-1 text-sm leading-relaxed text-wecci-blue">{person.duty}</p>
        )}

        {person.org && <p className="mt-1 text-sm text-slate-500">{person.org}</p>}

        <Contacts person={person} />
        <DownloadPhoto person={person} />
      </div>
    </article>
  );
}

/**
 * แผ่นรูป — แผ่นไล่เฉดสีแบรนด์เป็นพื้น ตัวคนวางทับโดยหัวล้นขึ้นไปเหนือขอบแผ่น
 *
 * ตัวแผ่นเริ่มต่ำกว่าขอบบนของกรอบอยู่ราว 12% ส่วนรูปกินเต็มกรอบ
 * หัวจึงโผล่พ้นแผ่นขึ้นมา ได้มิติกว่าการวางรูปในกรอบสี่เหลี่ยมเฉย ๆ
 *
 * รูปต้องเป็นไฟล์ที่ไดคัตพื้นหลังออกแล้ว (PNG/WebP พื้นโปร่งใส)
 * ถ้าใช้รูปที่ยังมีฉากหลังติดมา จะเห็นเป็นสี่เหลี่ยมทึบลอยอยู่เหนือแผ่นแทน
 *
 * ยังไม่มีรูปจะขึ้นไอคอนกับอักษรย่อกลางแผ่น ไม่ปล่อยเป็นช่องว่างเปล่า
 */
function Portrait({ person }: { person: BoardMember }) {
  return (
    /* ยกทั้งใบขึ้นเล็กน้อยตอนชี้ — บอกว่าเป็นของที่โต้ตอบได้ โดยไม่ต้องใส่ปุ่มหรือกรอบเพิ่ม */
    <div className="relative aspect-4/5 transition-transform duration-300 group-hover:-translate-y-1.5">
      {/* แผ่นสีอยู่ชั้นล่างสุด ขอบบนต่ำกว่ากรอบ เพื่อเปิดที่ให้หัวล้นขึ้นมา */}
      <div
        className="absolute inset-x-0 top-[12%] bottom-0 rounded-3xl bg-gradient-to-b from-wecci-aqua/80 via-wecci-aqua/45 to-wecci-mint/25 shadow-lg shadow-wecci-aqua/15 transition duration-300 group-hover:from-wecci-aqua group-hover:via-wecci-aqua/60 group-hover:shadow-xl group-hover:shadow-wecci-aqua/30"
        aria-hidden
      />

      {person.photo ? (
        /*
          ไฟล์ที่บันทึกผ่านหลังบ้านถูกจัดเป็นผืน 4:5 ตัวคนชิดขอบล่างมาแล้ว
          (ดู lib/executives/normalize-photo.ts) สัดส่วนจึงตรงกับกรอบนี้พอดีทุกใบ
          หัวของทุกคนเลยอยู่แนวเดียวกันโดยไม่ต้องพึ่ง object-fit มาช่วยดัด

          ใช้ contain ชิดล่าง ไม่ใช่ cover เพื่อให้เผื่อกรณีมีไฟล์เก่าที่ยังไม่ผ่านการจัดหลุดมา
          จะได้เห็นตัวคนครบทั้งตัวและยังยืนอยู่บนเส้นเดียวกับคนอื่น แทนที่จะโดนตัดหัว
        */
        <Image
          src={person.photo}
          alt={person.nameTh}
          fill
          sizes="(min-width: 1024px) 30rem, (min-width: 640px) 45vw, 90vw"
          className="relative object-contain object-bottom drop-shadow-lg transition-transform duration-300 group-hover:scale-[1.03]"
        />
      ) : (
        <div
          className="absolute inset-x-0 top-[12%] bottom-0 flex flex-col items-center justify-center gap-3"
          aria-hidden
        >
          <svg
            viewBox="0 0 24 24"
            className="h-16 w-16 text-white/45"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
          </svg>

          <span className="text-3xl font-bold text-white/70">{person.nameTh.slice(0, 1)}</span>
        </div>
      )}
    </div>
  );
}

/**
 * ปุ่มดาวน์โหลดรูป — ผู้บริหารมักถูกขอรูปไปใช้ในสูจิบัตรหรือสื่อประชาสัมพันธ์
 * ให้โหลดจากหน้านี้ได้เลย จะได้ไม่ต้องเมลมาขอทีละครั้ง
 *
 * ชี้ไปที่ไฟล์ต้นฉบับใน public โดยตรง ไม่ผ่านตัวย่อภาพ คนที่โหลดจึงได้ความละเอียดเต็ม
 * attribute download ทำงานได้เพราะเป็นไฟล์โดเมนเดียวกัน
 */
function DownloadPhoto({ person }: { person: BoardMember }) {
  if (!person.photo) return null;

  /* ตั้งชื่อไฟล์ตามชื่อคน คนโหลดจะได้ไม่ต้องมานั่งเดาว่าไฟล์ไหนของใคร */
  const extension = person.photo.split(".").pop() ?? "jpg";
  const filename = `${person.nameTh.replace(/[\\/:*?"<>|]/g, "")}.${extension}`;

  return (
    <a
      href={person.photo}
      download={filename}
      className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-wecci-blue transition hover:text-wecci-aqua"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 3v12M7 11l5 5 5-5M4 20h16" />
      </svg>
      ดาวน์โหลดรูป
    </a>
  );
}

/** เบอร์กับอีเมล — จางกว่าชื่อหลายระดับ มีไว้ให้ติดต่อได้ ไม่ใช่ให้เด่น */
function Contacts({ person }: { person: BoardMember }) {
  if (!person.phone && !person.email) return null;

  return (
    <div className="mt-3 space-y-1 border-t border-slate-100 pt-3 text-xs text-slate-500">
      {person.phone && (
        <p>
          <span className="text-slate-400">โทร </span>
          <a href={`tel:${person.phone.replace(/\s/g, "")}`} className="hover:text-wecci-blue">
            {person.phone}
          </a>
        </p>
      )}

      {person.email && (
        <p className="truncate">
          <a
            href={`mailto:${person.email}`}
            className="hover:text-wecci-blue"
            title={person.email}
          >
            {person.email}
          </a>
        </p>
      )}
    </div>
  );
}
