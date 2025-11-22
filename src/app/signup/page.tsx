'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { Button, Input, Card } from '@/components/ui'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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
      await new Promise(resolve => setTimeout(resolve, 1000))
      localStorage.setItem('user', JSON.stringify({ name, email, loggedIn: true }))
      router.push(redirectTo)
    } catch {
      setError('회원가입에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Signup Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-charcoal">
              이름
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal/40" />
              <Input
                type="text"
                placeholder="이름을 입력하세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-charcoal">
              이메일
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal/40" />
              <Input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-charcoal">
              비밀번호
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal/40" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="6자 이상 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal"
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
            <label className="mb-2 block text-sm font-medium text-charcoal">
              비밀번호 확인
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal/40" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호를 다시 입력하세요"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <Button
            type="submit"
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
          <div className="flex-1 border-t border-gray-200" />
          <span className="px-4 text-sm text-charcoal/40">또는</span>
          <div className="flex-1 border-t border-gray-200" />
        </div>

        {/* Social Signup */}
        <Button
          type="button"
          variant="outline"
          fullWidth
          className="bg-[#FEE500] border-[#FEE500] text-[#3C1E1E] hover:bg-[#FEE500]/90"
        >
          <span className="mr-2">💬</span>
          카카오로 계속하기
        </Button>
      </Card>

      {/* Login link */}
      <p className="mt-6 text-center text-sm text-charcoal/60">
        이미 계정이 있으신가요?{' '}
        <Link
          href={`/login${redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
          className="font-medium text-blush-pink hover:underline"
        >
          로그인
        </Link>
      </p>

      {/* Terms */}
      <p className="mt-4 text-center text-xs text-charcoal/40">
        가입하면{' '}
        <Link href="/terms" className="underline">이용약관</Link>
        {' '}및{' '}
        <Link href="/privacy" className="underline">개인정보처리방침</Link>
        에 동의하는 것으로 간주됩니다.
      </p>
    </>
  )
}

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-cream bg-white">
        <div className="flex h-14 items-center px-4">
          <Link
            href="/"
            className="flex items-center text-charcoal/60 hover:text-charcoal"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="flex-1 text-center font-semibold text-charcoal">
            회원가입
          </h1>
          <div className="w-5" />
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-8">
        <div className="mx-auto max-w-sm">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blush-pink/20">
              <span className="text-3xl">💌</span>
            </div>
            <h2 className="text-xl font-bold text-charcoal">청모장 가입하기</h2>
            <p className="mt-1 text-sm text-charcoal/60">
              가입하고 청모장을 계속 관리하세요
            </p>
          </div>

          <Suspense fallback={<div className="text-center text-charcoal/60">로딩 중...</div>}>
            <SignupForm />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
