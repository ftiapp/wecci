"use client";

import Image from "next/image";
import { useState } from "react";
import { withEmphasis } from "@/components/about/emphasis";

type Role = {
  id: string;
  title: string;
  detail: string;
  emphasis: string[];
  /** คำลายน้ำตัวใหญ่ในแผงที่เปิดอยู่ */
  watermark: string;
  /** ภาพประกอบครึ่งซ้ายของแผงที่เปิด (ไม่ใส่ก็ได้ — แผงจะเป็นพื้นขาวล้วน) */
  image?: string;
  imageAlt?: string;
};

/**
 * แผงบทบาทแบบกดเปิดทีละใบ (แนวนอนบนจอกว้าง / แนวตั้งบนจอเล็ก)
 * แผงที่ไม่ได้เปิดจะยุบเหลือแถบชื่อแนวตั้ง คลิกหรือกด Enter เพื่อสลับ
 */
export function RoleAccordion({ roles }: { roles: Role[] }) {
  const [active, setActive] = useState(0);

  return (
    // แผงเรียงชิดกันเป็นก้อนเดียว มุมโค้งอยู่ที่กรอบนอกเท่านั้น
    // สูงเกือบเต็มจอ และดันออกนอกกรอบเนื้อหาเล็กน้อยบนจอกว้าง ให้แผงดูใหญ่สมกับเป็นเนื้อหาหลัก
    <div className="flex flex-col overflow-hidden rounded-2xl shadow-xl shadow-wecci-navy/10 lg:h-[calc(100svh-14rem)] lg:min-h-[30rem] lg:flex-row xl:-mx-8 2xl:-mx-16">
      {roles.map((role, i) => {
        const open = i === active;
        const order = String(i + 1).padStart(2, "0");

        return (
          <button
            key={role.id}
            type="button"
            aria-expanded={open}
            onClick={() => setActive(i)}
            className={`group relative overflow-hidden text-left transition-all duration-700 ease-out ${
              open
                ? "flex-[6] bg-white"
                : "flex-[1] bg-gradient-to-b from-wecci-navy to-wecci-blue text-white hover:from-wecci-blue hover:to-wecci-navy lg:min-w-[7.5rem]"
            } ${i > 0 ? "border-t border-white/15 lg:border-t-0 lg:border-l" : ""}`}
          >
            {/* ภาพประกอบของแผงที่เปิด — กินครึ่งซ้าย แล้วไล่จางเป็นสีขาวก่อนถึงข้อความ */}
            {open && role.image && (
              <span
                className="pointer-events-none absolute inset-y-0 left-0 hidden w-[60%] lg:block"
                aria-hidden
              >
                <Image
                  src={role.image}
                  alt={role.imageAlt ?? ""}
                  fill
                  sizes="(min-width: 1024px) 60vw, 0px"
                  className="object-cover"
                />
                {/* ไล่จางเป็นขาวเร็วขึ้นตั้งแต่กลางภาพ ข้อความฝั่งขวาจึงไม่ทับภาพ */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 via-60% to-white" />
              </span>
            )}

            <span className="relative flex h-full w-full items-stretch">
              {/*
                แถบชื่อแนวตั้งอยู่ติดขอบซ้ายเสมอ ทั้งตอนยุบและตอนเปิด
                (เป็นคอลัมน์แยก ไม่ได้วางทับเนื้อหา จึงไม่มีตัวอักษรซ้อนกัน)
              */}
              <span
                className={`flex shrink-0 items-center gap-3 p-5 lg:h-full lg:w-[6.5rem] lg:items-center lg:justify-center lg:p-0 lg:py-6 ${
                  open
                    ? role.image
                      ? // ภาพแสดงเฉพาะจอ lg ขึ้นไป จอเล็กจึงต้องเป็นตัวเข้มบนพื้นขาว
                        "text-wecci-navy lg:text-white lg:[text-shadow:0_2px_6px_rgba(0,0,0,0.5)]"
                      : "text-wecci-navy"
                    : "text-white"
                }`}
              >
                {/* จอกว้าง: เลขกับชื่ออยู่ในบรรทัดแนวตั้งเดียวกัน อ่านจากล่างขึ้นบน */}
                {/* ตัวหนังสือใหญ่เกือบเต็มความสูงแผง */}
                <span className="flex items-center gap-5 lg:h-full lg:justify-center lg:rotate-180 lg:[writing-mode:vertical-rl]">
                  <span
                    className={`text-3xl font-bold lg:text-5xl ${
                      open
                        ? role.image
                          ? "text-wecci-aqua lg:text-white/70"
                          : "text-wecci-aqua"
                        : "text-white/50"
                    }`}
                  >
                    {order}
                  </span>
                  {/* บังคับบรรทัดเดียว ไม่ให้ชื่อยาว ๆ ตัดเป็นสองบรรทัดจนดูรก */}
                  <span className="text-lg font-bold tracking-wide whitespace-nowrap lg:text-3xl lg:leading-none">
                    {role.title}
                  </span>
                </span>
              </span>

              {open && (
                <span
                  className={`relative flex min-w-0 flex-1 flex-col justify-center py-6 pr-6 pl-1 sm:py-8 sm:pr-10 ${
                    // เว้นที่ให้ภาพครึ่งซ้าย ข้อความจึงเริ่มหลังจุดที่ภาพจางหมดแล้ว
                    role.image ? "lg:ml-[52%]" : ""
                  }`}
                >
                  {/* คำลายน้ำตัวใหญ่ที่มุมล่าง */}
                  {/* คำลายน้ำเป็นตัวโปร่ง เห็นแค่เส้นขอบ */}
                  <span
                    className="pointer-events-none absolute right-4 bottom-0 text-5xl font-bold text-transparent select-none [-webkit-text-stroke:1.5px_rgba(34,62,153,0.18)] sm:text-7xl"
                    aria-hidden
                  >
                    {role.watermark}
                  </span>

                  <span className="relative block max-w-3xl text-lg leading-loose text-slate-600 xl:text-xl xl:leading-loose">
                    {withEmphasis(role.detail, role.emphasis)}
                  </span>
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** โลโก้สถาบันวางคู่กับแผงบทบาท ให้รู้ว่าทุกบทบาทแตกออกมาจากที่เดียวกัน */
export function RoleAccordionBrand({ caption }: { caption: string }) {
  return (
    <div className="mb-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
      <Image
        src="/images/brand/fti-wecci-light.png"
        alt={caption}
        width={340}
        height={175}
        className="h-12 w-auto object-contain sm:h-14"
      />
      <span className="hidden h-10 w-px bg-slate-300 sm:block" aria-hidden />
      <p className="text-sm font-bold text-wecci-navy">{caption}</p>
    </div>
  );
}
