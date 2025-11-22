'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface User {
  name?: string
  email: string
  loggedIn: boolean
}

export function useAuth(requireAuth = false) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // TODO: Supabase 인증으로 교체
    const checkAuth = () => {
      try {
        const stored = localStorage.getItem('user')
        if (stored) {
          const userData = JSON.parse(stored)
          if (userData.loggedIn) {
            setUser(userData)
          }
        }
      } catch {
        // 파싱 에러 무시
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  useEffect(() => {
    if (!isLoading && requireAuth && !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [isLoading, requireAuth, user, router, pathname])

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
    router.push('/')
  }

  return { user, isLoading, logout }
}
