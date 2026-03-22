import { cache } from "react";
import { prisma } from "@/shared/lib/db";
import type { HomeProject } from "@/features/home/homeProject.types";
import { resolveHomeCardMedia } from "@/features/home/resolveHomeCardMedia";

type Row = {
  id: string;
  slug: string;
  expoFields: unknown;
  mediaFolderId: string | null;
};

/**
 * Գլխավոր էջ — հերթականություն՝ Project ID (թվային) աճով՝ 1, 2, 3 …
 */
function compareByProjectPublicId(a: Row, b: Row): number {
  const sa = (a.mediaFolderId ?? a.slug).trim();
  const sb = (b.mediaFolderId ?? b.slug).trim();
  const aNum = /^\d+$/.test(sa);
  const bNum = /^\d+$/.test(sb);
  if (aNum && bNum) {
    return parseInt(sa, 10) - parseInt(sb, 10);
  }
  if (aNum && !bNum) {
    return -1;
  }
  if (!aNum && bNum) {
    return 1;
  }
  return sa.localeCompare(sb, undefined, { numeric: true, sensitivity: "base" });
}

/**
 * Հրապարակված նախագծերի ցանկ — կիսվում է հանրային layout-ի և գլխավոր էջի միջև (մեկ հարցում)։
 */
export const getPublishedProjectsForSite = cache(async (): Promise<HomeProject[]> => {
  const projects = await prisma.project.findMany({
    where: { published: true },
    select: { id: true, slug: true, expoFields: true, mediaFolderId: true },
  });
  const sorted = [...projects].sort(compareByProjectPublicId);
  return sorted.map((p) => {
    const expoFields = (p.expoFields as Record<string, string>) ?? {};
    const { cardHeroUrl, cardLogoUrl } = resolveHomeCardMedia(p.mediaFolderId, expoFields);
    return {
      id: p.id,
      slug: p.slug,
      expoFields,
      cardHeroUrl,
      cardLogoUrl,
    } satisfies HomeProject;
  });
});
