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
  // suppressHydrationWarning — extension-ներ (օր. --vsc-domain) կարող են <html> փոխել
  return (
    <html lang="hy" suppressHydrationWarning>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
