import { Metadata } from 'next'
import Link from 'next/link'
import { User, LogIn, Heart, Film, Palette, Sparkles, MessageCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui'
import { createClient } from '@/lib/supabase/server'
import { HeroWithLivePreview } from '@/components/landing/HeroWithLivePreview'

export const metadata: Metadata = {
  title: '모바일 청첩장 - 영상처럼 움직이는 AI 청첩장',
  description: '기존과는 완전히 다른 영상 같은 모바일 청첩장. LP가 돌아가고, 필름 그레인이 흐르고, 채팅처럼 대화하는 인터랙티브 청첩장을 만들어보세요.',
  keywords: ['모바일 청첩장', '청첩장 만들기', 'AI 청첩장', '웨딩 초대장', '결혼 청첩장', '인터랙티브 청첩장'],
  openGraph: {
    title: '모바일 청첩장 - 영상처럼 움직이는 AI 청첩장',
    description: '기존과는 완전히 다른 영상 같은 모바일 청첩장. 인터랙티브 청첩장을 만들어보세요.',
    type: 'website',
    locale: 'ko_KR',
  },
}

export default async function WeddingLandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-[#D4768A] fill-[#D4768A]" />
            <span className="font-bold text-gray-900">청첩장AI</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              기능
            </a>
            <a href="#styles" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              스타일
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <Link href="/my/invitations" className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">내 청첩장</span>
              </Link>
            ) : (
              <Link href="/login" className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">로그인</span>
              </Link>
            )}
            <Link href="/create">
              <Button className="bg-[#D4768A] hover:bg-[#c4657a] text-white rounded-full px-5">
                시작하기
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero with Live Preview */}
      <HeroWithLivePreview />

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              기존 청첩장과는 완전히 다릅니다
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              정적인 이미지가 아닌, 영상처럼 움직이는 인터랙티브 청첩장.
              <br className="hidden sm:block" />
              하객들에게 잊지 못할 경험을 선사하세요.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#FFB6C1]/20 rounded-xl flex items-center justify-center mb-4">
                <Film className="h-6 w-6 text-[#D4768A]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                영상 같은 인트로
              </h3>
              <p className="text-gray-600 text-sm">
                LP가 돌아가고, 필름 그레인이 흐르고, 타이포그래피가 나타납니다.
                마치 영상을 보는 것 같은 경험.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#FFB6C1]/20 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-[#D4768A]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                인터랙티브 경험
              </h3>
              <p className="text-gray-600 text-sm">
                LP를 직접 돌려보고, 채팅처럼 대화하고, 갤러리를 탐색합니다.
                보는 것이 아닌, 참여하는 청첩장.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#FFB6C1]/20 rounded-xl flex items-center justify-center mb-4">
                <Palette className="h-6 w-6 text-[#D4768A]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                4가지 프리미엄 스타일
              </h3>
              <p className="text-gray-600 text-sm">
                시네마틱, LP 바이닐, 갤러리, 채팅.
                당신의 이야기에 맞는 스타일을 선택하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Styles Preview Section */}
      <section id="styles" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              4가지 프리미엄 스타일
            </h2>
            <p className="text-gray-600">
              각각의 스타일이 전하는 분위기가 완전히 다릅니다
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: '바이닐 LP', mood: '힙한 · 레트로', desc: 'LP가 돌아가며 음악이 흐르는 인트로', color: 'from-amber-900 to-gray-900' },
              { name: '시네마틱', mood: '감성적인 · 영화같은', desc: '화양연화 같은 필름 그레인 효과', color: 'from-red-900 to-gray-900' },
              { name: '갤러리', mood: '우아한 · 예술적인', desc: '미술관에 온 듯한 전시회 스타일', color: 'from-gray-100 to-gray-300' },
              { name: '채팅', mood: '친근한 · 유쾌한', desc: '카카오톡 대화처럼 펼쳐지는 스토리', color: 'from-blue-400 to-blue-600' },
            ].map((style) => (
              <div key={style.name} className="group cursor-pointer">
                <div className={`aspect-[3/4] rounded-2xl bg-gradient-to-b ${style.color} p-4 flex flex-col justify-end relative overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="relative z-10">
                    <h3 className="text-white font-semibold text-lg mb-1">{style.name}</h3>
                    <p className="text-white/70 text-xs">{style.mood}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3 text-center">{style.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-r from-[#D4768A] to-[#FFB6C1] p-8 md:p-12 text-center text-white">
            <Sparkles className="h-10 w-10 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              지금 바로 시작하세요
            </h2>
            <p className="text-white/90 mb-6 max-w-lg mx-auto">
              3분이면 완성되는 특별한 청첩장.
              <br />
              무료로 시안을 받아보세요.
            </p>
            <Link href="/create">
              <Button
                size="lg"
                className="bg-white text-[#D4768A] hover:bg-white/90 rounded-full px-8 h-14 text-lg font-semibold shadow-lg"
              >
                무료로 시안 받기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-4 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-[#D4768A] fill-[#D4768A]" />
            <span className="text-sm text-gray-600">청첩장AI</span>
          </div>
          <p className="text-xs text-gray-400">
            2025 청첩장AI. Made with love for brides-to-be
          </p>
        </div>
      </footer>
    </main>
  )
}
