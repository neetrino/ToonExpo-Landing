import { NextResponse } from "next/server";
import { auth } from "@/auth";

const ADMIN_LOGIN = "/admin/login";
const MOBILE_UA_REGEX =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i;

function isMobileProjectPath(pathname: string): boolean {
  return /^\/p\/[^/]+$/.test(pathname);
}

function isMobileRequest(req: Parameters<Parameters<typeof auth>[0]>[0]): boolean {
  const chMobile = req.headers.get("sec-ch-ua-mobile");
  if (chMobile === "?1") {
    return true;
  }

  const userAgent = req.headers.get("user-agent") ?? "";
  return MOBILE_UA_REGEX.test(userAgent);
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
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
});

export const config = {
  matcher: ["/admin", "/admin/:path*", "/p/:path*"],
};
