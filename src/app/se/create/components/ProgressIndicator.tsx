'use client'

/**
 * ProgressIndicator - 진행 상황 인디케이터
 * Stage 2 (AI 채팅) 프리뷰 아래에 표시
 * 기본 섹션 + 확장 섹션 포함
 */

import type { BasicInfoData } from './BasicInfoForm'
import type { CollectedData } from '../hooks/useLettyConversation'

interface ProgressIndicatorProps {
  basicInfo: BasicInfoData
  collectedData?: Partial<CollectedData>
}

interface IndicatorItem {
  key: string
  label: string
  isComplete: boolean
}

// 기본 섹션 (Create에서 수집)
interface CreateSection {
  key: string
  label: string
  getComplete: (basicInfo: BasicInfoData, collectedData?: Partial<CollectedData>) => boolean
}

const CREATE_SECTIONS: CreateSection[] = [
  {
    key: 'names',
    label: '이름',
    getComplete: (bi) => !!(bi.groomName && bi.brideName && bi.groomName.length >= 2 && bi.brideName.length >= 2),
  },
  {
    key: 'date',
    label: '날짜',
    getComplete: (bi) => !!bi.weddingDate,
  },
  {
    key: 'time',
    label: '시간',
    getComplete: (bi) => !!bi.weddingTime,
  },
  {
    key: 'venue',
    label: '장소',
    getComplete: (bi) => !!(bi.venueName && bi.venueName.length >= 2),
  },
  {
    key: 'mood',
    label: '분위기',
    getComplete: (_, cd) => !!(cd?.moods && cd.moods.length > 0),
  },
  {
    key: 'color',
    label: '색상',
    getComplete: (_, cd) => !!(cd?.color || cd?.customColor),
  },
]

// Edit에서 추가하는 섹션 (기본 + 확장)
const EDIT_SECTIONS = {
  basic: ['혼주', '주소', '사진', '계좌', '연락처'],
  extended: ['갤러리', '영상', 'Q&A', 'RSVP', '교통'],
}

export function ProgressIndicator({ basicInfo, collectedData }: ProgressIndicatorProps) {
  // 항목별 완료 여부 계산
  const items: IndicatorItem[] = CREATE_SECTIONS.map((section) => ({
    key: section.key,
    label: section.label,
    isComplete: section.getComplete(basicInfo, collectedData),
  }))

  const completedCount = items.filter((item) => item.isComplete).length
  const totalCount = items.length

  return (
    <div className="w-full pt-4 border-t border-[var(--sand-200)]">
      {/* Row 1: Create 단계 인디케이터 */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        {items.map((item) => (
          <div key={item.key} className="flex items-center gap-1.5">
            {/* 원형 인디케이터 */}
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                item.isComplete
                  ? 'bg-[var(--sage-500)] scale-100'
                  : 'border border-[var(--sand-300)] bg-transparent'
              }`}
              style={{
                animation: item.isComplete ? 'indicator-complete 0.3s ease-out' : undefined,
              }}
            />
            {/* 라벨 */}
            <span
              className={`text-[13px] transition-colors duration-300 ${
                item.isComplete ? 'text-[var(--text-body)]' : 'text-[var(--text-muted)]'
              }`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Row 2: Edit에서 추가하는 섹션 안내 */}
      <div className="mt-3 text-center">
        <p className="text-xs text-[var(--text-light)]">
          <span className="text-[var(--sage-600)]">Edit</span>에서 추가 →{' '}
          {EDIT_SECTIONS.basic.join(' · ')}
        </p>
        <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
          확장 섹션: {EDIT_SECTIONS.extended.join(' · ')}
        </p>
      </div>

      {/* 진행률 */}
      <p className="text-[10px] text-[var(--text-muted)] text-center mt-2">
        {completedCount}/{totalCount} 완료
      </p>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes indicator-complete {
          0% {
            transform: scale(0.8);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}
