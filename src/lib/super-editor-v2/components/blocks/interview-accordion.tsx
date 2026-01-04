'use client'

/**
 * Interview Accordion Component
 *
 * 신랑/신부 인터뷰 Q&A를 아코디언 형태로 표시
 * - 펼침/접힘 토글 버튼
 * - Q&A 리스트 (질문 + 신랑/신부 답변)
 * - interview.items 데이터 기반 동적 렌더링
 */

import { useState, type CSSProperties } from 'react'
import type { InterviewItem } from '../../schema/types'
import { useDocument } from '../../context/document-context'
import { useBlockTokens } from '../../context/block-context'

// ============================================
// Types
// ============================================

export interface InterviewAccordionProps {
  /** 아코디언 제목 */
  title?: string
  className?: string
}

// ============================================
// Main Component
// ============================================

export function InterviewAccordion({
  title = '두 사람의 인터뷰 읽어보기',
  className,
}: InterviewAccordionProps) {
  const { document } = useDocument()
  const tokens = useBlockTokens()
  const [isOpen, setIsOpen] = useState(false)

  // 인터뷰 데이터
  const interviewItems = document?.data?.interview?.items ?? []
  const groomName = document?.data?.couple?.groom?.name ?? '신랑'
  const brideName = document?.data?.couple?.bride?.name ?? '신부'

  // 빈 상태
  if (interviewItems.length === 0) {
    return null
  }

  return (
    <div
      className={className}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      data-component="interview-accordion"
    >
      {/* Accordion Header (Toggle Button) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '16px 20px',
          backgroundColor: tokens.bgCard,
          border: `1px solid ${tokens.borderDefault}`,
          borderRadius: isOpen ? '8px 8px 0 0' : '8px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        aria-expanded={isOpen}
      >
        <span
          style={{
            fontSize: '14px',
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            color: tokens.fgDefault,
          }}
        >
          {title}
        </span>
        <ChevronIcon isOpen={isOpen} color={tokens.fgMuted} />
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: tokens.bgCard,
            border: `1px solid ${tokens.borderDefault}`,
            borderTop: 'none',
            borderRadius: '0 0 8px 8px',
            padding: '24px 20px',
          }}
        >
          {interviewItems.map((item, index) => (
            <InterviewQA
              key={index}
              item={item}
              questionNumber={index + 1}
              groomName={groomName}
              brideName={brideName}
              tokens={tokens}
              isLast={index === interviewItems.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// Interview Q&A Item Component
// ============================================

interface InterviewQAProps {
  item: InterviewItem
  questionNumber: number
  groomName: string
  brideName: string
  tokens: ReturnType<typeof useBlockTokens>
  isLast: boolean
}

function InterviewQA({
  item,
  questionNumber,
  groomName,
  brideName,
  tokens,
  isLast,
}: InterviewQAProps) {
  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    paddingBottom: isLast ? 0 : '24px',
    marginBottom: isLast ? 0 : '24px',
    borderBottom: isLast ? 'none' : `1px solid ${tokens.borderMuted}`,
  }

  const questionStyle: CSSProperties = {
    fontSize: '15px',
    fontFamily: 'var(--font-heading)',
    fontWeight: 600,
    color: tokens.fgDefault,
    lineHeight: 1.5,
  }

  return (
    <div style={containerStyle}>
      {/* Question */}
      <div style={questionStyle}>
        Q{questionNumber}. {item.question}
      </div>

      {/* Groom Answer */}
      <AnswerBlock
        label={`신랑 ${groomName}`}
        answer={item.groomAnswer}
        iconColor={tokens.accentDefault}
        tokens={tokens}
      />

      {/* Bride Answer */}
      <AnswerBlock
        label={`신부 ${brideName}`}
        answer={item.brideAnswer}
        iconColor={tokens.accentDefault}
        tokens={tokens}
      />
    </div>
  )
}

// ============================================
// Answer Block Component
// ============================================

interface AnswerBlockProps {
  label: string
  answer: string
  iconColor: string
  tokens: ReturnType<typeof useBlockTokens>
}

function AnswerBlock({ label, answer, iconColor, tokens }: AnswerBlockProps) {
  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  }

  const labelStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    color: iconColor,
  }

  const answerStyle: CSSProperties = {
    fontSize: '14px',
    fontFamily: 'var(--font-body)',
    fontWeight: 400,
    color: tokens.fgDefault,
    lineHeight: 1.7,
    whiteSpace: 'pre-wrap',
  }

  return (
    <div style={containerStyle}>
      <div style={labelStyle}>
        <HeartIcon color={iconColor} />
        {label}
      </div>
      <div style={answerStyle}>{answer}</div>
    </div>
  )
}

// ============================================
// Icons
// ============================================

function ChevronIcon({ isOpen, color }: { isOpen: boolean; color: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.2s ease',
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function HeartIcon({ color }: { color: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill={color}
      stroke="none"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

export default InterviewAccordion
