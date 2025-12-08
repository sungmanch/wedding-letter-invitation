import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { User, LogIn } from 'lucide-react'
import { Button } from '@/components/ui'
import { createClient } from '@/lib/supabase/server'
import { NaturalHeroLanding } from '@/components/landing/NaturalHeroLanding'

export const metadata: Metadata = {
  title: 'Maison de Letter - 원하는 분위기를 말하면, AI가 바로 시안을 만들어 드립니다',
  description: '3분만에 나만의 특별한 청첩장을 완성하세요. AI 채팅으로 분위기를 말하면 바로 시안을 만들어 드립니다.',
  keywords: ['모바일 청첩장', '청첩장 만들기', 'AI 청첩장', '웨딩 초대장', '결혼 청첩장', '인터랙티브 청첩장', 'Maison de Letter'],
  openGraph: {
    title: 'Maison de Letter - 원하는 분위기를 말하면, AI가 바로 시안을 만들어 드립니다',
    description: '3분만에 나만의 특별한 청첩장을 완성하세요. AI 채팅으로 분위기를 말하면 바로 시안을 만들어 드립니다.',
    type: 'website',
    locale: 'ko_KR',
  },
}

export default async function WeddingLandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="flex min-h-screen flex-col bg-[var(--ivory-100)]">
      {/* Light Theme Header */}
      <header className="fixed top-0 z-50 w-full bg-[var(--ivory-100)]/95 backdrop-blur-sm border-b border-[var(--sand-100)]">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="Maison de Letter" width={200} height={48} priority className="w-[140px] sm:w-[180px] lg:w-[200px] h-auto" />
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/my/invitations"
                className="flex items-center gap-1 text-sm text-[var(--text-body)] hover:text-[var(--sage-600)] transition-colors"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">내 청첩장</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1 text-sm text-[var(--text-body)] hover:text-[var(--sage-600)] transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">로그인</span>
              </Link>
            )}
            <Link href="/se/create">
              <Button className="bg-[var(--sage-500)] hover:bg-[var(--sage-600)] text-white rounded-full px-4 sm:px-5 py-1.5 sm:py-2 text-sm sm:text-base font-medium h-auto">
                시작하기
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Natural Hero Landing */}
      <NaturalHeroLanding />

      {/* Footer */}
      <footer className="border-t border-[var(--sand-100)] px-6 py-10 bg-[var(--ivory-50)]">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
          {/* Logo */}
          <Image src="/logo.png" alt="Maison de Letter" width={120} height={28} className="opacity-60 h-6 w-auto" />

          {/* Legal Links */}
          <div className="flex items-center gap-4 text-xs">
            <Link href="/terms" className="text-[var(--text-muted)] hover:text-[var(--text-body)] transition-colors">
              이용약관
            </Link>
            <span className="text-[var(--sand-200)]">|</span>
            <Link href="/privacy" className="text-[var(--text-muted)] hover:text-[var(--text-body)] transition-colors">
              개인정보처리방침
            </Link>
          </div>

          {/* Business Info */}
          <div className="flex flex-col items-center gap-1 text-[10px] text-[var(--text-light)]">
            <p>티비디랩 | 사업자등록번호: 876-14-02417</p>
            <p>서울특별시 관악구 봉천로 408-1, 3층 126A호(봉천동)</p>
            <p>문의: sungman.cho@tbdlabs.team</p>
          </div>

          {/* Copyright */}
          <p className="text-[10px] text-[var(--text-light)]/60">
            © 2025 Maison de Letter. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}
