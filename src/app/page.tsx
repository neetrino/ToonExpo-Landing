import { prisma } from "@/shared/lib/db";
import { HomePageClient } from "@/features/home/HomePageClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: { updatedAt: "desc" },
    select: { id: true, slug: true, expoFields: true },
  });
  const list = projects.map((p) => ({
    id: p.id,
    slug: p.slug,
    expoFields: (p.expoFields as Record<string, string>) ?? {},
  }));
  return <HomePageClient projects={list} />;
}
