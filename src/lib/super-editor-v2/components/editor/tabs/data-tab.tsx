'use client'

/**
 * Super Editor v2 - Data Tab
 *
 * 공유 데이터 관리 탭
 * - 혼주 정보 (테이블)
 * - 예식 정보 (날짜, 시간)
 * - 예식장 정보
 */

import { useCallback } from 'react'
import type { WeddingData, VariablePath } from '../../../schema/types'
import { FamilyTableField } from '../fields/family-table-field'
import { LocationSearchField } from '../fields/location-search-field'

// ============================================
// Types
// ============================================

export interface DataTabProps {
  /** WeddingData */
  data: WeddingData
  /** 데이터 업데이트 콜백 */
  onDataChange?: (data: WeddingData) => void
  /** 추가 className */
  className?: string
}

// ============================================
// Component
// ============================================

export function DataTab({
  data,
  onDataChange,
  className = '',
}: DataTabProps) {
  // 단일 필드 변경
  const handleFieldChange = useCallback((path: VariablePath, value: unknown) => {
    if (!onDataChange) return
    const newData = setNestedValue(data, path, value)
    onDataChange(newData)
  }, [data, onDataChange])

  // 위치 정보 일괄 변경
  const handleLocationChange = useCallback((address: string, lat: number, lng: number) => {
    if (!onDataChange) return

    const naverUrl = `https://map.naver.com/v5/?c=${lng},${lat},15,0,0,0,dh`
    const kakaoUrl = `https://map.kakao.com/link/map/${lat},${lng}`
    const tmapUrl = `https://apis.openapi.sk.com/tmap/app/routes?goalx=${lng}&goaly=${lat}`

    const newVenue = {
      ...data.venue,
      address,
      lat,
      lng,
      naverUrl,
      kakaoUrl,
      tmapUrl,
    }
    const newData = { ...data, venue: newVenue }
    onDataChange(newData)
  }, [data, onDataChange])

  return (
    <div className={`flex flex-col p-4 space-y-6 ${className}`}>
      {/* 섹션 1: 혼주 정보 */}
      <Section title="혼주 정보" icon="👨‍👩‍👧‍👦">
        <FamilyTableField
          data={data}
          onFieldChange={handleFieldChange}
          visibleColumns={['name', 'nameEn', 'phone', 'deceased', 'birthOrder', 'baptismalName']}
        />
      </Section>

      {/* 섹션 2: 예식 정보 */}
      <Section title="예식 정보" icon="💒">
        <div className="space-y-4">
          <FieldRow label="예식 날짜">
            <input
              type="date"
              value={data.wedding?.date ?? ''}
              onChange={(e) => handleFieldChange('wedding.date', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[var(--sand-200)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--sage-500)]"
            />
          </FieldRow>

          <FieldRow label="예식 시간">
            <input
              type="time"
              value={data.wedding?.time ?? ''}
              onChange={(e) => handleFieldChange('wedding.time', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[var(--sand-200)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--sage-500)]"
            />
          </FieldRow>
        </div>
      </Section>

      {/* 섹션 3: 예식장 정보 */}
      <Section title="예식장 정보" icon="📍">
        <div className="space-y-4">
          <FieldRow label="예식장 이름">
            <input
              type="text"
              value={data.venue?.name ?? ''}
              onChange={(e) => handleFieldChange('venue.name', e.target.value)}
              placeholder="○○웨딩홀"
              className="w-full px-3 py-2 bg-white border border-[var(--sand-200)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--sage-500)]"
            />
          </FieldRow>

          <FieldRow label="홀 이름">
            <input
              type="text"
              value={data.venue?.hall ?? ''}
              onChange={(e) => handleFieldChange('venue.hall', e.target.value)}
              placeholder="그랜드홀 5층"
              className="w-full px-3 py-2 bg-white border border-[var(--sand-200)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--sage-500)]"
            />
          </FieldRow>

          <FieldRow label="주소">
            <LocationSearchField
              value={data.venue?.address ?? ''}
              lat={data.venue?.lat}
              lng={data.venue?.lng}
              onLocationChange={handleLocationChange}
            />
          </FieldRow>

          <FieldRow label="전화번호">
            <input
              type="tel"
              value={data.venue?.tel ?? ''}
              onChange={(e) => handleFieldChange('venue.tel', e.target.value)}
              placeholder="02-1234-5678"
              className="w-full px-3 py-2 bg-white border border-[var(--sand-200)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--sage-500)]"
            />
          </FieldRow>
        </div>
      </Section>
    </div>
  )
}

// ============================================
// Sub Components
// ============================================

interface SectionProps {
  title: string
  icon?: string
  children: React.ReactNode
}

function Section({ title, icon, children }: SectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
        {icon && <span>{icon}</span>}
        {title}
      </h3>
      <div className="bg-[var(--ivory-50)] rounded-lg p-4">
        {children}
      </div>
    </div>
  )
}

interface FieldRowProps {
  label: string
  children: React.ReactNode
}

function FieldRow({ label, children }: FieldRowProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-[var(--text-body)]">
        {label}
      </label>
      {children}
    </div>
  )
}

// ============================================
// Utility
// ============================================

function setNestedValue<T extends object>(
  obj: T,
  path: string,
  value: unknown
): T {
  const keys = path.split('.')

  function setAt(current: Record<string, unknown>, keyIndex: number): Record<string, unknown> {
    const key = keys[keyIndex]

    if (keyIndex === keys.length - 1) {
      return { ...current, [key]: value }
    }

    const nextValue = current[key]
    const nextObj = (typeof nextValue === 'object' && nextValue !== null)
      ? nextValue as Record<string, unknown>
      : {}

    return {
      ...current,
      [key]: setAt(nextObj, keyIndex + 1),
    }
  }

  return setAt(obj as Record<string, unknown>, 0) as T
}
