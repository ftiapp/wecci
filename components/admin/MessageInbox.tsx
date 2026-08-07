"use client";

import { Fragment, useState } from "react";
import { deleteMessageAction, toggleReadAction } from "@/app/admin/messages/actions";

export type InboxMessage = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  /** จัดรูปแบบมาจากฝั่งเซิร์ฟเวอร์แล้ว กัน hydration ไม่ตรงกัน */
  dateLong: string;
  dateShort: string;
};

type Filter = "all" | "unread" | "read";

const filterTabs: { value: Filter; label: string }[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "unread", label: "ยังไม่อ่าน" },
  { value: "read", label: "อ่านแล้ว" },
];

/** ตารางข้อความจากฟอร์ม — กดที่แถวเพื่อกางอ่านข้อความเต็ม */
export function MessageInbox({ messages }: { messages: InboxMessage[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<number | null>(null);

  const counts = {
    all: messages.length,
    unread: messages.filter((message) => !message.isRead).length,
    read: messages.filter((message) => message.isRead).length,
  };

  const shown = messages.filter((message) => {
    if (filter === "unread") return !message.isRead;
    if (filter === "read") return message.isRead;
    return true;
  });

  if (messages.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-16 text-center">
        <p className="text-lg font-bold text-wecci-navy">ยังไม่มีข้อความส่งเข้ามา</p>
        <p className="mt-2 text-sm text-slate-500">
          ข้อความจากฟอร์มหน้าติดต่อจะแสดงที่นี่ทันทีที่มีผู้ส่งเข้ามา
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-wecci-navy">ข้อความจากฟอร์ม</h1>

        <div className="ml-auto flex gap-1 rounded-xl bg-slate-100 p-1">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setFilter(tab.value)}
              className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition ${
                filter === tab.value
                  ? "bg-white text-wecci-navy shadow-sm"
                  : "text-slate-500 hover:text-wecci-navy"
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-xs text-slate-400">{counts[tab.value]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-4xl text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="px-5 py-3.5 font-semibold">ผู้ส่ง</th>
              <th className="px-5 py-3.5 font-semibold">หัวเรื่อง</th>
              <th className="px-5 py-3.5 font-semibold">ติดต่อกลับ</th>
              <th className="px-5 py-3.5 font-semibold whitespace-nowrap">วันที่ส่ง</th>
              <th className="px-5 py-3.5 font-semibold">
                สถานะ
                <span className="ml-1 text-xs font-normal text-slate-400">(กดเพื่อสลับ)</span>
              </th>
              <th className="px-5 py-3.5 text-right font-semibold">จัดการ</th>
            </tr>
          </thead>

          <tbody>
            {shown.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                  ไม่มีข้อความในหมวดนี้
                </td>
              </tr>
            )}

            {shown.map((message) => {
              const open = openId === message.id;

              return (
                <Fragment key={message.id}>
                  <tr
                    onClick={() => setOpenId(open ? null : message.id)}
                    className={`cursor-pointer border-b border-slate-100 transition ${
                      open ? "bg-slate-50" : "hover:bg-slate-50/70"
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <span
                        className={
                          message.isRead ? "text-slate-600" : "font-bold text-wecci-navy"
                        }
                      >
                        {message.firstName} {message.lastName}
                      </span>
                    </td>

                    {/* หัวเรื่องยาวให้ตัดด้วย ... เอาเมาส์ชี้เพื่อดูข้อความเต็ม */}
                    <td className="max-w-0 px-5 py-3.5">
                      <span className="block truncate text-wecci-navy" title={message.subject}>
                        {message.subject}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-slate-500">{message.email}</td>

                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-500">
                      {message.dateShort}
                    </td>

                    {/* กดปุ่มในสองช่องนี้ต้องไม่ไปสั่งกาง/พับแถว */}
                    <td className="px-5 py-3.5" onClick={(event) => event.stopPropagation()}>
                      <form action={toggleReadAction}>
                        <input type="hidden" name="id" value={message.id} />
                        <input type="hidden" name="isRead" value={String(message.isRead)} />
                        {/* ป้ายสถานะกดสลับได้ — ไอคอนลูกศรวนบอกว่าคลิกเปลี่ยนค่าได้ */}
                        <button
                          type="submit"
                          title={
                            message.isRead
                              ? "คลิกเพื่อเปลี่ยนกลับเป็น “ยังไม่อ่าน”"
                              : "คลิกเพื่อเปลี่ยนเป็น “อ่านแล้ว”"
                          }
                          className={`group/status inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 transition ${
                            message.isRead
                              ? "bg-slate-100 text-slate-500 ring-slate-200 hover:bg-slate-200"
                              : "bg-red-50 text-red-600 ring-red-200 hover:bg-red-100"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              message.isRead ? "bg-slate-400" : "bg-red-500"
                            }`}
                          />
                          {message.isRead ? "อ่านแล้ว" : "ใหม่"}
                          <svg
                            viewBox="0 0 24 24"
                            className="h-3 w-3 opacity-40 transition group-hover/status:opacity-100"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden
                          >
                            <path d="M17 2v6h-6M7 22v-6h6M21 12a9 9 0 0 1-15 6.7M3 12a9 9 0 0 1 15-6.7" />
                          </svg>
                        </button>
                      </form>
                    </td>

                    <td className="px-5 py-3.5" onClick={(event) => event.stopPropagation()}>
                      <div className="flex justify-end gap-1">
                        <a
                          href={`mailto:${message.email}?subject=${encodeURIComponent(`ตอบกลับ: ${message.subject}`)}`}
                          title="ตอบกลับทางอีเมล"
                          aria-label="ตอบกลับทางอีเมล"
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-wecci-blue"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.6}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden
                          >
                            <path d="M3 6h18v12H3zM3 7l9 6 9-6" />
                          </svg>
                        </a>

                        <form
                          action={deleteMessageAction}
                          onSubmit={(event) => {
                            if (!window.confirm("ลบข้อความนี้ถาวรหรือไม่?")) {
                              event.preventDefault();
                            }
                          }}
                        >
                          <input type="hidden" name="id" value={message.id} />
                          <button
                            type="submit"
                            title="ลบ"
                            aria-label="ลบ"
                            className="rounded-lg p-1.5 text-red-400 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={1.6}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden
                            >
                              <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />
                            </svg>
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>

                  {/* แถวเนื้อหาเต็ม กางเมื่อกดที่แถวด้านบน */}
                  {open && (
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <td colSpan={6} className="px-5 pb-5">
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                          {message.message}
                        </p>

                        <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-xs">
                          <div className="flex gap-2">
                            <dt className="text-slate-400">ส่งเมื่อ</dt>
                            <dd className="text-slate-600">{message.dateLong}</dd>
                          </div>
                          <div className="flex gap-2">
                            <dt className="text-slate-400">โทรศัพท์</dt>
                            <dd>
                              <a
                                href={`tel:${message.phone}`}
                                className="text-wecci-blue hover:underline"
                              >
                                {message.phone}
                              </a>
                            </dd>
                          </div>
                        </dl>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
