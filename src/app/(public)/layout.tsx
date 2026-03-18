import { getPublishedProjectsForSite } from "@/features/home/getPublishedProjects";
import { SiteReachMapFooter } from "@/features/home/SiteReachMapFooter";

export const dynamic = "force-dynamic";

export default async function PublicSiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const projects = await getPublishedProjectsForSite();
  return (
    <>
      {children}
      <SiteReachMapFooter projects={projects} />
    </>
  );
}
