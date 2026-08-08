import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ExecutiveForm } from "@/components/admin/ExecutiveForm";
import { requireAdmin } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditExecutivePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const username = await requireAdmin();
  const { id } = await params;

  const executiveId = Number(id);
  if (!Number.isInteger(executiveId)) notFound();

  const person = await prisma.cms_executive.findUnique({ where: { id: executiveId } });
  if (!person) notFound();

  return (
    <AdminShell username={username} title="โครงสร้างผู้บริหาร" bare>
      <ExecutiveForm
        values={{
          id: person.id,
          level: person.level,
          nameTh: person.nameTh,
          position: person.position ?? "",
          duty: person.duty ?? "",
          org: person.org ?? "",
          phone: person.phone ?? "",
          email: person.email ?? "",
          photo: person.photo ?? "",
          sortOrder: person.sortOrder,
          published: person.published,
        }}
      />
    </AdminShell>
  );
}
