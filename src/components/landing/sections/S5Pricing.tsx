'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { Check, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui'

const BENEFITS = [
  '평생 소장',
  '무제한 수정',
  '실시간 프리뷰',
  '11가지 스타일',
  '하객 메시지 수집',
  'AI 디자인 생성',
]

export function S5Pricing() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-[#0A0806] flex items-center justify-center py-20 px-4"
    >
      <div
        className={`max-w-md w-full transition-all duration-700 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
      >
        {/* Pricing Card */}
        <div className="relative bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] rounded-3xl p-8 border border-[#C9A962]/20 shadow-2xl animate-card-float">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#C9A962]/20 to-[#8B2635]/20 rounded-3xl blur-xl opacity-50" />

          {/* Card Content */}
          <div className="relative">
            {/* Badge */}
            <div className="flex items-center gap-2 mb-6">
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-[#8B2635] text-[#F5E6D3] text-xs rounded-full">
                <Sparkles className="w-3 h-3" />
                PREMIUM
              </div>
              <span className="text-xs text-[#C9A962]">50% OFF</span>
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-xl text-[#F5E6D3]/40 line-through decoration-[#8B2635] decoration-2">
                  100,000원
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-bold text-[#C9A962]">50,000</span>
                <span className="text-lg text-[#F5E6D3]/60">원</span>
              </div>
              <p className="text-sm text-[#F5E6D3]/50 mt-2">1회 결제, 평생 이용</p>
            </div>

            {/* Benefits */}
            <ul className="space-y-3 mb-8">
              {BENEFITS.map((benefit, i) => (
                <li
                  key={benefit}
                  className={`flex items-center gap-3 text-[#F5E6D3] transition-all duration-300 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}
                  style={{ transitionDelay: `${(i + 1) * 100}ms` }}
                >
                  <div className="w-5 h-5 rounded-full bg-[#C9A962]/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-[#C9A962]" />
                  </div>
                  <span className="text-sm">{benefit}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <Link href="/create" className="block">
              <Button className="w-full bg-[#C9A962] hover:bg-[#B8A052] text-[#0A0806] h-14 rounded-xl text-lg font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]">
                시작하기
              </Button>
            </Link>

            {/* Trust Badge */}
            <p className="text-center text-[#F5E6D3]/40 text-sm mt-4">
              결제 전 시안 확인은 무료
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-[#F5E6D3]/40 text-xs">
            안전한 결제 | 즉시 이용 가능 | 환불 정책 적용
          </p>
        </div>
      </div>
    </section>
  )
}
