import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Toon Expo",
  description: "Շինարարական ցուցահանդեսի հարթակ",
};

/** Մոբայլում pinch-zoom և input focus zoom-ը անջատելու համար */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
