import { AdminShell } from "@/components/admin/AdminShell";
import { MessageInbox, type InboxMessage } from "@/components/admin/MessageInbox";
import { requireAdmin } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const shortFormat = new Intl.DateTimeFormat("th-TH", {
  day: "numeric",
  month: "numeric",
  year: "numeric",
});

const longFormat = new Intl.DateTimeFormat("th-TH", {
  dateStyle: "long",
  timeStyle: "short",
});

/** รายการข้อความที่ส่งเข้ามาจากฟอร์มหน้าติดต่อ */
export default async function AdminMessagesPage() {
  const username = await requireAdmin();

  const rows = await prisma.cms_contact_messages.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  // จัดรูปแบบวันที่ตั้งแต่ฝั่งเซิร์ฟเวอร์ ให้ผลตรงกับที่เบราว์เซอร์เรนเดอร์
  const messages: InboxMessage[] = rows.map((row) => ({
    id: row.id,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    phone: row.phone,
    subject: row.subject,
    message: row.message,
    isRead: row.isRead,
    dateLong: longFormat.format(row.createdAt),
    dateShort: shortFormat.format(row.createdAt),
  }));

  return (
    <AdminShell username={username} title="ข้อความจากฟอร์ม" bare>
      <MessageInbox messages={messages} />
    </AdminShell>
  );
}
