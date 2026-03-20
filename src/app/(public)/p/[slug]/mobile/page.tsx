export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/shared/lib/db";
import { LandingPage } from "@/features/landing/mobile/LandingPage";
import { LandingBottomBarCallbacks } from "@/features/landing/mobile/LandingBottomBarCallbacks";
import { SiteReachMapFooter } from "@/features/home/mobile/SiteReachMapFooter";
import type { ExpoMap } from "@/features/landing/mobile/lib/blockVisibility";

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
    },
  });
  if (!project) {
    notFound();
  }
  const fields = (project.expoFields as Record<string, string>) ?? {};
  const projectData = {
    id: project.id,
    slug: project.slug,
    expoFields: fields,
  };
  return (
    <LandingBottomBarCallbacks>
      <LandingPage fields={fields} />
      <SiteReachMapFooter variant="participant" projects={[projectData]} />
    </LandingBottomBarCallbacks>
  );
}
