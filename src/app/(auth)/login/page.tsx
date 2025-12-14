'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Button, Input, Card } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/my'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isKakaoLoading, setIsKakaoLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.')
        return
      }

      if (data.user) {
        router.push(redirectTo)
      }
    } catch {
      setError('로그인에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKakaoLogin = async () => {
    setIsKakaoLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        },
      })

      if (oauthError) {
        setError('카카오 로그인에 실패했습니다.')
      }
    } catch {
      setError('카카오 로그인에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsKakaoLoading(false)
    }
  }

  return (
    <>
      {/* Tagline */}
      <p className="mb-8 text-center text-sm text-[var(--text-muted)]">
        나만의 특별한 청첩장을 만들어보세요
      </p>

      {/* Login Form */}
      <Card variant="light" className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text-body)]">
              이메일
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />
              <Input
                type="email"
                variant="light"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text-body)]">
              비밀번호
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />
              <Input
                type={showPassword ? 'text' : 'password'}
                variant="light"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="sage"
            size="lg"
            fullWidth
            isLoading={isLoading}
            disabled={!email || !password}
          >
            로그인
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-[var(--sand-200)]" />
          <span className="px-4 text-sm text-[var(--text-muted)]">또는</span>
          <div className="flex-1 border-t border-[var(--sand-200)]" />
        </div>

        {/* Social Login */}
        <Button
          type="button"
          variant="outline"
          fullWidth
          className="bg-[#FEE500] border-[#FEE500] text-[#3C1E1E] hover:bg-[#FEE500]/90"
          onClick={handleKakaoLogin}
          disabled={isKakaoLoading}
          isLoading={isKakaoLoading}
        >
          <span className="mr-2">💬</span>
          카카오로 계속하기
        </Button>
      </Card>

      {/* Sign up link */}
      <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
        아직 계정이 없으신가요?{' '}
        <Link
          href={`/signup${redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
          className="font-medium text-[var(--sage-600)] hover:text-[var(--sage-700)] transition-colors"
        >
          회원가입
        </Link>
      </p>
    </>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center text-[var(--text-muted)]">로딩 중...</div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
