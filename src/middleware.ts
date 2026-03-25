import { NextResponse } from "next/server";
import type { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";
import { auth } from "@/auth";
import { authRateLimitResponse } from "@/shared/lib/authRateLimit";

const ADMIN_LOGIN = "/admin/login";
const MOBILE_UA_REGEX =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i;

function isMobileProjectPath(pathname: string): boolean {
  return /^\/p\/[^/]+$/.test(pathname);
}

/** `/p/{slug}/mobile` — միայն իսկական մոբայլ/տաբլետ UA-ի համար; դեսքտոպ UA → անմիջապես `/p/{slug}`։ */
function isProjectMobileLandingPath(pathname: string): boolean {
  return /^\/p\/[^/]+\/mobile$/.test(pathname);
}

/**
 * Միայն User-Agent — `Sec-CH-UA-Mobile`-ը մենակ կարող է սխալ լինել (էմուլյացիա, հազվագյուտ կլիենտներ),
 * իսկ viewport-ը սերվերում չենք տեսնում։
 */
function isMobileRequest(req: Parameters<Parameters<typeof auth>[0]>[0]): boolean {
  const userAgent = req.headers.get("user-agent") ?? "";
  return MOBILE_UA_REGEX.test(userAgent);
}

const authMiddleware = auth((req) => {
  const { pathname } = req.nextUrl;

  if (isProjectMobileLandingPath(pathname) && !isMobileRequest(req)) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.replace(/\/mobile$/, "");
    return NextResponse.redirect(url);
  }

  if (isMobileProjectPath(pathname) && isMobileRequest(req)) {
    const url = req.nextUrl.clone();
    url.pathname = `${pathname}/mobile`;
    return NextResponse.redirect(url);
  }

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }
  if (pathname === ADMIN_LOGIN || pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }
  if (!req.auth) {
    const url = new URL(ADMIN_LOGIN, req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}) as unknown as NextMiddleware;

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  if (req.nextUrl.pathname.startsWith("/api/auth")) {
    const limited = authRateLimitResponse(req);
    if (limited) {
      return limited;
    }
  }
  return authMiddleware(req, event);
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/p/:path*",
    "/api/auth",
    "/api/auth/:path*",
  ],
};
