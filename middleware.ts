import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Strip trailing punctuation from pathnames (e.g. /login. from copied URLs). */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.length > 1 && /[.,]+$/.test(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/[.,]+$/, "");
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login.",
    "/signup.",
    "/features.",
    "/pricing.",
    "/dashboard.",
  ],
};
