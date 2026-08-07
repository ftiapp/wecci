"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  blockIcons,
  blockLabels,
  blockOrder,
  emptyBlock,
  type BlockType,
  type ContentBlock,
} from "@/lib/events/content";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 outline-none transition focus:border-wecci-blue focus:ring-2 focus:ring-wecci-blue/20";

/**
 * ตัวแก้ไขเนื้อหาแบบบล็อก — เพิ่ม/ลบ/สลับลำดับได้
 * ค่าทั้งหมดถูกส่งออกเป็น JSON ผ่าน input ซ่อน ชื่อตาม prop name
 */
export function BlockEditor({
  name,
  value,
  onChange,
}: {
  name: string;
  value: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}) {
  function update(index: number, block: ContentBlock) {
    onChange(value.map((item, i) => (i === index ? block : item)));
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= value.length) return;

    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(value)} />

      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
        {value.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-400">
            ยังไม่มีเนื้อหา — กดเพิ่มบล็อกด้านล่าง
          </p>
        ) : (
          <ul className="space-y-3">
            {value.map((block, index) => (
              <li key={index} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 rounded-full bg-wecci-sand px-3 py-0.5 text-xs font-semibold text-wecci-blue">
                    <BlockIcon type={block.type} className="h-3.5 w-3.5" />
                    {blockLabels[block.type]}
                  </span>

                  <div className="flex gap-1">
                    <IconButton label="เลื่อนขึ้น" onClick={() => move(index, -1)}>
                      m18 15-6-6-6 6
                    </IconButton>
                    <IconButton label="เลื่อนลง" onClick={() => move(index, 1)}>
                      m6 9 6 6 6-6
                    </IconButton>
                    <IconButton label="ลบบล็อก" danger onClick={() => remove(index)}>
                      M18 6 6 18M6 6l12 12
                    </IconButton>
                  </div>
                </div>

                <BlockFields block={block} onChange={(next) => update(index, next)} />
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex justify-center">
          <AddBlockMenu onPick={(type) => onChange([...value, emptyBlock(type)])} />
        </div>
      </div>
    </div>
  );
}

/** ปุ่ม "เพิ่มบล็อก" พร้อมเมนูลอยสองคอลัมน์ */
function AddBlockMenu({ onPick }: { onPick: (type: BlockType) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // คลิกที่อื่นหรือกด Esc แล้วปิดเมนู
  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="rounded-full border border-dashed border-slate-300 bg-white px-5 py-1.5 text-xs font-semibold text-slate-500 transition hover:border-wecci-blue hover:text-wecci-blue"
      >
        + เพิ่มบล็อก
      </button>

      {open && (
        <div className="absolute left-1/2 top-full z-20 mt-2 w-72 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
          <ul className="grid grid-cols-2 gap-1">
            {blockOrder.map((type) => (
              <li key={type}>
                <button
                  type="button"
                  onClick={() => {
                    onPick(type);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm text-slate-600 transition hover:bg-slate-50 hover:text-wecci-blue"
                >
                  <BlockIcon type={type} className="h-4 w-4 shrink-0 text-slate-400" />
                  {blockLabels[type]}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function BlockIcon({ type, className }: { type: BlockType; className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={blockIcons[type]} />
    </svg>
  );
}

/** ช่องกรอกของแต่ละชนิดบล็อก */
function BlockFields({
  block,
  onChange,
}: {
  block: ContentBlock;
  onChange: (block: ContentBlock) => void;
}) {
  switch (block.type) {
    case "heading":
      return (
        <input
          value={block.text}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
          placeholder="หัวข้อย่อย"
          className={`${inputClass} font-bold`}
        />
      );

    case "paragraph":
      return (
        <textarea
          value={block.text}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
          rows={4}
          placeholder="พิมพ์เนื้อหา ขึ้นบรรทัดใหม่ได้"
          className={inputClass}
        />
      );

    case "link":
      return (
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            value={block.label}
            onChange={(e) => onChange({ ...block, label: e.target.value })}
            placeholder="ข้อความของลิงก์"
            className={inputClass}
          />
          <input
            value={block.url}
            onChange={(e) => onChange({ ...block, url: e.target.value })}
            placeholder="https://..."
            className={inputClass}
          />
        </div>
      );

    case "images":
      return <ImagesBlockFields block={block} onChange={onChange} />;

    case "table":
      return <TableBlockFields block={block} onChange={onChange} />;

    case "divider":
      return (
        <div className="flex items-center gap-3 py-2">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-xs text-slate-400">เส้นคั่นระหว่างเนื้อหา</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>
      );

    case "spacer":
      return (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400">ความสูง</span>
          {(["sm", "md", "lg"] as const).map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => onChange({ ...block, size })}
              className={`rounded-full px-4 py-1 text-xs font-semibold transition ${
                block.size === size
                  ? "bg-wecci-blue text-white"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {size === "sm" ? "เล็ก" : size === "md" ? "กลาง" : "ใหญ่"}
            </button>
          ))}
        </div>
      );
  }
}

/** อัปโหลดได้หลายรูป เรียงลำดับได้ ถ้ามีมากกว่าหนึ่งรูปหน้าเว็บจะแสดงเป็น carousel */
function ImagesBlockFields({
  block,
  onChange,
}: {
  block: Extract<ContentBlock, { type: "images" }>;
  onChange: (block: ContentBlock) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(files: FileList) {
    setUploading(true);
    setError(null);

    try {
      const uploaded: string[] = [];

      for (const file of Array.from(files)) {
        const body = new FormData();
        body.append("file", file);

        const res = await fetch("/api/admin/upload", { method: "POST", body });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "อัปโหลดไม่สำเร็จ");

        uploaded.push(json.path);
      }

      onChange({ ...block, paths: [...block.paths, ...uploaded] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "อัปโหลดไม่สำเร็จ");
    } finally {
      setUploading(false);
    }
  }

  function movePath(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= block.paths.length) return;

    const paths = [...block.paths];
    [paths[index], paths[target]] = [paths[target], paths[index]];
    onChange({ ...block, paths });
  }

  return (
    <div className="space-y-3">
      {block.paths.length > 0 && (
        <ul className="flex flex-wrap gap-3">
          {block.paths.map((path, index) => (
            <li key={`${path}-${index}`} className="w-28">
              <div className="relative h-24 w-28 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                <Image src={path} alt="" fill sizes="112px" className="object-cover" />
                <span className="absolute left-1 top-1 rounded-full bg-black/60 px-1.5 text-[10px] font-semibold text-white">
                  {index + 1}
                </span>
              </div>

              <div className="mt-1 flex justify-center gap-1">
                <IconButton label="ย้ายไปซ้าย" onClick={() => movePath(index, -1)}>
                  m15 18-6-6 6-6
                </IconButton>
                <IconButton label="ย้ายไปขวา" onClick={() => movePath(index, 1)}>
                  m9 18 6-6-6-6
                </IconButton>
                <IconButton
                  label="เอารูปออก"
                  danger
                  onClick={() =>
                    onChange({
                      ...block,
                      paths: block.paths.filter((_, i) => i !== index),
                    })
                  }
                >
                  M18 6 6 18M6 6l12 12
                </IconButton>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dropzone uploading={uploading} onFiles={upload} />

      <input
        value={block.caption}
        onChange={(e) => onChange({ ...block, caption: e.target.value })}
        placeholder="คำบรรยายใต้ภาพ (ถ้ามี)"
        className={inputClass}
      />

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

/** พื้นที่วางไฟล์ — กดเพื่อเลือก หรือลากไฟล์มาปล่อยก็ได้ */
function Dropzone({
  uploading,
  onFiles,
}: {
  uploading: boolean;
  onFiles: (files: FileList) => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div>
      <p className="mb-1.5 text-sm font-semibold text-slate-700">เพิ่มรูป</p>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const files = event.dataTransfer.files;
          if (files.length > 0) void onFiles(files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
          dragging
            ? "border-wecci-blue bg-wecci-sand"
            : "border-slate-300 bg-white hover:border-wecci-blue hover:bg-slate-50"
        }`}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="8.5" cy="10" r="1.5" />
            <path d="m4 17 5-5 4 4 3-3 4 4" />
          </svg>
        </span>

        {uploading ? (
          <p className="text-sm text-slate-500">กำลังอัปโหลด...</p>
        ) : (
          <>
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-wecci-blue">คลิกเลือกไฟล์</span>{" "}
              หรือลากไฟล์มาวางที่นี่
            </p>
            <p className="text-xs text-slate-400">
              PNG, JPG, WEBP — เลือกได้หลายไฟล์ ถ้าตั้งแต่ 2 รูปจะแสดงเป็น carousel
            </p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        disabled={uploading}
        onChange={(event) => {
          const files = event.target.files;
          if (files && files.length > 0) void onFiles(files);
          event.target.value = "";
        }}
      />
    </div>
  );
}

function TableBlockFields({
  block,
  onChange,
}: {
  block: Extract<ContentBlock, { type: "table" }>;
  onChange: (block: ContentBlock) => void;
}) {
  const columns = block.rows[0]?.length ?? 2;

  function setCell(rowIndex: number, colIndex: number, text: string) {
    onChange({
      ...block,
      rows: block.rows.map((row, r) =>
        r === rowIndex ? row.map((cell, c) => (c === colIndex ? text : cell)) : row,
      ),
    });
  }

  return (
    <div>
      <p className="mb-2 text-xs text-slate-400">แถวแรกคือหัวตาราง</p>

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-1">
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex}>
                    <input
                      value={cell}
                      onChange={(e) => setCell(rowIndex, colIndex, e.target.value)}
                      placeholder={rowIndex === 0 ? "หัวตาราง" : "ข้อมูล"}
                      className={`${inputClass} ${rowIndex === 0 ? "font-semibold" : ""}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <SmallButton
          onClick={() =>
            onChange({ ...block, rows: [...block.rows, Array(columns).fill("")] })
          }
        >
          + เพิ่มแถว
        </SmallButton>
        <SmallButton
          onClick={() => onChange({ ...block, rows: block.rows.map((row) => [...row, ""]) })}
        >
          + เพิ่มคอลัมน์
        </SmallButton>
        <SmallButton
          disabled={block.rows.length <= 1}
          onClick={() => onChange({ ...block, rows: block.rows.slice(0, -1) })}
        >
          ลบแถวท้าย
        </SmallButton>
        <SmallButton
          disabled={columns <= 1}
          onClick={() => onChange({ ...block, rows: block.rows.map((row) => row.slice(0, -1)) })}
        >
          ลบคอลัมน์ท้าย
        </SmallButton>
      </div>
    </div>
  );
}

function SmallButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-600 transition hover:border-wecci-blue hover:text-wecci-blue disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function IconButton({
  label,
  onClick,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`rounded-lg border border-slate-200 p-1.5 transition ${
        danger
          ? "text-red-500 hover:border-red-300 hover:bg-red-50"
          : "text-slate-400 hover:border-wecci-blue hover:text-wecci-blue"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d={children} />
      </svg>
    </button>
  );
}
