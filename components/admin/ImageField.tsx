"use client";

import Image from "next/image";
import { useRef, useState } from "react";

/**
 * ช่องเลือกรูป — พิมพ์พาธเองก็ได้ หรืออัปโหลดไฟล์ใหม่
 * อัปโหลดแล้วระบบย่อและแปลงเป็น WebP ให้อัตโนมัติ แล้วเติมพาธกลับมาในช่อง
 */
export function ImageField({
  name,
  label,
  help,
  defaultValue,
}: {
  name: string;
  label: string;
  help?: string;
  defaultValue: string;
}) {
  const [path, setPath] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);

    try {
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error ?? "อัปโหลดไม่สำเร็จ");
      setPath(json.path);
    } catch (err) {
      setError(err instanceof Error ? err.message : "อัปโหลดไม่สำเร็จ");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span>

      <div className="flex gap-4">
        {/* ตัวอย่างรูป */}
        <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
          {path ? (
            <Image src={path} alt="" fill sizes="128px" className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-xs text-slate-400">
              ยังไม่มีรูป
            </span>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <input
            name={name}
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="/images/contact/hero.webp"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm outline-none transition focus:border-wecci-blue focus:bg-white focus:ring-2 focus:ring-wecci-blue/20"
          />

          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="rounded-full border border-slate-300 px-4 py-1.5 text-xs font-semibold text-wecci-navy transition hover:border-wecci-blue hover:text-wecci-blue disabled:opacity-60"
            >
              {uploading ? "กำลังอัปโหลด..." : "อัปโหลดรูปใหม่"}
            </button>

            {path && (
              <button
                type="button"
                onClick={() => setPath("")}
                className="text-xs text-slate-400 transition hover:text-rose-600"
              >
                ล้างรูป
              </button>
            )}
          </div>

          {help && <p className="text-xs text-slate-400">{help}</p>}
          {error && <p className="text-xs text-rose-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
