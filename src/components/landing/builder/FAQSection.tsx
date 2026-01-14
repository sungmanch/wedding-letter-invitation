'use client'

/**
 * FAQ Section
 *
 * 자주 묻는 질문 섹션
 * - 커스텀 Accordion (framer-motion)
 * - 5가지 FAQ 항목
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'

// ============================================
// Constants
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

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-[var(--bg-warm)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        {/* 섹션 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--blush-100)] text-[var(--blush-600)] text-sm font-medium mb-4">
            <HelpCircle className="w-4 h-4" />
            자주 묻는 질문
          </span>
          <h2
            className="text-3xl sm:text-4xl font-medium text-[var(--text-primary)]"
            style={{ fontFamily: 'var(--font-display), serif' }}
          >
            궁금한 점이 있으신가요?
          </h2>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-3"
        >
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index

            return (
              <div key={index} className="group">
                {/* Question Header */}
                <button
                  onClick={() => toggleItem(index)}
                  className={`
                    w-full flex items-center justify-between px-6 py-4 bg-white
                    border border-[var(--warm-100)] hover:border-[var(--blush-200)]
                    transition-colors text-left
                    ${isOpen ? 'rounded-t-xl border-b-0' : 'rounded-xl'}
                  `}
                >
                  <span className="text-[var(--text-primary)] font-medium pr-4">
                    {item.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0" />
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
                      <div className="px-6 py-4 bg-white border border-t-0 border-[var(--warm-100)] rounded-b-xl">
                        <p className="text-[var(--text-muted)] leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
