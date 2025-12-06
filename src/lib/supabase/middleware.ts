import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes that require authentication
  const protectedPaths = ['/my', '/create', '/super-editor']
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )

  // /se routes need special handling
  const pathname = request.nextUrl.pathname
  const isSeRoute = pathname.startsWith('/se/')

  // /se/[id]/preview?token=xxx allows unauthenticated access
  const isPreviewWithToken =
    pathname.match(/^\/se\/[^/]+\/preview$/) &&
    request.nextUrl.searchParams.has('token')

  // /se/[id] (public viewer) - no auth required if published
  const isPublicViewer = pathname.match(/^\/se\/[^/]+$/)

  // /se routes that require auth (edit, preview without token)
  const isSeProtected = isSeRoute && !isPreviewWithToken && !isPublicViewer

  if ((isProtectedPath || isSeProtected) && !user) {
    // Redirect unauthenticated users to login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
