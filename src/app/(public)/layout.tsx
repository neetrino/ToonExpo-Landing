export const dynamic = "force-dynamic";

export default async function PublicSiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
