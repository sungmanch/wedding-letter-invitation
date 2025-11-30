import { Metadata } from 'next'
import Link from 'next/link'
import { Heart, Sparkles, Palette, Share2, ArrowRight, User, LogIn } from 'lucide-react'
import { Button } from '@/components/ui'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: '모바일 청첩장 - AI가 만들어주는 나만의 청첩장',
  description: 'AI가 당신만의 특별한 청첩장을 디자인해드립니다. 대화하듯 쉽게 만들고, 카카오톡으로 바로 공유하세요.',
  keywords: ['모바일 청첩장', '청첩장 만들기', 'AI 청첩장', '웨딩 초대장', '결혼 청첩장'],
  openGraph: {
    title: '모바일 청첩장 - AI가 만들어주는 나만의 청첩장',
    description: 'AI가 당신만의 특별한 청첩장을 디자인해드립니다. 대화하듯 쉽게 만들고, 카카오톡으로 바로 공유하세요.',
    type: 'website',
    locale: 'ko_KR',
  },
}

export default async function WeddingLandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="flex min-h-screen flex-col bg-[#FFFBFC]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[#FFB6C1]/20 bg-[#FFFBFC]/80 backdrop-blur-sm">
        <div className="flex h-14 items-center justify-between px-4 max-w-screen-md mx-auto">
          <Link href="/" className="font-bold text-[#D4768A]">
            청모장 청첩장
          </Link>
          {user ? (
            <Link href="/my/invitations" className="flex items-center gap-1 text-sm text-charcoal/60 hover:text-charcoal">
              <User className="h-4 w-4" />
              내 청첩장
            </Link>
          ) : (
            <Link href="/login" className="flex items-center gap-1 text-sm text-charcoal/60 hover:text-charcoal">
              <LogIn className="h-4 w-4" />
              로그인
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6 flex items-center gap-2 rounded-full bg-[#FFB6C1]/20 px-4 py-2">
          <Sparkles className="h-4 w-4 text-[#D4768A]" />
          <span className="text-sm font-medium text-[#D4768A]">
            AI가 디자인하는 청첩장
          </span>
        </div>

        <h1 className="mb-4 text-3xl font-bold text-charcoal">
          대화하듯 쉽게,
          <br />
          <span className="text-[#D4768A]">나만의 청첩장</span>
        </h1>

        <p className="mb-8 text-base text-charcoal/60 max-w-xs">
          AI에게 원하는 스타일을 말해보세요.
          <br />
          5가지 시안 중 마음에 드는 걸 고르면 끝!
        </p>

        <Link href="/create">
          <Button
            size="lg"
            className="min-w-[200px] bg-[#D4768A] hover:bg-[#c4657a] text-white"
          >
            <Heart className="mr-2 h-5 w-5" />
            청첩장 만들기
          </Button>
        </Link>

        <p className="mt-4 text-xs text-charcoal/40">
          3분이면 완성되는 나만의 청첩장
        </p>
      </section>

      {/* Features Section */}
      <section className="bg-white px-4 py-12">
        <div className="max-w-screen-md mx-auto">
          <h2 className="mb-8 text-center text-xl font-semibold text-charcoal">
            이렇게 쉬워요
          </h2>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#D4768A] text-white">
                <span className="text-lg">💬</span>
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-charcoal">
                  1. 대화하듯 입력
                </h3>
                <p className="text-sm text-charcoal/60">
                  AI와 채팅하며 결혼 정보와 원하는 스타일을 알려주세요
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFB6C1] text-white">
                <Palette className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-charcoal">
                  2. 5가지 디자인 시안
                </h3>
                <p className="text-sm text-charcoal/60">
                  AI가 즉시 5개의 맞춤 디자인을 생성해드려요
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#D4AF37] text-white">
                <Share2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-charcoal">
                  3. 카카오톡으로 공유
                </h3>
                <p className="text-sm text-charcoal/60">
                  완성된 청첩장을 바로 친구들에게 공유하세요
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Design Gallery Preview */}
      <section className="px-4 py-12 bg-[#FFFBFC]">
        <div className="max-w-screen-md mx-auto">
          <h2 className="mb-2 text-center text-xl font-semibold text-charcoal">
            다양한 스타일
          </h2>
          <p className="mb-8 text-center text-sm text-charcoal/60">
            로맨틱, 모던, 클래식... 원하는 스타일을 말씀해주세요
          </p>

          {/* Design Preview Cards */}
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            <DesignPreviewCard
              theme="로맨틱"
              bgColor="#FFF0F5"
              accentColor="#FFB6C1"
            />
            <DesignPreviewCard
              theme="모던"
              bgColor="#F8F9FA"
              accentColor="#1F2937"
            />
            <DesignPreviewCard
              theme="클래식"
              bgColor="#FFFDF7"
              accentColor="#D4AF37"
            />
            <DesignPreviewCard
              theme="네이처"
              bgColor="#F0FFF4"
              accentColor="#48BB78"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-12 bg-white">
        <div className="max-w-screen-md mx-auto">
          <h2 className="mb-6 text-center text-xl font-semibold text-charcoal">
            청모장 청첩장만의 특별함
          </h2>

          <div className="grid gap-4">
            <div className="rounded-xl border border-[#FFB6C1]/30 bg-white p-4 shadow-sm">
              <p className="mb-1 font-medium text-charcoal">AI 맞춤 디자인</p>
              <p className="text-sm text-charcoal/60">
                원하는 분위기를 말하면 AI가 즉시 5가지 시안을 생성해요
              </p>
            </div>

            <div className="rounded-xl border border-[#FFB6C1]/30 bg-white p-4 shadow-sm">
              <p className="mb-1 font-medium text-charcoal">계좌번호 원터치 복사</p>
              <p className="text-sm text-charcoal/60">
                하객이 축의금 계좌를 쉽게 복사할 수 있어요
              </p>
            </div>

            <div className="rounded-xl border border-[#FFB6C1]/30 bg-white p-4 shadow-sm">
              <p className="mb-1 font-medium text-charcoal">축하 메시지 모아보기</p>
              <p className="text-sm text-charcoal/60">
                하객들의 진심 어린 축하 메시지를 한눈에 볼 수 있어요
              </p>
            </div>

            <div className="rounded-xl border border-[#FFB6C1]/30 bg-white p-4 shadow-sm">
              <p className="mb-1 font-medium text-charcoal">카카오톡 간편 공유</p>
              <p className="text-sm text-charcoal/60">
                예쁜 미리보기 카드와 함께 카카오톡으로 바로 공유해요
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-8">
        <div className="max-w-screen-md mx-auto">
          <div className="rounded-2xl bg-gradient-to-r from-[#D4768A] to-[#FFB6C1] p-6 text-center text-white">
            <h2 className="mb-2 text-lg font-semibold">
              지금 바로 시작하세요
            </h2>
            <p className="mb-4 text-sm opacity-90">
              특별한 청첩장을 3분 만에 완성할 수 있어요
            </p>
            <Link href="/create">
              <Button
                variant="outline"
                className="border-white bg-white text-[#D4768A] hover:bg-white/90"
              >
                청첩장 만들기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#FFB6C1]/20 px-4 py-6 text-center">
        <p className="text-xs text-charcoal/40">
          2025 청모장. Made with love for brides-to-be
        </p>
      </footer>
    </main>
  )
}

// Design Preview Card Component
function DesignPreviewCard({
  theme,
  bgColor,
  accentColor,
}: {
  theme: string
  bgColor: string
  accentColor: string
}) {
  return (
    <div
      className="flex-shrink-0 w-40 aspect-[3/4] rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm"
      style={{ backgroundColor: bgColor }}
    >
      <div className="text-3xl mb-2">💍</div>
      <p
        className="text-sm font-medium"
        style={{ color: accentColor }}
      >
        민수 & 수진
      </p>
      <p className="text-xs text-gray-500 mt-1">2025.05.24</p>
      <div
        className="w-8 h-0.5 mt-3"
        style={{ backgroundColor: accentColor }}
      />
      <p className="text-xs text-gray-400 mt-3">{theme}</p>
    </div>
  )
}
