"use client";

import { useActionState } from "react";
import { saveBlockAction, type SaveState } from "@/app/admin/pages/[slug]/actions";
import type { BlockDef } from "@/lib/content/schema";
import { ImageField } from "@/components/admin/ImageField";
import { MapPicker } from "@/components/admin/MapPicker";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-wecci-blue focus:bg-white focus:ring-2 focus:ring-wecci-blue/20";

export function BlockForm({
  page,
  block,
  values,
}: {
  page: string;
  block: BlockDef;
  values: Record<string, string | boolean>;
}) {
  const [state, formAction, pending] = useActionState<SaveState, FormData>(
    saveBlockAction,
    {},
  );

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <input type="hidden" name="__page" value={page} />
      <input type="hidden" name="__block" value={block.key} />

      <div className="mb-5 flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="font-bold text-wecci-navy">{block.label}</h2>
          {block.description && (
            <p className="mt-1 text-sm text-slate-500">{block.description}</p>
          )}
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
          {block.key}
        </span>
      </div>

      <div className="space-y-4">
        {block.fields.map((field) => {
          const value = values[field.name];

          if (field.type === "switch") {
            return (
              <label key={field.name} className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  name={field.name}
                  defaultChecked={Boolean(value)}
                  className="h-4 w-4 rounded border-slate-300 text-wecci-blue focus:ring-wecci-blue/30"
                />
                <span className="font-semibold text-slate-700">{field.label}</span>
              </label>
            );
          }

          if (field.type === "map") {
            return (
              <MapPicker
                key={field.name}
                name={field.name}
                label={field.label}
                help={field.help}
                defaultValue={String(value ?? "")}
              />
            );
          }

          if (field.type === "image") {
            return (
              <ImageField
                key={field.name}
                name={field.name}
                label={field.label}
                help={field.help}
                defaultValue={String(value ?? "")}
              />
            );
          }

          return (
            <label key={field.name} className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                {field.label}
              </span>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  rows={3}
                  defaultValue={String(value ?? "")}
                  placeholder={field.placeholder}
                  className={inputClass}
                />
              ) : (
                <input
                  name={field.name}
                  defaultValue={String(value ?? "")}
                  placeholder={field.placeholder}
                  className={inputClass}
                />
              )}
              {field.help && (
                <span className="mt-1 block text-xs text-slate-400">{field.help}</span>
              )}
            </label>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-gradient-to-r from-wecci-navy to-wecci-blue px-6 py-2.5 text-sm font-semibold text-white transition hover:from-wecci-blue hover:to-wecci-aqua disabled:opacity-60"
        >
          {pending ? "กำลังบันทึก..." : "บันทึกบล็อกนี้"}
        </button>

        {state.ok && (
          <span className="text-sm text-wecci-mint">บันทึกแล้ว {state.savedAt}</span>
        )}
        {state.error && <span className="text-sm text-rose-600">{state.error}</span>}
      </div>
    </form>
  );
}
