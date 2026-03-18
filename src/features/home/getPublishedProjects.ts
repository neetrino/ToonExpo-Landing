import { cache } from "react";
import { prisma } from "@/shared/lib/db";
import type { HomeProject } from "@/features/home/homeProject.types";

/**
 * Հրապարակված նախագծերի ցանկ — կիսվում է հանրային layout-ի և գլխավոր էջի միջև (մեկ հարցում)։
 */
export const getPublishedProjectsForSite = cache(async (): Promise<HomeProject[]> => {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: { updatedAt: "desc" },
    select: { id: true, slug: true, expoFields: true },
  });
  return projects.map((p) => ({
    id: p.id,
    slug: p.slug,
    expoFields: (p.expoFields as Record<string, string>) ?? {},
  }));
});
