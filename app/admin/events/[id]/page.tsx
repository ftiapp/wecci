import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { EventForm } from "@/components/admin/EventForm";
import { requireAdmin } from "@/lib/auth/current-user";
import { toEventValues } from "@/lib/events/form-values";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const username = await requireAdmin();
  const { id } = await params;

  const eventId = Number(id);
  if (!Number.isInteger(eventId)) notFound();

  const [event, tags] = await Promise.all([
    prisma.cms_events.findUnique({
      where: { id: eventId },
      include: { tags: { select: { id: true } } },
    }),
    prisma.cms_event_tags.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!event) notFound();

  return (
    <AdminShell username={username} title="ข่าวสารและกิจกรรม" bare>
      <EventForm values={toEventValues(event)} tags={tags} />
    </AdminShell>
  );
}
