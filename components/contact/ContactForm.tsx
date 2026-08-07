"use client";

import Image from "next/image";
import { useState } from "react";
import { siteConfig } from "@/lib/site-config";

const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-wecci-blue focus:bg-white focus:ring-2 focus:ring-wecci-blue/20";

/**
 * ฟอร์มติดต่อแบบสองแผง — ซ้ายเป็นแผงสีเข้มแนะนำสถาบัน ขวาเป็นช่องกรอก
 * ส่งข้อมูลไปที่ POST /api/contact แล้วเก็บลงตาราง cms_contact_messages
 */
export function ContactForm({
  panelTitle,
  panelText,
  panelImage,
  consentText,
}: {
  panelTitle: string;
  panelText: string;
  panelImage?: string;
  consentText: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSending(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok) {
        setError(result.error ?? "ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("เชื่อมต่อไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid-cols-2">
      {/* แผงซ้าย — สีแบรนด์ พร้อมภาพจาง ๆ เป็นฉากหลัง */}
      <div className="relative overflow-hidden bg-gradient-to-br from-wecci-navy via-wecci-blue to-wecci-navy p-8 text-white sm:p-10">
        {panelImage && (
          <>
            <Image
              src={panelImage}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover opacity-40 mix-blend-luminosity"
            />
            {/* ไล่สีทับภาพอีกชั้น ให้ตัวอักษรด้านล่างอ่านชัด */}
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-wecci-navy via-wecci-navy/55 to-transparent"
              aria-hidden
            />
          </>
        )}
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border border-white/15"
          aria-hidden
        />
        <div
          className="wecci-float pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-wecci-aqua/20 blur-3xl"
          aria-hidden
        />

        <div className="relative flex h-full flex-col justify-end">
          <span className="block h-1 w-16 rounded-full bg-white/70" aria-hidden />
          <h2 className="mt-6 text-2xl font-bold leading-snug sm:text-3xl">
            {panelTitle}
          </h2>
          <p className="mt-4 leading-relaxed text-slate-200">
            {panelText}
          </p>
        </div>
      </div>

      {/* แผงขวา — ช่องกรอก */}
      <div className="p-8 sm:p-10">
        {submitted ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-wecci-mint/15 text-wecci-mint">
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="m5 13 4 4L19 7" />
              </svg>
            </span>
            <p className="mt-4 text-lg font-bold text-wecci-navy">ได้รับข้อมูลของคุณแล้ว</p>
            <p className="mt-2 text-sm text-slate-600">
              ทีมงานจะติดต่อกลับภายใน 2 วันทำการ
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-6 rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-wecci-navy transition hover:border-wecci-blue hover:text-wecci-blue"
            >
              ส่งข้อมูลอีกครั้ง
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-wecci-navy">กรอกข้อมูล</h3>
              <p className="mt-1 text-sm font-semibold text-wecci-blue">
                เพื่อให้เจ้าหน้าที่ติดต่อกลับ
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <input name="firstName" required placeholder="ชื่อ *" className={fieldClass} />
              <input name="lastName" required placeholder="นามสกุล *" className={fieldClass} />
            </div>

            <input
              type="email"
              name="email"
              required
              placeholder="อีเมล *"
              className={fieldClass}
            />
            <input
              type="tel"
              name="phone"
              required
              placeholder="เบอร์โทรศัพท์ *"
              className={fieldClass}
            />
            <input
              name="subject"
              required
              placeholder="หัวเรื่องที่ติดต่อ *"
              className={fieldClass}
            />
            <textarea
              name="message"
              required
              rows={4}
              placeholder="ข้อความ / รายละเอียด *"
              className={fieldClass}
            />

            <label className="flex items-start gap-3 text-sm text-slate-600">
              <input
                type="checkbox"
                name="consent"
                required
                className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-wecci-blue focus:ring-wecci-blue/30"
              />
              <span>
                ข้าพเจ้ายินยอมให้สถาบันฯ เก็บและใช้ข้อมูลเพื่อการติดต่อกลับและปรับปรุงบริการ
              </span>
            </label>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-wecci-navy to-wecci-blue px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-wecci-blue/25 transition hover:gap-3 hover:from-wecci-blue hover:to-wecci-aqua disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending ? "กำลังส่ง..." : "ส่งข้อมูล"}
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
                <path d="m22 2-7 20-4-9-9-4 20-7Z" />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
