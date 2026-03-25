import type { Metadata, Viewport } from "next";
import "./globals.css";
import { publicAssetUrl } from "@/shared/lib/publicAssetUrl";

const SITE_ICON = publicAssetUrl("/figma/home/footerLogo.svg");

export const metadata: Metadata = {
  title: "Toon Expo",
  description: "Շինարարական ցուցահանդեսի հարթակ",
  icons: {
    icon: [{ url: SITE_ICON, type: "image/svg+xml" }],
    shortcut: SITE_ICON,
    apple: SITE_ICON,
  },
};

/** Մոբայլում pinch-zoom և input focus zoom-ը անջատելու համար */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
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
