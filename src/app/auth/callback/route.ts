import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { notifyNewKakaoSignup } from '@/lib/slack'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/my'

  const redirectUrl = `${origin}${next}`

  if (code) {
    const response = NextResponse.redirect(redirectUrl)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            const cookieHeader = request.headers.get('cookie') || ''
            return cookieHeader.split(';').map((cookie) => {
              const [name, ...rest] = cookie.trim().split('=')
              return { name, value: rest.join('=') }
            }).filter((cookie) => cookie.name)
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set({
                name,
                value,
                ...options,
              })
            })
          },
        },
      }
    )

    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && session?.user) {
      const user = session.user

      // Check if new user (signed up in last 10 seconds)
      const userCreatedAt = new Date(user.created_at)
      const isNewUser = (Date.now() - userCreatedAt.getTime()) < 10000

      // Check if Kakao provider
      const isKakaoSignup = user.app_metadata?.provider === 'kakao'

      if (isNewUser && isKakaoSignup) {
        // Don't await - don't block user redirect
        notifyNewKakaoSignup(user.id, user.email, user.created_at).catch(console.error)
      }

      return response
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
