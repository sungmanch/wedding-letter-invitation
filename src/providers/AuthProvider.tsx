'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { identifyClarity } from '@/components/ClarityScript'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // 초기 세션 확인 (전역에서 1회만)
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        // Clarity 유저 매핑
        if (user) {
          identifyClarity(user.id, undefined, undefined, user.email || undefined)
        }

        // 로그인 후 sessionStorage에 pendingEventId가 있으면 자동 claim
        if (user && typeof window !== 'undefined') {
          const pendingEventId = sessionStorage.getItem('pendingEventId')
          if (pendingEventId) {
            // claimEvent 호출 (client-side)
            fetch('/api/claim-event', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ eventId: pendingEventId }),
            })
              .then(() => {
                // 성공하면 sessionStorage 삭제
                sessionStorage.removeItem('pendingEventId')
              })
              .catch(console.error)
          }
        }
      } catch {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // 인증 상태 변경 리스너 (전역에서 1개만)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)

      // Clarity 유저 매핑
      if (session?.user) {
        identifyClarity(session.user.id, undefined, undefined, session.user.email || undefined)
      }

      // 로그인 상태 변경 시에도 pendingEventId 체크
      if (session?.user && typeof window !== 'undefined') {
        const pendingEventId = sessionStorage.getItem('pendingEventId')
        if (pendingEventId) {
          fetch('/api/claim-event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ eventId: pendingEventId }),
          })
            .then(() => {
              sessionStorage.removeItem('pendingEventId')
            })
            .catch(console.error)
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(requireAuth = false) {
  const context = useContext(AuthContext)
  const router = useRouter()
  const pathname = usePathname()

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  const { user, isLoading, logout } = context

  useEffect(() => {
    if (!isLoading && requireAuth && !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [isLoading, requireAuth, user, router, pathname])

  return { user, isLoading, logout }
}
