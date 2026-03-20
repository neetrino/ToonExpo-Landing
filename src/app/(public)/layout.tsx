import { PublicLayoutClient } from "./PublicLayoutClient";

export const dynamic = "force-dynamic";

export default async function PublicSiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PublicLayoutClient>{children}</PublicLayoutClient>;
}
