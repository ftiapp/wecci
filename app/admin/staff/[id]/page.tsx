import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { StaffForm } from "@/components/admin/StaffForm";
import { requireAdmin } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditStaffPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const username = await requireAdmin();
  const { id } = await params;

  const staffId = Number(id);
  if (!Number.isInteger(staffId)) notFound();

  const person = await prisma.cms_staff.findUnique({ where: { id: staffId } });
  if (!person) notFound();

  return (
    <AdminShell username={username} title="โครงสร้างบุคลากร" bare>
      <StaffForm
        values={{
          id: person.id,
          level: person.level,
          nameTh: person.nameTh,
          phone: person.phone ?? "",
          email: person.email ?? "",
          photo: person.photo ?? "",
          sortOrder: person.sortOrder,
          newRow: person.newRow,
          published: person.published,
        }}
      />
    </AdminShell>
  );
}
