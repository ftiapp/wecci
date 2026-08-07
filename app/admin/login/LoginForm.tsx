"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/actions";

const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-wecci-blue focus:bg-white focus:ring-2 focus:ring-wecci-blue/20";

export function LoginForm({ from }: { from: string }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    {},
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="from" value={from} />

      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-slate-700">
          ชื่อผู้ใช้
        </span>
        <input
          name="username"
          autoComplete="username"
          required
          placeholder="ชื่อผู้ใช้ผู้ดูแลระบบ"
          className={fieldClass}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-slate-700">
          รหัสผ่าน
        </span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          placeholder="รหัสผ่าน"
          className={fieldClass}
        />
      </label>

      {state.error && (
        <p
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-gradient-to-r from-wecci-navy to-wecci-blue px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-wecci-blue/25 transition hover:from-wecci-blue hover:to-wecci-aqua disabled:opacity-60"
      >
        {pending ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
      </button>
    </form>
  );
}
