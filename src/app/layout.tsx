import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Toon Expo",
  description: "Շինարարական ցուցահանդեսի հարթակ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hy">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
