import { getPublishedProjectsForSite } from "@/features/home/getPublishedProjects";
import { HomePageClient } from "@/features/home/HomePageClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const list = await getPublishedProjectsForSite();
  return <HomePageClient projects={list} />;
}
