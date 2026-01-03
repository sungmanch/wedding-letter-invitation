'use client'

/**
 * Family Table Field
 *
 * 혼주 정보를 테이블 형식으로 입력/관리하는 컴포넌트
 * 6명(신랑, 신랑부, 신랑모, 신부, 신부부, 신부모)의 정보를 한 곳에서 관리
 * + 계좌 정보 (은행, 계좌번호)
 */

import { useCallback, useState } from 'react'
import type { WeddingData, VariablePath, AccountItem } from '../../../schema/types'

// ============================================
// Types
// ============================================

type FamilyRole = 'groom' | 'groom-father' | 'groom-mother' | 'bride' | 'bride-father' | 'bride-mother'

type ColumnType = 'name' | 'nameEn' | 'phone' | 'deceased' | 'birthOrder' | 'baptismalName' | 'bank' | 'accountNumber' | 'accountHolder'

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
  /** 계좌 데이터 업데이트 콜백 */
  onAccountsChange?: (accounts: WeddingData['accounts']) => void
  /** 표시할 컬럼 선택 (기본: 모두 표시) */
  visibleColumns?: ColumnType[]
}

// ============================================
// Account Mapping
// ============================================

/** Role → accounts 배열 인덱스 및 relation 매핑 */
const ACCOUNT_MAPPING: Record<FamilyRole, { side: 'groom' | 'bride'; index: number; relation: string }> = {
  'groom': { side: 'groom', index: 0, relation: '본인' },
  'groom-father': { side: 'groom', index: 1, relation: '아버지' },
  'groom-mother': { side: 'groom', index: 2, relation: '어머니' },
  'bride': { side: 'bride', index: 0, relation: '본인' },
  'bride-father': { side: 'bride', index: 1, relation: '아버지' },
  'bride-mother': { side: 'bride', index: 2, relation: '어머니' },
}

const KOREAN_BANKS = [
  '국민은행', '신한은행', '우리은행', '하나은행', 'NH농협은행',
  '기업은행', 'SC제일은행', '씨티은행', '카카오뱅크', '케이뱅크',
  '토스뱅크', '새마을금고', '신협', '우체국', '경남은행',
  '광주은행', '대구은행', '부산은행', '전북은행', '제주은행', '수협은행',
]

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
    nameEn: 'couple.groom.nameEn',
    phone: 'couple.groom.phone',
    birthOrder: 'parents.groom.birthOrder',
    baptismalName: 'couple.groom.baptismalName',
  },
  'groom-father': {
    name: 'parents.groom.father.name',
    phone: 'parents.groom.father.phone',
    deceased: 'parents.groom.father.status',
    baptismalName: 'parents.groom.father.baptismalName',
  },
  'groom-mother': {
    name: 'parents.groom.mother.name',
    phone: 'parents.groom.mother.phone',
    deceased: 'parents.groom.mother.status',
    baptismalName: 'parents.groom.mother.baptismalName',
  },
  'bride': {
    name: 'couple.bride.name',
    nameEn: 'couple.bride.nameEn',
    phone: 'couple.bride.phone',
    birthOrder: 'parents.bride.birthOrder',
    baptismalName: 'couple.bride.baptismalName',
  },
  'bride-father': {
    name: 'parents.bride.father.name',
    phone: 'parents.bride.father.phone',
    deceased: 'parents.bride.father.status',
    baptismalName: 'parents.bride.father.baptismalName',
  },
  'bride-mother': {
    name: 'parents.bride.mother.name',
    phone: 'parents.bride.mother.phone',
    deceased: 'parents.bride.mother.status',
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
  onAccountsChange,
  visibleColumns = ['name', 'nameEn', 'phone', 'deceased', 'birthOrder', 'baptismalName', 'bank', 'accountNumber'],
}: FamilyTableFieldProps) {
  // 신랑측/신부측 각각 독립적으로 펼침 상태 관리
  const [expandedSides, setExpandedSides] = useState<Set<'groom' | 'bride'>>(new Set())

  const toggleSide = useCallback((side: 'groom' | 'bride') => {
    setExpandedSides(prev => {
      const next = new Set(prev)
      if (next.has(side)) {
        next.delete(side)
      } else {
        next.add(side)
      }
      return next
    })
  }, [])

  // 데이터에서 값 가져오기 (useCallback 제거하여 항상 최신 data 참조)
  const getValue = (path: VariablePath): string => {
    const value = getNestedValue(data as unknown as Record<string, unknown>, path)
    if (value === undefined || value === null) return ''
    return String(value)
  }

  // 고인 여부 확인 (status가 '故'이면 true)
  const isDeceased = (path: VariablePath): boolean => {
    const value = getValue(path)
    return value === '故' || value === '고'
  }

  // 고인 여부 토글
  const toggleDeceased = (path: VariablePath) => {
    const current = getValue(path)
    const newValue = (current === '故' || current === '고') ? '' : '故'
    onFieldChange(path, newValue)
  }

  // 계좌 정보 가져오기
  const getAccountValue = (role: FamilyRole, field: 'bank' | 'number' | 'holder'): string => {
    const mapping = ACCOUNT_MAPPING[role]
    const accounts = data.accounts?.[mapping.side] ?? []
    const account = accounts[mapping.index]
    if (!account) return ''
    if (field === 'bank') return account.bank
    if (field === 'number') return account.number
    // holder가 비어있으면 이름에서 자동으로 가져오기
    if (account.holder) return account.holder
    const namePath = FAMILY_PATHS[role].name
    return getValue(namePath)
  }

  // 계좌 정보 업데이트
  const updateAccount = (role: FamilyRole, field: 'bank' | 'number' | 'holder', value: string) => {
    if (!onAccountsChange) return

    const mapping = ACCOUNT_MAPPING[role]
    const currentAccounts = data.accounts ?? { groom: [], bride: [] }
    const sideAccounts = [...(currentAccounts[mapping.side] ?? [])]

    // 해당 인덱스의 계좌 정보 가져오거나 새로 생성
    let account: AccountItem = sideAccounts[mapping.index] ?? {
      relation: mapping.relation,
      bank: '',
      number: '',
      holder: '',
    }

    // 업데이트
    account = {
      ...account,
      [field]: value,
    }

    // 배열 업데이트 (빈 슬롯 채우기)
    while (sideAccounts.length <= mapping.index) {
      sideAccounts.push({ relation: '', bank: '', number: '', holder: '' })
    }
    sideAccounts[mapping.index] = account

    const newAccounts = {
      ...currentAccounts,
      [mapping.side]: sideAccounts,
    }

    onAccountsChange(newAccounts)
  }

  // 셀 렌더링
  const renderCell = (role: FamilyRole, column: string) => {
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

      case 'bank':
        return (
          <select
            value={getAccountValue(role, 'bank')}
            onChange={(e) => updateAccount(role, 'bank', e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-transparent rounded focus:border-[var(--sage-300)] focus:outline-none bg-transparent hover:bg-white/50 appearance-none"
          >
            <option value="">은행</option>
            {KOREAN_BANKS.map(bank => (
              <option key={bank} value={bank}>{bank}</option>
            ))}
          </select>
        )

      case 'accountNumber':
        return (
          <input
            type="text"
            value={getAccountValue(role, 'number')}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/[^0-9-]/g, '')
              updateAccount(role, 'number', cleaned)
            }}
            placeholder="계좌번호"
            className="w-full px-2 py-1.5 text-sm border border-transparent rounded focus:border-[var(--sage-300)] focus:outline-none bg-transparent hover:bg-white/50"
          />
        )

      case 'accountHolder':
        return (
          <input
            type="text"
            value={getAccountValue(role, 'holder')}
            onChange={(e) => updateAccount(role, 'holder', e.target.value)}
            placeholder={getValue(paths.name) || '예금주'}
            className="w-full px-2 py-1.5 text-sm border border-transparent rounded focus:border-[var(--sage-300)] focus:outline-none bg-transparent hover:bg-white/50"
          />
        )

      default:
        return null
    }
  }

  // 컬럼 헤더 라벨 및 너비 (px 기반으로 통일)
  const columnConfig: Record<ColumnType, { label: string; width: number }> = {
    name: { label: '이름', width: 80 },
    nameEn: { label: '영문', width: 100 },
    phone: { label: '연락처', width: 120 },
    deceased: { label: '고인', width: 50 },
    birthOrder: { label: '서열', width: 60 },
    baptismalName: { label: '세례명', width: 80 },
    bank: { label: '은행', width: 90 },
    accountNumber: { label: '계좌번호', width: 130 },
    accountHolder: { label: '예금주', width: 80 },
  }

  // 테이블 최소 너비 계산
  const tableMinWidth = 60 + visibleColumns.reduce((sum, col) => sum + columnConfig[col].width, 0)

  // 신랑측/신부측 행 렌더링
  const renderSideRows = (side: 'groom' | 'bride') => {
    const roles: FamilyRole[] = side === 'groom'
      ? ['groom', 'groom-father', 'groom-mother']
      : ['bride', 'bride-father', 'bride-mother']

    const sideLabel = side === 'groom' ? '신랑측' : '신부측'
    const isExpanded = expandedSides.has(side)

    return (
      <>
        {/* 사이드 헤더 (접기/펼치기) */}
        <tr
          className="cursor-pointer hover:bg-[var(--sage-50)] transition-colors"
          onClick={() => toggleSide(side)}
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
            <td className="px-3 py-2 text-sm text-[var(--text-muted)] whitespace-nowrap bg-white w-16 sticky left-0">
              {ROLE_LABELS[role]}
            </td>
            {visibleColumns.map((col) => (
              <td
                key={col}
                className="px-2 py-1 bg-white"
                style={{ width: columnConfig[col].width }}
              >
                {renderCell(role, col)}
              </td>
            ))}
          </tr>
        ))}
      </>
    )
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[var(--text-body)]">
        혼주 정보
      </label>

      <div className="border border-[var(--sand-200)] rounded-lg overflow-x-auto">
        <table className="text-sm" style={{ minWidth: `${tableMinWidth}px` }}>
          <thead>
            <tr className="bg-[var(--sand-100)]">
              <th className="px-3 py-2 text-center text-xs font-medium text-[var(--text-muted)] sticky left-0 bg-[var(--sand-100)]" style={{ width: 60 }}>
                구분
              </th>
              {visibleColumns.map((col) => (
                <th
                  key={col}
                  className="px-2 py-2 text-center text-xs font-medium text-[var(--text-muted)]"
                  style={{ width: columnConfig[col].width }}
                >
                  {columnConfig[col].label}
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
