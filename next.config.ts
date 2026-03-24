import type { NextConfig } from "next";

function r2ImageRemotePattern():
  | { protocol: "https"; hostname: string; pathname: string }
  | null {
  const raw = process.env.R2_PUBLIC_URL;
  if (!raw) {
    return null;
  }
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:") {
      return null;
    }
    return { protocol: "https", hostname: u.hostname, pathname: "/**" };
  } catch {
    return null;
  }
}

const r2Pattern = r2ImageRemotePattern();

const nextConfig: NextConfig = {
  env: {
    // Чтобы publicAssetUrl в client мог брать ассеты из R2 — тот же R2_PUBLIC_URL
    NEXT_PUBLIC_ASSET_BASE_URL: process.env.R2_PUBLIC_URL ?? "",
  },
  images: {
    remotePatterns: [
      ...(r2Pattern ? [r2Pattern] : []),
      { protocol: "https", hostname: "**", pathname: "/**" },
      { protocol: "http", hostname: "localhost", pathname: "/**" },
    ],
  },
};

export default nextConfig;
