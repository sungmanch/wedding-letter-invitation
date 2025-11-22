import Link from 'next/link'
import { Heart, Users, Utensils, Mail, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-12 text-center">
        <div className="mb-6 flex items-center gap-2 rounded-full bg-blush-pink-50 px-4 py-2">
          <Sparkles className="h-4 w-4 text-blush-pink" />
          <span className="text-sm font-medium text-blush-pink">
            예비 신부를 위한 서비스
          </span>
        </div>

        <h1 className="mb-4 text-3xl font-bold text-charcoal">
          <span className="text-gradient">청모장</span>
        </h1>

        <p className="mb-2 text-lg font-medium text-charcoal">
          청첩장 모임 준비, 이제 쉽게!
        </p>

        <p className="mb-8 text-sm text-charcoal/60">
          URL 하나로 친구들 취향을 모아
          <br />
          완벽한 식당과 소중한 편지를 받아보세요
        </p>

        <Link href="/create">
          <Button size="lg" fullWidth className="max-w-xs">
            <Heart className="mr-2 h-5 w-5" />
            청모장 만들기
          </Button>
        </Link>

        <p className="mt-4 text-xs text-charcoal/40">
          가입 없이 바로 시작할 수 있어요
        </p>
      </section>

      {/* How It Works Section */}
      <section className="bg-cream/50 px-4 py-10">
        <h2 className="mb-8 text-center text-lg font-semibold text-charcoal">
          이렇게 사용해요
        </h2>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blush-pink text-white">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-charcoal">
                1. 링크 공유
              </h3>
              <p className="text-sm text-charcoal/60">
                청모장을 만들고 친구들에게 설문 링크를 공유하세요
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-soft-gold text-white">
              <Utensils className="h-5 w-5" />
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-charcoal">
                2. 식당 추천
              </h3>
              <p className="text-sm text-charcoal/60">
                친구들의 취향을 분석해 최적의 식당을 추천받으세요
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blush-pink text-white">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-charcoal">
                3. 편지 열람
              </h3>
              <p className="text-sm text-charcoal/60">
                친구들이 남긴 축하 편지를 카드로 감상하세요
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-10">
        <h2 className="mb-6 text-center text-lg font-semibold text-charcoal">
          청모장의 특별함
        </h2>

        <div className="grid gap-4">
          <div className="rounded-xl border border-cream bg-white p-4 shadow-sm">
            <p className="mb-1 font-medium text-charcoal">취향 기반 식당 추천</p>
            <p className="text-sm text-charcoal/60">
              모든 친구의 음식 취향, 알레르기, 가격대를 분석해 최적의 식당을 찾아드려요
            </p>
          </div>

          <div className="rounded-xl border border-cream bg-white p-4 shadow-sm">
            <p className="mb-1 font-medium text-charcoal">축하 편지 보관함</p>
            <p className="text-sm text-charcoal/60">
              설문과 함께 작성된 진심 어린 축하 메시지를 영구적으로 보관해요
            </p>
          </div>

          <div className="rounded-xl border border-cream bg-white p-4 shadow-sm">
            <p className="mb-1 font-medium text-charcoal">예쁜 청모장 공유</p>
            <p className="text-sm text-charcoal/60">
              확정된 모임 정보를 예쁜 디자인으로 친구들에게 공유할 수 있어요
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 pb-8">
        <div className="rounded-2xl bg-gradient-to-r from-blush-pink to-soft-gold p-6 text-center text-white">
          <h2 className="mb-2 text-lg font-semibold">
            지금 바로 시작하세요
          </h2>
          <p className="mb-4 text-sm opacity-90">
            3분이면 청모장을 만들 수 있어요
          </p>
          <Link href="/create">
            <Button
              variant="outline"
              className="border-white bg-white text-blush-pink hover:bg-white/90"
            >
              시작하기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cream px-4 py-6 text-center">
        <p className="text-xs text-charcoal/40">
          2025 청모장. Made with love for brides-to-be
        </p>
      </footer>
    </main>
  )
}
