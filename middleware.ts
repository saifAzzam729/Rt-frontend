import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { splitPathname } from "@/i18n/utils";

const PUBLIC_PATHS = [
  "/",
  "/work",
  "/about",
  "/browse/jobs",
  "/browse/tenders",
  "/auth/login",
  "/auth/sign-up",
  "/auth/verify",
];

function isPublicRoute(pathname: string) {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  // Check for API routes first - they should bypass i18n middleware entirely
  if (request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const intlResponse = intlMiddleware(request);
  const { pathnameWithoutLocale, locale } = splitPathname(request.nextUrl.pathname);

  if (isPublicRoute(pathnameWithoutLocale)) {
    return intlResponse;
  }

  // Check for JWT token in cookies
  const accessToken = request.cookies.get('access_token')?.value;
  
  if (!accessToken) {
    // No token, redirect to login
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/auth/login`;
    return NextResponse.redirect(url);
  }

  // Token exists, let it through
  // Token validation will happen at the page level
  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
