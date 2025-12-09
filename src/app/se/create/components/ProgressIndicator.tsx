'use client'

/**
 * ProgressIndicator - 진행 상황 인디케이터
 * 인트로 프리뷰 아래에 표시되어 입력 완료 항목을 시각화
 */

import type { BasicInfoData } from './BasicInfoForm'
import type { CollectedData } from '../hooks/useLettyConversation'

interface ProgressIndicatorProps {
  basicInfo: BasicInfoData
  collectedData?: Partial<CollectedData>
  stage: 'form' | 'chat'
}

interface IndicatorItem {
  key: string
  label: string
  isComplete: boolean
}

export function ProgressIndicator({ basicInfo, collectedData, stage }: ProgressIndicatorProps) {
  // 항목별 완료 여부 계산
  const items: IndicatorItem[] = [
    {
      key: 'names',
      label: '이름',
      isComplete: !!(basicInfo.groomName && basicInfo.brideName && basicInfo.groomName.length >= 2 && basicInfo.brideName.length >= 2),
    },
    {
      key: 'date',
      label: '날짜',
      isComplete: !!basicInfo.weddingDate,
    },
    {
      key: 'time',
      label: '시간',
      isComplete: !!basicInfo.weddingTime,
    },
    {
      key: 'venue',
      label: '장소',
      isComplete: !!(basicInfo.venueName && basicInfo.venueName.length >= 2),
    },
    {
      key: 'mood',
      label: '분위기',
      isComplete: stage === 'chat' && !!(collectedData?.moods && collectedData.moods.length > 0),
    },
    {
      key: 'color',
      label: '색상',
      isComplete: stage === 'chat' && !!(collectedData?.color || collectedData?.customColor),
    },
  ]

  const completedCount = items.filter(item => item.isComplete).length
  const totalCount = items.length

  return (
    <div className="w-full pt-4 border-t border-[var(--sand-200)]">
      {/* Row 1: 인디케이터 */}
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

      {/* Row 2: Edit 안내 */}
      <p className="text-xs text-[var(--text-light)] text-center mt-3">
        Edit에서 추가 → 혼주 · 주소 · 사진 · 계좌
      </p>

      {/* 진행률 텍스트 (선택적) */}
      <p className="text-[10px] text-[var(--text-muted)] text-center mt-1">
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
