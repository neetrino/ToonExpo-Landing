export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/shared/lib/db";
import { normalizeExpoFields } from "@/shared/lib/expoFields";
import { EditProjectFormClient } from "@/features/builders/components/EditProjectFormClient";

type Props = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    notFound();
  }
  const defaults = normalizeExpoFields(project.expoFields);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/projects" className="text-sm text-slate-600 underline">
          ← Ցանկ
        </Link>
        <h1 className="text-2xl font-bold">Խմբագրել — {project.slug}</h1>
        <Link
          href={`/p/${project.slug}`}
          target="_blank"
          className="text-sm text-[#2ba8b0] underline"
        >
          Դիտել լենդինգը
        </Link>
      </div>

      <EditProjectFormClient
        projectId={project.id}
        defaultSlug={project.slug}
        defaultPublished={project.published}
        defaults={defaults}
      />
    </div>
  );
}
