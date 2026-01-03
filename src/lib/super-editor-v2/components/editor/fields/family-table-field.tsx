'use client'

/**
 * Family Table Field
 *
 * 혼주 정보를 테이블 형식으로 입력/관리하는 컴포넌트
 * 6명(신랑, 신랑부, 신랑모, 신부, 신부부, 신부모)의 정보를 한 곳에서 관리
 */

import { useCallback, useState } from 'react'
import type { WeddingData, VariablePath } from '../../../schema/types'

// ============================================
// Types
// ============================================

type FamilyRole = 'groom' | 'groom-father' | 'groom-mother' | 'bride' | 'bride-father' | 'bride-mother'

interface FamilyMemberData {
  role: FamilyRole
  label: string
  name: string
  nameEn?: string
  phone?: string
  deceased?: boolean  // 부모만
  birthOrder?: string // 신랑/신부만
  baptismalName?: string
}

interface FamilyTableFieldProps {
  data: WeddingData
  onFieldChange: (path: VariablePath, value: unknown) => void
  /** 표시할 컬럼 선택 (기본: 모두 표시) */
  visibleColumns?: Array<'name' | 'nameEn' | 'phone' | 'deceased' | 'birthOrder' | 'baptismalName'>
}

// ============================================
// Path Mapping
// ============================================

const FAMILY_PATHS: Record<FamilyRole, {
  name: VariablePath
  nameEn?: VariablePath
  phone?: VariablePath
  deceased?: VariablePath
  birthOrder?: VariablePath
  baptismalName?: VariablePath
}> = {
  'groom': {
    name: 'couple.groom.name',
    nameEn: 'couple.groom.nameEn' as VariablePath,
    phone: 'couple.groom.phone',
    birthOrder: 'parents.groom.birthOrder',
    baptismalName: 'couple.groom.baptismalName',
  },
  'groom-father': {
    name: 'parents.groom.father.name',
    phone: 'parents.groom.father.phone',
    deceased: 'parents.groom.father.status' as VariablePath,
    baptismalName: 'parents.groom.father.baptismalName',
  },
  'groom-mother': {
    name: 'parents.groom.mother.name',
    phone: 'parents.groom.mother.phone',
    deceased: 'parents.groom.mother.status' as VariablePath,
    baptismalName: 'parents.groom.mother.baptismalName',
  },
  'bride': {
    name: 'couple.bride.name',
    nameEn: 'couple.bride.nameEn' as VariablePath,
    phone: 'couple.bride.phone',
    birthOrder: 'parents.bride.birthOrder',
    baptismalName: 'couple.bride.baptismalName',
  },
  'bride-father': {
    name: 'parents.bride.father.name',
    phone: 'parents.bride.father.phone',
    deceased: 'parents.bride.father.status' as VariablePath,
    baptismalName: 'parents.bride.father.baptismalName',
  },
  'bride-mother': {
    name: 'parents.bride.mother.name',
    phone: 'parents.bride.mother.phone',
    deceased: 'parents.bride.mother.status' as VariablePath,
    baptismalName: 'parents.bride.mother.baptismalName',
  },
}

const ROLE_LABELS: Record<FamilyRole, string> = {
  'groom': '신랑',
  'groom-father': '신랑 부',
  'groom-mother': '신랑 모',
  'bride': '신부',
  'bride-father': '신부 부',
  'bride-mother': '신부 모',
}

// ============================================
// Helper Functions
// ============================================

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const keys = path.split('.')
  let current: unknown = obj

  for (const key of keys) {
    if (current === null || current === undefined) return undefined
    current = (current as Record<string, unknown>)[key]
  }

  return current
}

// ============================================
// Component
// ============================================

export function FamilyTableField({
  data,
  onFieldChange,
  visibleColumns = ['name', 'phone', 'deceased', 'birthOrder', 'baptismalName'],
}: FamilyTableFieldProps) {
  const [expandedSide, setExpandedSide] = useState<'groom' | 'bride' | null>(null)

  // 데이터에서 값 가져오기
  const getValue = useCallback((path: VariablePath): string => {
    const value = getNestedValue(data as unknown as Record<string, unknown>, path)
    if (value === undefined || value === null) return ''
    return String(value)
  }, [data])

  // 고인 여부 확인 (status가 '故'이면 true)
  const isDeceased = useCallback((path: VariablePath): boolean => {
    const value = getValue(path)
    return value === '故' || value === '고'
  }, [getValue])

  // 고인 여부 토글
  const toggleDeceased = useCallback((path: VariablePath) => {
    const current = getValue(path)
    const newValue = (current === '故' || current === '고') ? '' : '故'
    onFieldChange(path, newValue)
  }, [getValue, onFieldChange])

  // 컬럼 표시 여부
  const showColumn = useCallback((col: string) => visibleColumns.includes(col as typeof visibleColumns[number]), [visibleColumns])

  // 셀 렌더링
  const renderCell = useCallback((role: FamilyRole, column: string) => {
    const paths = FAMILY_PATHS[role]
    const isCouple = role === 'groom' || role === 'bride'
    const isParent = !isCouple

    switch (column) {
      case 'name':
        return (
          <input
            type="text"
            value={getValue(paths.name)}
            onChange={(e) => onFieldChange(paths.name, e.target.value)}
            placeholder="이름"
            className="w-full px-2 py-1.5 text-sm border border-transparent rounded focus:border-[var(--sage-300)] focus:outline-none bg-transparent hover:bg-white/50"
          />
        )

      case 'nameEn':
        if (!paths.nameEn) return <span className="text-[var(--text-light)]">-</span>
        return (
          <input
            type="text"
            value={getValue(paths.nameEn)}
            onChange={(e) => onFieldChange(paths.nameEn!, e.target.value)}
            placeholder="English"
            className="w-full px-2 py-1.5 text-sm border border-transparent rounded focus:border-[var(--sage-300)] focus:outline-none bg-transparent hover:bg-white/50"
          />
        )

      case 'phone':
        if (!paths.phone) return <span className="text-[var(--text-light)]">-</span>
        return (
          <input
            type="tel"
            value={getValue(paths.phone)}
            onChange={(e) => onFieldChange(paths.phone!, e.target.value)}
            placeholder="010-0000-0000"
            className="w-full px-2 py-1.5 text-sm border border-transparent rounded focus:border-[var(--sage-300)] focus:outline-none bg-transparent hover:bg-white/50"
          />
        )

      case 'deceased':
        if (!isParent || !paths.deceased) return <span className="text-[var(--text-light)]">-</span>
        return (
          <button
            type="button"
            onClick={() => toggleDeceased(paths.deceased!)}
            className={`
              px-2 py-1 text-xs rounded transition-colors
              ${isDeceased(paths.deceased!)
                ? 'bg-gray-200 text-gray-700'
                : 'bg-transparent text-[var(--text-light)] hover:bg-gray-100'
              }
            `}
          >
            {isDeceased(paths.deceased!) ? '故' : '-'}
          </button>
        )

      case 'birthOrder':
        if (!isCouple || !paths.birthOrder) return <span className="text-[var(--text-light)]">-</span>
        return (
          <input
            type="text"
            value={getValue(paths.birthOrder)}
            onChange={(e) => onFieldChange(paths.birthOrder!, e.target.value)}
            placeholder={role === 'groom' ? '장남' : '장녀'}
            className="w-full px-2 py-1.5 text-sm border border-transparent rounded focus:border-[var(--sage-300)] focus:outline-none bg-transparent hover:bg-white/50"
          />
        )

      case 'baptismalName':
        if (!paths.baptismalName) return <span className="text-[var(--text-light)]">-</span>
        return (
          <input
            type="text"
            value={getValue(paths.baptismalName)}
            onChange={(e) => onFieldChange(paths.baptismalName!, e.target.value)}
            placeholder="세례명"
            className="w-full px-2 py-1.5 text-sm border border-transparent rounded focus:border-[var(--sage-300)] focus:outline-none bg-transparent hover:bg-white/50"
          />
        )

      default:
        return null
    }
  }, [getValue, onFieldChange, toggleDeceased, isDeceased])

  // 신랑측/신부측 행 렌더링
  const renderSideRows = useCallback((side: 'groom' | 'bride') => {
    const roles: FamilyRole[] = side === 'groom'
      ? ['groom', 'groom-father', 'groom-mother']
      : ['bride', 'bride-father', 'bride-mother']

    const sideLabel = side === 'groom' ? '신랑측' : '신부측'
    const isExpanded = expandedSide === side

    return (
      <>
        {/* 사이드 헤더 (접기/펼치기) */}
        <tr
          className="cursor-pointer hover:bg-[var(--sage-50)] transition-colors"
          onClick={() => setExpandedSide(isExpanded ? null : side)}
        >
          <td
            colSpan={visibleColumns.length + 1}
            className="px-3 py-2 text-sm font-medium text-[var(--text-primary)] bg-[var(--sand-50)]"
          >
            <div className="flex items-center gap-2">
              <ChevronIcon className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              {sideLabel}
              <span className="text-xs text-[var(--text-light)] font-normal">
                ({getValue(FAMILY_PATHS[side].name) || '미입력'})
              </span>
            </div>
          </td>
        </tr>

        {/* 상세 행 (펼쳐졌을 때만) */}
        {isExpanded && roles.map((role) => (
          <tr key={role} className="border-b border-[var(--sand-100)] last:border-b-0">
            <td className="px-3 py-2 text-sm text-[var(--text-muted)] whitespace-nowrap bg-white">
              {ROLE_LABELS[role]}
            </td>
            {visibleColumns.map((col) => (
              <td key={col} className="px-2 py-1 bg-white">
                {renderCell(role, col)}
              </td>
            ))}
          </tr>
        ))}
      </>
    )
  }, [expandedSide, visibleColumns, getValue, renderCell])

  // 컬럼 헤더 라벨
  const columnLabels: Record<string, string> = {
    name: '이름',
    nameEn: '영문',
    phone: '연락처',
    deceased: '고인',
    birthOrder: '서열',
    baptismalName: '세례명',
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[var(--text-body)]">
        혼주 정보
      </label>

      <div className="border border-[var(--sand-200)] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--sand-100)]">
              <th className="px-3 py-2 text-left text-xs font-medium text-[var(--text-muted)] w-20">
                구분
              </th>
              {visibleColumns.map((col) => (
                <th
                  key={col}
                  className="px-2 py-2 text-left text-xs font-medium text-[var(--text-muted)]"
                >
                  {columnLabels[col]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {renderSideRows('groom')}
            {renderSideRows('bride')}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-[var(--text-light)]">
        각 항목을 클릭하여 펼치고 정보를 입력하세요
      </p>
    </div>
  )
}

// ============================================
// Icons
// ============================================

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}
