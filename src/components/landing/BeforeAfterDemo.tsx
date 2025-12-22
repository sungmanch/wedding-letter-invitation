'use client'

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

/**
 * BeforeAfterDemo - Shows reference image → AI generated result
 * Demonstrates "이런 느낌으로 만들어줘" workflow
 */
export function BeforeAfterDemo() {
  return (
    <section className="pt-6 sm:pt-10 pb-12 sm:pb-16 bg-[var(--ivory-100)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-8 sm:mb-10">
          <h2
            className="text-xl sm:text-2xl md:text-3xl text-[var(--text-primary)] mb-2"
            style={{ fontFamily: 'Noto Serif KR, serif' }}
          >
            <span className="text-[var(--sage-600)]">&ldquo;이런 느낌으로&rdquo;</span> 하면 끝
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-muted)]">
            참고 이미지를 보여주면, AI가 비슷한 스타일로 만들어드립니다
          </p>
        </div>

        {/* Before → After */}
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-12">
            {/* Before: Reference Image */}
            <div className="flex-shrink-0 w-full sm:w-auto">
              <div className="relative mx-auto w-[200px] sm:w-[220px] lg:w-[260px]">
                {/* Phone Frame */}
                <div className="bg-[var(--sand-200)] rounded-[2rem] p-1 shadow-xl">
                  <div className="w-full aspect-[9/16] rounded-[1.75rem] overflow-hidden bg-gray-100 relative">
                    <Image
                      src="/examples/images/example_wedding_image5.png"
                      alt="Reference wedding invitation"
                      fill
                      className="object-cover"
                    />
                    {/* Overlay label */}
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/60 rounded-md backdrop-blur-sm">
                      <span className="text-xs text-white font-medium">레퍼런스</span>
                    </div>
                  </div>
                </div>
                {/* Caption */}
                <p className="text-center mt-3 text-sm text-[var(--text-muted)]">Pinterest에서 찾은 디자인</p>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center py-2 sm:py-0">
              {/* Mobile: Vertical arrow */}
              <div className="sm:hidden flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[var(--sage-100)] flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-[var(--sage-600)] rotate-90" />
                </div>
                <span className="text-xs text-[var(--sage-600)] font-medium mt-1">AI 생성</span>
              </div>
              {/* Desktop: Horizontal arrow */}
              <div className="hidden sm:flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[var(--sage-100)] flex items-center justify-center animate-pulse">
                  <ArrowRight className="w-6 h-6 text-[var(--sage-600)]" />
                </div>
                <span className="text-xs text-[var(--sage-600)] font-medium mt-2">AI 생성</span>
              </div>
            </div>

            {/* After: Generated Result */}
            <div className="flex-shrink-0 w-full sm:w-auto">
              <div className="relative mx-auto w-[200px] sm:w-[220px] lg:w-[260px]">
                {/* Phone Frame */}
                <div className="bg-[var(--sand-200)] rounded-[2rem] p-1 shadow-xl">
                  <div className="w-full aspect-[9/16] rounded-[1.75rem] overflow-hidden relative">
                    {/* Generated invitation mockup */}
                    <div className="w-full h-full bg-[#0A0A0A] relative">
                      <Image
                        src="/examples/images/example_wedding_image5.png"
                        alt="AI generated invitation"
                        fill
                        className="object-cover"
                      />
                      {/* Gradient overlay */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            'linear-gradient(to bottom, rgba(10,10,10,0.4) 0%, transparent 30%, transparent 50%, rgba(10,10,10,0.9) 100%)',
                        }}
                      />
                      {/* Top text */}
                      <div className="absolute top-5 left-0 right-0 text-center z-10">
                        <h3
                          className="text-lg tracking-[0.2em] text-white"
                          style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600 }}
                        >
                          WITH LOVE
                        </h3>
                        <p className="text-[9px] tracking-[0.15em] text-white/60 mt-1">MAY 2025</p>
                      </div>
                      {/* Bottom text */}
                      <div className="absolute bottom-14 left-0 right-0 text-center px-4 z-10">
                        <h2
                          className="text-xl leading-tight text-white"
                          style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600 }}
                        >
                          민수
                          <span className="block text-sm my-1 text-[#C9A962]">&</span>
                          수진
                        </h2>
                      </div>
                      <div className="absolute bottom-5 left-0 right-0 text-center z-10">
                        <p
                          className="text-[8px] tracking-wider text-white/50"
                          style={{ fontFamily: 'Cormorant Garamond, serif' }}
                        >
                          THE LOVE STORY CONTINUES
                        </p>
                      </div>
                    </div>
                    {/* Overlay label */}
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-white/80 rounded-md backdrop-blur-sm">
                      <span className="text-xs text-[var(--text-primary)] font-medium">AI 생성 결과</span>
                    </div>
                  </div>
                </div>
                {/* Caption */}
                <p className="text-center mt-3 text-sm text-[var(--text-muted)]">
                  &ldquo;이런 느낌으로 만들어줘&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
