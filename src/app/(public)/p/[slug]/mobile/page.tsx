export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/shared/lib/db";
import { LandingPage } from "@/features/landing/mobile/LandingPage";
import { LandingDesktopRedirect } from "@/features/landing/mobile/LandingAutoRedirect";
import { LandingBottomBarCallbacks } from "@/features/landing/LandingBottomBarCallbacks";
import { SiteReachMapFooter } from "@/features/home/mobile/SiteReachMapFooter";
import type { ExpoMap } from "@/features/landing/mobile/lib/blockVisibility";
import { resolveProjectFolderMedia } from "@/features/landing/lib/resolveProjectFolderMedia";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await prisma.project.findFirst({
    where: { slug, published: true },
  });
  const f = (p?.expoFields as ExpoMap) ?? {};
  const title = f.expo_field_02 || f.expo_field_01 || slug;
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
  const folderMedia = resolveProjectFolderMedia(project.mediaFolderId);
  const projectData = {
    id: project.id,
    slug: project.slug,
    expoFields: fields,
  };
  return (
    <>
      <LandingDesktopRedirect slug={project.slug} />
      <LandingPage fields={fields} folderMedia={folderMedia} />
      <LandingBottomBarCallbacks project={projectData}>
        <SiteReachMapFooter variant="participant" projects={[projectData]} />
      </LandingBottomBarCallbacks>
    </>
  );
}
