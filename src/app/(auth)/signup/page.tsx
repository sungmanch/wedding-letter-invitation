'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { Button, Input, Card } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import { signUpWithEmail } from '@/lib/actions/auth'

// Open Redirect 방지: 상대 경로만 허용
function isValidRedirect(url: string): boolean {
  return url.startsWith('/') && !url.startsWith('//') && !url.includes('://')
}

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawRedirect = searchParams.get('redirect')
  const redirectTo = rawRedirect && isValidRedirect(rawRedirect) ? rawRedirect : '/my'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isKakaoLoading, setIsKakaoLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      return
    }

    setIsLoading(true)

    try {
      // Use server action for signup (enables Slack notification)
      const result = await signUpWithEmail(email, password, name)

      if (!result.success) {
        setError(result.error || '회원가입에 실패했습니다.')
        return
      }

      router.push(redirectTo)
    } catch {
      setError('회원가입에 실패했습니다. 다시 시도해주세요.')
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
        가입하고 청첩장을 계속 관리하세요
      </p>

      {/* Signup Form */}
      <Card variant="light" className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text-body)]">
              이름
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />
              <Input
                type="text"
                variant="light"
                placeholder="이름을 입력하세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

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
                placeholder="6자 이상 입력하세요"
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

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text-body)]">
              비밀번호 확인
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />
              <Input
                type={showPassword ? 'text' : 'password'}
                variant="light"
                placeholder="비밀번호를 다시 입력하세요"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10"
                required
              />
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
            disabled={!name || !email || !password || !confirmPassword}
          >
            가입하기
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-[var(--sand-200)]" />
          <span className="px-4 text-sm text-[var(--text-muted)]">또는</span>
          <div className="flex-1 border-t border-[var(--sand-200)]" />
        </div>

        {/* Social Signup */}
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

      {/* Login link */}
      <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
        이미 계정이 있으신가요?{' '}
        <Link
          href={`/login${redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
          className="font-medium text-[var(--sage-600)] hover:text-[var(--sage-700)] transition-colors"
        >
          로그인
        </Link>
      </p>

      {/* Terms */}
      <p className="mt-4 text-center text-xs text-[var(--text-light)]">
        가입하면{' '}
        <Link href="/terms" className="underline hover:text-[var(--text-muted)] transition-colors">
          이용약관
        </Link>
        {' '}및{' '}
        <Link href="/privacy" className="underline hover:text-[var(--text-muted)] transition-colors">
          개인정보처리방침
        </Link>
        에 동의하는 것으로 간주됩니다.
      </p>
    </>
  )
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center text-[var(--text-muted)]">로딩 중...</div>
      }
    >
      <SignupForm />
    </Suspense>
  )
}
