import { NextResponse } from "next/server";
import { auth } from "@/auth";

const ADMIN_LOGIN = "/admin/login";

export default auth((req) => {
  const { pathname } = req.nextUrl;
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
  matcher: ["/admin", "/admin/:path*"],
};
