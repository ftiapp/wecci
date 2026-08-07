import { AdminShell } from "@/components/admin/AdminShell";
import { EventForm } from "@/components/admin/EventForm";
import { requireAdmin } from "@/lib/auth/current-user";
import { emptyEventValues } from "@/lib/events/form-values";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewEventPage() {
  const username = await requireAdmin();
  const tags = await prisma.cms_event_tags.findMany({ orderBy: { name: "asc" } });

  return (
    <AdminShell username={username} title="ข่าวสารและกิจกรรม" bare>
      <EventForm values={emptyEventValues()} tags={tags} />
    </AdminShell>
  );
}
