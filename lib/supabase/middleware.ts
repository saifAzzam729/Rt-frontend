import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { ensureLocale, splitPathname } from "@/i18n/utils"
import type { Locale } from "@/i18n/config"

export async function updateSession(request: NextRequest, response?: NextResponse) {
  const supabaseResponse = response ?? NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { locale, pathnameWithoutLocale } = splitPathname(request.nextUrl.pathname)
  const activeLocale: Locale = locale ?? ensureLocale(null)

  if (!user && pathnameWithoutLocale !== "/" && !pathnameWithoutLocale.startsWith("/auth")) {
    const url = request.nextUrl.clone()
    url.pathname = `/${activeLocale}/auth/login`
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
