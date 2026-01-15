'use client'

/**
 * Mobile FAQ Section
 *
 * 모바일 전용 FAQ 섹션
 * - 간결한 아코디언 UI
 * - 터치 친화적 탭 영역
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'

// ============================================
// Constants (데스크탑과 공유)
// ============================================

const FAQ_ITEMS = [
  {
    question: '평생 링크를 소장할 수 있나요?',
    answer: '네, 한 번 발행된 청첩장 링크는 영구적으로 유지됩니다.',
  },
  {
    question: '갤러리 사진 확대를 방지할 수 있나요?',
    answer: '네, 핀치 확대와 더블탭 확대를 방지하는 보호 기능을 제공합니다.',
  },
  {
    question: '카카오페이로 축의금 송금 가능한가요?',
    answer: '네, 카카오페이 송금 링크를 청첩장에 추가할 수 있습니다.',
  },
  {
    question: '지도앱으로 바로 연동 가능한가요?',
    answer: '네, 네이버맵, 카카오맵, 티맵 연동을 지원합니다.',
  },
  {
    question: '원하는 디자인이 없는데, 따로 제작도 가능한가요?',
    answer: '네, 원하시는 디자인을 요청해주시면 제작해드립니다.',
  },
]

// ============================================
// Component
// ============================================

export function MobileFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="px-4 py-8 bg-gradient-to-b from-white/50 to-[var(--bg-warm)]">
      {/* 섹션 헤더 */}
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--blush-100)] text-[var(--blush-600)] text-xs font-medium mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          자주 묻는 질문
        </span>
        <h2
          className="text-xl font-medium text-[var(--text-primary)]"
          style={{ fontFamily: 'var(--font-display), serif' }}
        >
          궁금한 점이 있으신가요?
        </h2>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-2">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openIndex === index

          return (
            <div key={index}>
              {/* Question Header */}
              <button
                onClick={() => toggleItem(index)}
                className={`
                  w-full flex items-center justify-between px-4 py-3.5 bg-white
                  border border-[var(--warm-100)] active:bg-[var(--warm-50)]
                  transition-colors text-left
                  ${isOpen ? 'rounded-t-xl border-b-0' : 'rounded-xl'}
                `}
              >
                <span className="text-sm text-[var(--text-primary)] font-medium pr-3 leading-snug">
                  {item.question}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
                </motion.div>
              </button>

              {/* Answer Content */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 py-3 bg-white border border-t-0 border-[var(--warm-100)] rounded-b-xl">
                      <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}
