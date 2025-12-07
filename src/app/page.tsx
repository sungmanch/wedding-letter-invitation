import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { User, LogIn } from 'lucide-react'
import { Button } from '@/components/ui'
import { createClient } from '@/lib/supabase/server'
import { ScrollytellingLanding } from '@/components/landing/ScrollytellingLanding'

export const metadata: Metadata = {
  title: 'Maison de Letter - 영상처럼 움직이는 AI 청첩장',
  description: '기존과는 완전히 다른 영상 같은 청첩장. LP가 돌아가고, 필름 그레인이 흐르고, 채팅처럼 대화하는 인터랙티브 청첩장을 만들어보세요.',
  keywords: ['모바일 청첩장', '청첩장 만들기', 'AI 청첩장', '웨딩 초대장', '결혼 청첩장', '인터랙티브 청첩장', 'Maison de Letter'],
  openGraph: {
    title: 'Maison de Letter - 영상처럼 움직이는 AI 청첩장',
    description: '기존과는 완전히 다른 영상 같은 청첩장. 인터랙티브 청첩장을 만들어보세요.',
    type: 'website',
    locale: 'ko_KR',
  },
}

export default async function WeddingLandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="flex min-h-screen flex-col bg-[#0A0806]">
      {/* Dark Theme Header */}
      <header className="fixed top-0 z-50 w-full bg-transparent">
        <div className="flex h-16 items-center justify-between px-2 sm:px-6 lg:px-8 mt-2 sm:mt-3">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="Maison de Letter" width={300} height={72} priority className="brightness-110 w-[180px] sm:w-[240px] lg:w-[300px] h-auto" />
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/my/invitations"
                className="flex items-center gap-1 text-sm text-[#F5E6D3]/70 hover:text-[#F5E6D3] transition-colors"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">내 청첩장</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1 text-sm text-[#F5E6D3]/70 hover:text-[#F5E6D3] transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">로그인</span>
              </Link>
            )}
            <Link href="/create">
              <Button className="bg-[#C9A962] hover:bg-[#B8A052] text-[#0A0806] rounded-full px-4 sm:px-5 py-1.5 sm:py-2 text-sm sm:text-base font-medium h-auto">
                시작하기
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Scrollytelling Landing */}
      <ScrollytellingLanding />

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-10 bg-[#0A0806]">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
          {/* Logo */}
          <Image src="/logo.png" alt="Maison de Letter" width={120} height={28} className="brightness-110 opacity-60 h-6 w-auto" />

          {/* Legal Links */}
          <div className="flex items-center gap-4 text-xs">
            <Link href="/terms" className="text-[#F5E6D3]/50 hover:text-[#F5E6D3]/80 transition-colors">
              이용약관
            </Link>
            <span className="text-[#F5E6D3]/30">|</span>
            <Link href="/privacy" className="text-[#F5E6D3]/50 hover:text-[#F5E6D3]/80 transition-colors">
              개인정보처리방침
            </Link>
          </div>

          {/* Business Info */}
          <div className="flex flex-col items-center gap-1 text-[10px] text-[#F5E6D3]/30">
            <p>티비디랩 | 사업자등록번호: 876-14-02417</p>
            <p>서울특별시 관악구 봉천로 408-1, 3층 126A호(봉천동)</p>
            <p>문의: sungman.cho@tbdlabs.team</p>
          </div>

          {/* Copyright */}
          <p className="text-[10px] text-[#F5E6D3]/20">
            © 2025 Maison de Letter. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}
