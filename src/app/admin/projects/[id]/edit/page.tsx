export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/shared/lib/db";
import { normalizeExpoFields } from "@/shared/lib/expoFields";
import { EditProjectFormClient } from "@/features/builders/components/EditProjectFormClient";
import { DeleteProjectButton } from "@/features/builders/components/DeleteProjectButton";

type Props = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    notFound();
  }
  const defaults = normalizeExpoFields(project.expoFields);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/projects"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            ← Ցանկ
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Խմբագրել — {project.slug}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/p/${project.slug}`}
            target="_blank"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Բացել լենդինգը →
          </Link>
          <DeleteProjectButton projectId={project.id} slug={project.slug} />
        </div>
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
