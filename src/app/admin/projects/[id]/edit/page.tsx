export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/shared/lib/db";
import { normalizeExpoFields } from "@/shared/lib/expoFields";
import { resolveProjectFolderMedia } from "@/features/landing/lib/resolveProjectFolderMedia";
import { EditProjectFormClient } from "@/features/builders/components/EditProjectFormClient";
import { IconChevronLeft, IconFolder } from "@/features/admin/components/AdminUiIcons";

type Props = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    notFound();
  }
  const defaults = normalizeExpoFields(project.expoFields);
  const folderMedia = await resolveProjectFolderMedia(project.mediaFolderId);
  const r2Base = process.env.R2_PUBLIC_URL?.replace(/\/$/, "") ?? "";
  const mfId = project.mediaFolderId?.trim();
  const exampleLogoPublicUrl =
    r2Base && mfId ? `${r2Base}/projects/${mfId}/Logo/Logo.png` : null;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <Link
          href="/admin/projects"
          title="Նախագծերի ցանկ"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-slate-600 shadow-sm transition-all duration-200 hover:border-[#2eb0b4]/40 hover:text-[#2eb0b4] hover:shadow-md"
        >
          <IconChevronLeft className="h-5 w-5" />
          <span className="sr-only">Ցանկ</span>
        </Link>
        <h1 className="inline-flex min-w-0 items-center gap-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2eb0b4]/15 to-[#2eb0b4]/5 text-[#2eb0b4]">
            <IconFolder className="h-5 w-5" />
          </span>
          <span className="truncate">Խմբագրել — {project.slug}</span>
        </h1>
      </div>

      <EditProjectFormClient
        projectId={project.id}
        defaultSlug={project.slug}
        defaultPublished={project.published}
        defaultMediaFolderId={project.mediaFolderId}
        defaults={defaults}
        mediaFolderLogoUrl={folderMedia.logoUrl}
        exampleLogoPublicUrl={exampleLogoPublicUrl}
      />
    </div>
  );
}
