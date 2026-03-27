export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/shared/lib/db";
import { LandingPage } from "@/features/landing/mobile/LandingPage";
import { LandingDesktopRedirect } from "@/features/landing/mobile/LandingAutoRedirect";
import { LandingBottomBarCallbacks } from "@/features/landing/LandingBottomBarCallbacks";
import { SiteReachMapFooter } from "@/features/home/SiteReachMapFooter";
import type { ExpoMap } from "@/features/landing/mobile/lib/blockVisibility";
import { resolveProjectFolderMedia } from "@/features/landing/lib/resolveProjectFolderMedia";
import { PROJECT_FIELD } from "@/shared/constants/expoFieldKeys";
import { LandingAnalyticsTracker } from "@/features/landing/components/LandingAnalyticsTracker";

type Props = { params: Promise<{ slug: string }> };

function resolveProjectName(fields: Record<string, string>, slug: string): string {
  return (
    fields[PROJECT_FIELD.titleExhibition]?.trim() ||
    fields[PROJECT_FIELD.participantName]?.trim() ||
    slug
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await prisma.project.findFirst({
    where: { slug, published: true },
  });
  const f = (p?.expoFields as ExpoMap) ?? {};
  const title =
    f[PROJECT_FIELD.titleExhibition] || f[PROJECT_FIELD.participantName] || slug;
  return { title: `${title} | Toon Expo (Mobile)` };
}

export default async function PublicLandingMobilePage({ params }: Props) {
  const { slug } = await params;
  const project = await prisma.project.findFirst({
    where: { slug, published: true },
    select: {
      id: true,
      slug: true,
      expoFields: true,
      mediaFolderId: true,
    },
  });
  if (!project) {
    notFound();
  }
  const fields = (project.expoFields as Record<string, string>) ?? {};
  const projectName = resolveProjectName(fields, project.slug);
  const folderMedia = await resolveProjectFolderMedia(project.mediaFolderId);
  const projectData = {
    id: project.id,
    slug: project.slug,
    expoFields: fields,
  };
  return (
    <>
      <LandingDesktopRedirect slug={project.slug} />
      <LandingAnalyticsTracker projectSlug={project.slug} projectName={projectName} />
      <LandingPage
        fields={fields}
        folderMedia={folderMedia}
        projectSlug={project.slug}
        projectName={projectName}
      />
      <LandingBottomBarCallbacks project={projectData}>
        <SiteReachMapFooter variant="participant" projects={[projectData]} />
      </LandingBottomBarCallbacks>
    </>
  );
}
