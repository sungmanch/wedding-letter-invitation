'use client'

/**
 * Super Editor v2 - Data Tab
 *
 * 모든 데이터 입력을 섹션별로 그룹화하여 표시
 * - 공유 데이터 (혼주, 예식, 예식장) - 상단 고정
 * - 블록별 데이터 (enabled 블록만) - 아코디언 형태
 */

import { useState, useCallback, useMemo } from 'react'
import type { EditorDocument, Block, WeddingData, VariablePath, RsvpConfig } from '../../../schema/types'
import { FamilyTableField } from '../fields/family-table-field'
import { LocationSearchField } from '../fields/location-search-field'
import { VariableField } from '../fields/variable-field'
import { extractEditableFields, setNestedValue } from '../../../utils/field-extractor'
import { isSharedField, BLOCK_TYPE_ICONS } from '../../../config/variable-field-config'
import { BLOCK_TYPE_LABELS } from '../editor-panel'
import { resolveBinding } from '../../../utils/binding-resolver'

// ============================================
// Types
// ============================================

export interface DataTabProps {
  /** 문서 데이터 */
  document: EditorDocument
  /** 데이터 업데이트 콜백 */
  onDataChange?: (data: WeddingData) => void
  /** 블록 업데이트 콜백 */
  onBlocksChange?: (blocks: Block[]) => void
  /** 이미지 업로드 핸들러 */
  onUploadImage?: (file: File) => Promise<string>
  /** 펼쳐진 섹션 ID */
  expandedSection?: string | null
  /** 펼침 상태 변경 콜백 */
  onExpandedSectionChange?: (sectionId: string | null) => void
  /** 추가 className */
  className?: string
}

// ============================================
// Component
// ============================================

export function DataTab({
  document,
  onDataChange,
  onBlocksChange,
  onUploadImage,
  expandedSection,
  onExpandedSectionChange,
  className = '',
}: DataTabProps) {
  const data = document.data

  // 로컬 펼침 상태 (외부 제어가 없을 경우)
  const [localExpanded, setLocalExpanded] = useState<string | null>(null)
  const expanded = expandedSection ?? localExpanded
  const setExpanded = onExpandedSectionChange ?? setLocalExpanded

  // 단일 필드 변경
  const handleFieldChange = useCallback(
    (path: VariablePath, value: unknown) => {
      if (!onDataChange) return
      const newData = setNestedValue(data, path, value)
      onDataChange(newData)
    },
    [data, onDataChange]
  )

  // 위치 정보 일괄 변경
  const handleLocationChange = useCallback(
    (address: string, lat: number, lng: number) => {
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
    },
    [data, onDataChange]
  )

  // 계좌 정보 일괄 변경
  const handleAccountsChange = useCallback(
    (accounts: WeddingData['accounts']) => {
      if (!onDataChange) return
      const newData = { ...data, accounts }
      onDataChange(newData)
    },
    [data, onDataChange]
  )

  // 활성화된 블록만 필터링
  const enabledBlocks = useMemo(
    () => document.blocks.filter((block) => block.enabled),
    [document.blocks]
  )

  // 섹션 토글
  const handleToggle = useCallback(
    (sectionId: string) => {
      setExpanded(expanded === sectionId ? null : sectionId)
    },
    [expanded, setExpanded]
  )

  // 날짜/시간 표시 언어 감지
  const dateTimeLocale = useMemo(() => {
    for (const block of document.blocks) {
      for (const element of block.elements) {
        // TextProps만 format 속성이 있음
        const format = element.props?.type === 'text'
          ? (element.props as { format?: string }).format
          : undefined
        const binding = element.binding as string | undefined

        // 영어 바인딩이 있으면 'en' (모든 영어 변형 포함)
        if (format?.includes('weekdayEn}') || format?.includes('timeDisplayEn}') || format?.includes('timeDisplayEnLower}') ||
            binding?.includes('weekdayEn') || binding?.includes('timeDisplayEn') || binding?.includes('timeDisplayEnLower')) {
          return 'en'
        }
        // 한국어 바인딩이 있으면 'ko' (영어가 아닌 weekday 또는 timeDisplay)
        // weekday}와 weekdayEn}를 구분하기 위해 정확히 매칭
        if ((format?.includes('{wedding.weekday}') || format?.includes('{wedding.timeDisplay}')) ||
            binding === 'wedding.weekday' || binding === 'wedding.timeDisplay') {
          return 'ko'
        }
      }
    }
    return 'ko' // 기본값
  }, [document.blocks])

  // 날짜/시간 언어 변경
  const handleDateTimeLocaleChange = useCallback((locale: 'ko' | 'en') => {
    console.log('[DateTimeLocale] Changing to:', locale, 'onBlocksChange:', !!onBlocksChange)
    if (!onBlocksChange) {
      console.warn('[DateTimeLocale] onBlocksChange is not provided!')
      return
    }

    // 한국어 → 영어 매핑
    const koToEn: Record<string, string> = {
      'wedding.weekday': 'wedding.weekdayEn',
      'wedding.timeDisplay': 'wedding.timeDisplayEn',
    }
    // 영어 → 한국어 매핑 (모든 영어 변형 포함)
    const enToKo: Record<string, string> = {
      'wedding.weekdayEn': 'wedding.weekday',
      'wedding.timeDisplayEn': 'wedding.timeDisplay',
      'wedding.timeDisplayEnLower': 'wedding.timeDisplay', // 소문자 영어 변형도 포함
    }
    const mapping = locale === 'en' ? koToEn : enToKo

    const newBlocks = document.blocks.map(block => ({
      ...block,
      elements: block.elements.map(element => {
        let newElement = { ...element }

        // binding 변환
        if (element.binding && mapping[element.binding as string]) {
          newElement = { ...newElement, binding: mapping[element.binding as string] as typeof element.binding }
        }

        // format 문자열 내 바인딩 변환 (TextProps만)
        // format은 "{wedding.weekdayEn}" 형태이므로 중괄호 포함해서 매칭
        if (element.props?.type === 'text') {
          const textProps = element.props as { format?: string; type: 'text' }
          if (textProps.format) {
            let newFormat = textProps.format
            for (const [from, to] of Object.entries(mapping)) {
              // {wedding.weekdayEn} → {wedding.weekday} 형태로 변환
              const pattern = `\\{${from.replace(/\./g, '\\.')}\\}`
              newFormat = newFormat.replace(new RegExp(pattern, 'g'), `{${to}}`)
            }
            if (newFormat !== textProps.format) {
              newElement = {
                ...newElement,
                props: { ...element.props, format: newFormat } as typeof element.props
              }
            }
          }
        }

        return newElement
      })
    }))

    console.log('[DateTimeLocale] Updated blocks:', newBlocks.map(b => ({
      id: b.id,
      elements: b.elements.map(e => ({ id: e.id, binding: e.binding, format: (e.props as { format?: string })?.format }))
    })))
    onBlocksChange(newBlocks)
  }, [document.blocks, onBlocksChange])

  return (
    <div className={`flex flex-col p-4 space-y-4 ${className}`}>
      {/* ============================================ */}
      {/* 공유 데이터 섹션들 */}
      {/* ============================================ */}

      {/* 섹션 1: 혼주 정보 + 계좌 정보 */}
      <SharedSection
        id="family"
        title="혼주 정보"
        icon="👨‍👩‍👧‍👦"
        expanded={expanded === 'family'}
        onToggle={() => handleToggle('family')}
      >
        <FamilyTableField
          data={data}
          onFieldChange={handleFieldChange}
          onAccountsChange={handleAccountsChange}
          visibleColumns={[
            'name',
            'nameEn',
            'phone',
            'deceased',
            'birthOrder',
            'baptismalName',
            'bank',
            'accountNumber',
            'accountHolder',
          ]}
        />
      </SharedSection>

      {/* 섹션 2: 예식 정보 */}
      <SharedSection
        id="wedding"
        title="예식 정보"
        icon="💒"
        expanded={expanded === 'wedding'}
        onToggle={() => handleToggle('wedding')}
      >
        <div className="space-y-4">
          <FieldRow label="예식 날짜">
            <input
              type="date"
              value={data.wedding?.date ?? ''}
              onChange={(e) => handleFieldChange('wedding.date', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[var(--warm-200)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--blush-400)]"
            />
          </FieldRow>

          <FieldRow label="예식 시간">
            <input
              type="time"
              value={data.wedding?.time ?? ''}
              onChange={(e) => handleFieldChange('wedding.time', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[var(--warm-200)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--blush-400)]"
            />
          </FieldRow>

          <FieldRow label="날짜/시간 표시">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleDateTimeLocaleChange('ko')}
                className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                  dateTimeLocale === 'ko'
                    ? 'bg-[var(--blush-500)] text-white border-[var(--blush-500)]'
                    : 'bg-white text-[var(--warm-600)] border-[var(--warm-200)] hover:border-[var(--blush-300)]'
                }`}
              >
                한국어
              </button>
              <button
                type="button"
                onClick={() => handleDateTimeLocaleChange('en')}
                className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                  dateTimeLocale === 'en'
                    ? 'bg-[var(--blush-500)] text-white border-[var(--blush-500)]'
                    : 'bg-white text-[var(--warm-600)] border-[var(--warm-200)] hover:border-[var(--blush-300)]'
                }`}
              >
                English
              </button>
            </div>
            <p className="mt-1 text-xs text-[var(--warm-400)]">
              {dateTimeLocale === 'ko' ? '(토) 오후 2시' : '(SAT) PM 2:00'}
            </p>
          </FieldRow>
        </div>
      </SharedSection>

      {/* 섹션 3: 예식장 정보 */}
      <SharedSection
        id="venue"
        title="예식장 정보"
        icon="📍"
        expanded={expanded === 'venue'}
        onToggle={() => handleToggle('venue')}
      >
        <div className="space-y-4">
          <FieldRow label="예식장 이름">
            <input
              type="text"
              value={data.venue?.name ?? ''}
              onChange={(e) => handleFieldChange('venue.name', e.target.value)}
              placeholder="○○웨딩홀"
              className="w-full px-3 py-2 bg-white border border-[var(--warm-200)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--blush-400)]"
            />
          </FieldRow>

          <FieldRow label="홀 이름">
            <input
              type="text"
              value={data.venue?.hall ?? ''}
              onChange={(e) => handleFieldChange('venue.hall', e.target.value)}
              placeholder="그랜드홀 5층"
              className="w-full px-3 py-2 bg-white border border-[var(--warm-200)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--blush-400)]"
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
              className="w-full px-3 py-2 bg-white border border-[var(--warm-200)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--blush-400)]"
            />
          </FieldRow>
        </div>
      </SharedSection>

      {/* ============================================ */}
      {/* 구분선 */}
      {/* ============================================ */}
      {enabledBlocks.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 border-t border-[var(--warm-200)]" />
            <span className="text-xs text-[var(--text-light)] px-2">섹션별 데이터</span>
            <div className="flex-1 border-t border-[var(--warm-200)]" />
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* 블록별 데이터 섹션들 */}
      {/* ============================================ */}
      {enabledBlocks.map((block) => (
        <BlockDataSection
          key={block.id}
          block={block}
          data={data}
          expanded={expanded === block.id}
          onToggle={() => handleToggle(block.id)}
          onFieldChange={handleFieldChange}
          onLocationChange={handleLocationChange}
          onUploadImage={onUploadImage}
        />
      ))}
    </div>
  )
}

// ============================================
// Block Data Section (블록별 데이터)
// ============================================

interface BlockDataSectionProps {
  block: Block
  data: WeddingData
  expanded: boolean
  onToggle: () => void
  onFieldChange: (path: VariablePath, value: unknown) => void
  onLocationChange: (address: string, lat: number, lng: number) => void
  onUploadImage?: (file: File) => Promise<string>
}

function BlockDataSection({
  block,
  data,
  expanded,
  onToggle,
  onFieldChange,
  onLocationChange,
  onUploadImage,
}: BlockDataSectionProps) {
  // 편집 가능한 필드 추출 (공유 필드 제외)
  const editableFields = useMemo(() => {
    const allFields = extractEditableFields(block, data)
    // 공유 필드는 상단 섹션에서 이미 표시되므로 제외
    return allFields.filter((field) => !isSharedField(field.binding))
  }, [block, data])

  // RSVP 블록은 토글 설정이 있으므로 필드가 없어도 렌더링
  const isRsvpBlock = block.type === 'rsvp'

  // 필드가 없으면 렌더링하지 않음 (RSVP 제외)
  if (editableFields.length === 0 && !isRsvpBlock) {
    return null
  }

  const icon = BLOCK_TYPE_ICONS[block.type] || '📄'
  const label = BLOCK_TYPE_LABELS[block.type] || block.type

  // RSVP 토글 설정 항목 수 계산
  const rsvpSettingCount = isRsvpBlock ? 5 : 0  // showPhone, showGuestCount, showMeal, showSide, showBusOption
  const totalItemCount = editableFields.length + rsvpSettingCount

  return (
    <div className="border border-[var(--editor-border)] rounded-lg overflow-hidden">
      {/* 헤더 */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--editor-surface)] hover:bg-[var(--editor-surface-hover)] transition-colors"
      >
        <span className="text-lg">{icon}</span>
        <span className="flex-1 text-left text-sm font-medium text-[var(--text-primary)]">{label}</span>
        <span className="text-xs text-[var(--text-light)]">{totalItemCount}개 항목</span>
        <ChevronIcon className={`w-4 h-4 text-[var(--text-light)] transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {/* 콘텐츠 */}
      {expanded && (
        <div className="px-4 py-4 bg-[var(--editor-bg)] border-t border-[var(--editor-border)] space-y-4">
          {/* RSVP 토글 설정 */}
          {isRsvpBlock && (
            <RsvpSettingsSection
              rsvpConfig={data.rsvp}
              onConfigChange={(newConfig) => {
                // rsvp 전체 객체를 업데이트
                const currentRsvp = data.rsvp || {}
                const updatedRsvp = { ...currentRsvp, ...newConfig }
                onFieldChange('rsvp.title' as VariablePath, updatedRsvp.title)
                // 개별 필드로 업데이트 (nested 업데이트를 위해)
                Object.entries(newConfig).forEach(([key, value]) => {
                  // 직접 data.rsvp를 변경
                })
              }}
              onFieldChange={onFieldChange}
            />
          )}

          {/* 기존 편집 가능한 필드들 */}
          {editableFields.map((field) => (
            <VariableField
              key={field.binding}
              binding={field.binding}
              value={field.value}
              onChange={(value) => onFieldChange(field.binding, value)}
              onUploadImage={onUploadImage}
              onLocationChange={onLocationChange}
              data={data}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// RSVP Settings Section (RSVP 토글 설정)
// ============================================

interface RsvpSettingsSectionProps {
  rsvpConfig?: RsvpConfig
  onConfigChange: (config: Partial<RsvpConfig>) => void
  onFieldChange: (path: VariablePath, value: unknown) => void
}

function RsvpSettingsSection({ rsvpConfig, onFieldChange }: RsvpSettingsSectionProps) {
  const config = rsvpConfig || {}

  // 토글 핸들러 (rsvp.showXXX 형태로 저장)
  const handleToggle = (key: keyof RsvpConfig, value: boolean) => {
    // WeddingData.rsvp 객체에 직접 업데이트
    onFieldChange(`rsvp.${key}` as VariablePath, value)
  }

  return (
    <div className="space-y-3 pb-4 border-b border-[var(--warm-200)]">
      <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
        수집 정보 설정
      </div>

      <div className="space-y-2">
        <ToggleItem
          label="연락처"
          description="참석자의 연락처를 수집합니다"
          checked={config.showPhone ?? true}
          onChange={(checked) => handleToggle('showPhone', checked)}
        />

        <ToggleItem
          label="신랑측/신부측"
          description="어느 측 하객인지 선택할 수 있습니다"
          checked={config.showSide ?? true}
          onChange={(checked) => handleToggle('showSide', checked)}
        />

        <ToggleItem
          label="동반 인원수"
          description="참석 가능 시 동반 인원수를 입력받습니다"
          checked={config.showGuestCount ?? false}
          onChange={(checked) => handleToggle('showGuestCount', checked)}
        />

        <ToggleItem
          label="버스 탑승 여부"
          description="참석 가능 시 전세버스 탑승 여부를 선택합니다"
          checked={config.showBusOption ?? false}
          onChange={(checked) => handleToggle('showBusOption', checked)}
        />

        <ToggleItem
          label="식사 여부"
          description="참석 가능 시 식사 여부를 선택합니다"
          checked={config.showMeal ?? false}
          onChange={(checked) => handleToggle('showMeal', checked)}
        />
      </div>
    </div>
  )
}

// ============================================
// Toggle Item (토글 스위치)
// ============================================

interface ToggleItemProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function ToggleItem({ label, description, checked, onChange }: ToggleItemProps) {
  return (
    <label className="flex items-start gap-3 cursor-pointer py-2">
      {/* 토글 스위치 */}
      <div className="relative flex-shrink-0 mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-9 h-5 bg-[var(--warm-200)] rounded-full peer-checked:bg-[var(--blush-400)] transition-colors" />
        <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform" />
      </div>

      {/* 레이블 */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-[var(--text-primary)]">{label}</div>
        {description && (
          <div className="text-xs text-[var(--text-light)] mt-0.5">{description}</div>
        )}
      </div>
    </label>
  )
}

// ============================================
// Shared Section (공유 데이터 아코디언)
// ============================================

interface SharedSectionProps {
  id: string
  title: string
  icon?: string
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
}

function SharedSection({ id, title, icon, expanded, onToggle, children }: SharedSectionProps) {
  return (
    <div className="border border-[var(--editor-border)] rounded-lg overflow-hidden">
      {/* 헤더 */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--editor-surface)] hover:bg-[var(--editor-surface-hover)] transition-colors"
      >
        {icon && <span className="text-lg">{icon}</span>}
        <span className="flex-1 text-left text-sm font-semibold text-[var(--text-primary)]">{title}</span>
        <ChevronIcon className={`w-4 h-4 text-[var(--text-light)] transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {/* 콘텐츠 */}
      {expanded && (
        <div className="px-4 py-4 bg-[var(--editor-bg)] border-t border-[var(--editor-border)]">
          {children}
        </div>
      )}
    </div>
  )
}

// ============================================
// Sub Components
// ============================================

interface FieldRowProps {
  label: string
  children: React.ReactNode
}

function FieldRow({ label, children }: FieldRowProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-[var(--text-body)]">{label}</label>
      {children}
    </div>
  )
}

// ============================================
// Icons
// ============================================

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}
