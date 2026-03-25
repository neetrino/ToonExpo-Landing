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

/**
 * Լրացուցիչ հոսթեր `next/image`-ի համար (օր. հին CSV-ում արտաքին CDN) — `hostname` առանց պորտի, ստորակետով։
 */
function extraImageRemotePatterns(): {
  protocol: "https";
  hostname: string;
  pathname: string;
}[] {
  const raw = process.env.NEXT_PUBLIC_EXTRA_IMAGE_HOSTNAMES?.trim();
  if (!raw) {
    return [];
  }
  return raw
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean)
    .map((hostname) => ({
      protocol: "https" as const,
      hostname,
      pathname: "/**",
    }));
}

const nextConfig: NextConfig = {
  env: {
    // Чтобы publicAssetUrl в client мог брать ассеты из R2 — тот же R2_PUBLIC_URL
    NEXT_PUBLIC_ASSET_BASE_URL: process.env.R2_PUBLIC_URL ?? "",
  },
  images: {
    remotePatterns: [
      ...(r2Pattern ? [r2Pattern] : []),
      ...extraImageRemotePatterns(),
      { protocol: "http", hostname: "localhost", pathname: "/**" },
      { protocol: "http", hostname: "127.0.0.1", pathname: "/**" },
    ],
  },
  async headers() {
    const base = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
    ];
    if (process.env.SECURITY_ENABLE_HSTS === "true") {
      base.push({
        key: "Strict-Transport-Security",
        value: "max-age=31536000; includeSubDomains",
      });
    }
    return [{ source: "/:path*", headers: base }];
  },
};

export default nextConfig;
