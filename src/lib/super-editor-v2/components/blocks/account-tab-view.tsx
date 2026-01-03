'use client'

/**
 * Account Tab View Component
 *
 * 신랑측/신부측 탭으로 전환하며 계좌 정보를 카드 형태로 표시
 * - 탭 선택기 (신랑측/신부측)
 * - 계좌 카드 리스트 (은행, 계좌번호, 예금주)
 * - 계좌 복사 버튼
 * - 카카오페이 버튼 (설정된 경우)
 */

import { useState, useCallback, type CSSProperties } from 'react'
import type { AccountItem } from '../../schema/types'
import { useDocument } from '../../context/document-context'
import { useBlockTokens } from '../../context/block-context'

// ============================================
// Types
// ============================================

export interface AccountTabViewProps {
  className?: string
}

type TabSide = 'groom' | 'bride'

// ============================================
// Utility Functions
// ============================================

/**
 * 계좌 정보가 유효한지 확인 (필수 필드: 은행명, 계좌번호)
 * holder는 선택적 (비어있으면 렌더링 시 이름으로 fallback)
 */
function isValidAccount(account: AccountItem): boolean {
  return !!(
    account.bank?.trim() &&
    account.number?.trim()
  )
}

/**
 * relation과 side로 이름 데이터 경로를 찾아 반환
 */
function getHolderFallback(
  data: ReturnType<typeof useDocument>['data'],
  side: TabSide,
  relation: string
): string {
  if (relation === '본인') {
    return side === 'groom'
      ? data?.couple?.groom?.name ?? ''
      : data?.couple?.bride?.name ?? ''
  }
  if (relation === '아버지') {
    return side === 'groom'
      ? data?.parents?.groom?.father?.name ?? ''
      : data?.parents?.bride?.father?.name ?? ''
  }
  if (relation === '어머니') {
    return side === 'groom'
      ? data?.parents?.groom?.mother?.name ?? ''
      : data?.parents?.bride?.mother?.name ?? ''
  }
  return ''
}

// ============================================
// Main Component
// ============================================

export function AccountTabView({ className }: AccountTabViewProps) {
  const { document } = useDocument()
  const tokens = useBlockTokens()
  const [activeSide, setActiveSide] = useState<TabSide>('groom')

  const data = document?.data

  // 계좌 데이터 (유효한 계좌만 필터링)
  const groomAccounts = (data?.accounts?.groom ?? []).filter(isValidAccount)
  const brideAccounts = (data?.accounts?.bride ?? []).filter(isValidAccount)
  const kakaopay = data?.accounts?.kakaopay

  // 현재 선택된 탭의 계좌 목록
  const currentAccounts = activeSide === 'groom' ? groomAccounts : brideAccounts
  const currentKakaopay = activeSide === 'groom' ? kakaopay?.groom : kakaopay?.bride

  // 계좌번호 복사
  const handleCopy = useCallback(async (account: AccountItem) => {
    const text = `${account.bank} ${account.number} ${account.holder}`
    try {
      await navigator.clipboard.writeText(account.number)
      alert('계좌번호가 복사되었습니다.')
    } catch (err) {
      // Fallback for older browsers
      const textarea = window.document.createElement('textarea')
      textarea.value = account.number
      window.document.body.appendChild(textarea)
      textarea.select()
      window.document.execCommand('copy')
      window.document.body.removeChild(textarea)
      alert('계좌번호가 복사되었습니다.')
    }
  }, [])

  // 카카오페이 열기
  const handleKakaopay = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }, [])

  // 빈 상태
  if (groomAccounts.length === 0 && brideAccounts.length === 0) {
    return (
      <div
        className={className}
        style={{
          padding: '40px 24px',
          textAlign: 'center',
          color: tokens.fgMuted,
        }}
      >
        계좌 정보를 추가해주세요
      </div>
    )
  }

  return (
    <div
      className={className}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
      data-component="account-tab-view"
    >
      {/* Tab Selector */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        <TabButton
          label="신랑측"
          isActive={activeSide === 'groom'}
          onClick={() => setActiveSide('groom')}
          tokens={tokens}
          disabled={groomAccounts.length === 0}
        />
        <TabButton
          label="신부측"
          isActive={activeSide === 'bride'}
          onClick={() => setActiveSide('bride')}
          tokens={tokens}
          disabled={brideAccounts.length === 0}
        />
      </div>

      {/* Account Cards */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {currentAccounts.map((account, index) => (
          <AccountCard
            key={`${activeSide}-${index}`}
            account={account}
            side={activeSide}
            kakaopayUrl={index === 0 ? currentKakaopay : undefined}
            tokens={tokens}
            onCopy={handleCopy}
            onKakaopay={handleKakaopay}
            holderFallback={getHolderFallback(data, activeSide, account.relation)}
          />
        ))}
      </div>
    </div>
  )
}

// ============================================
// Tab Button Component
// ============================================

interface TabButtonProps {
  label: string
  isActive: boolean
  onClick: () => void
  tokens: ReturnType<typeof useBlockTokens>
  disabled?: boolean
}

function TabButton({ label, isActive, onClick, tokens, disabled }: TabButtonProps) {
  const style: CSSProperties = {
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: 500,
    fontFamily: 'var(--font-body)',
    border: 'none',
    borderRadius: '24px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: isActive ? tokens.fgDefault : tokens.bgCard,
    color: isActive ? tokens.bgSection : tokens.fgDefault,
    opacity: disabled ? 0.5 : 1,
  }

  return (
    <button
      style={style}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={isActive}
    >
      {label}
    </button>
  )
}

// ============================================
// Account Card Component
// ============================================

interface AccountCardProps {
  account: AccountItem
  side: TabSide
  kakaopayUrl?: string
  tokens: ReturnType<typeof useBlockTokens>
  onCopy: (account: AccountItem) => void
  onKakaopay: (url: string) => void
  /** holder가 비어있을 때 사용할 fallback 이름 */
  holderFallback?: string
}

function AccountCard({
  account,
  side,
  kakaopayUrl,
  tokens,
  onCopy,
  onKakaopay,
  holderFallback,
}: AccountCardProps) {
  const sideLabel = side === 'groom' ? '신랑' : '신부'
  const relationLabel = account.relation === '본인'
    ? sideLabel
    : `${sideLabel} ${account.relation}`

  // holder가 비어있으면 fallback 사용
  const displayHolder = account.holder?.trim() || holderFallback || ''

  const cardStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '24px',
    backgroundColor: tokens.bgCard,
    borderRadius: '16px',
  }

  const headerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  }

  const bankInfoStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  }

  const bankNameStyle: CSSProperties = {
    fontSize: '14px',
    fontFamily: 'var(--font-body)',
    color: tokens.fgMuted,
  }

  const accountNumberStyle: CSSProperties = {
    fontSize: '16px',
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    color: tokens.fgDefault,
  }

  const holderStyle: CSSProperties = {
    fontSize: '15px',
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    color: tokens.fgDefault,
    textAlign: 'right',
  }

  const relationStyle: CSSProperties = {
    fontSize: '13px',
    fontFamily: 'var(--font-body)',
    color: tokens.fgMuted,
    textAlign: 'right',
  }

  const buttonsStyle: CSSProperties = {
    display: 'flex',
    gap: '8px',
  }

  const copyButtonStyle: CSSProperties = {
    flex: kakaopayUrl ? 1 : '1 1 100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '12px 16px',
    fontSize: '14px',
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    color: tokens.fgDefault,
    backgroundColor: tokens.bgSection,
    border: `1px solid ${tokens.borderDefault}`,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }

  const kakaopayButtonStyle: CSSProperties = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    padding: '12px 16px',
    fontSize: '14px',
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    color: '#000000',
    backgroundColor: '#FEE500',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }

  return (
    <div style={cardStyle} data-account-card>
      {/* Header: Bank Info & Holder */}
      <div style={headerStyle}>
        <div style={bankInfoStyle}>
          <span style={bankNameStyle}>{account.bank}</span>
          <span style={accountNumberStyle}>{account.number}</span>
        </div>
        <div>
          <div style={relationStyle}>{relationLabel}</div>
          <div style={holderStyle}>{displayHolder}</div>
        </div>
      </div>

      {/* Buttons */}
      <div style={buttonsStyle}>
        <button
          style={copyButtonStyle}
          onClick={() => onCopy(account)}
          aria-label="계좌번호 복사"
        >
          <CopyIcon />
          계좌 복사하기
        </button>
        {kakaopayUrl && (
          <button
            style={kakaopayButtonStyle}
            onClick={() => onKakaopay(kakaopayUrl)}
            aria-label="카카오페이로 송금"
          >
            <span style={{ fontWeight: 400 }}>kakao</span>
            <span style={{ fontWeight: 700 }}>pay</span>
          </button>
        )}
      </div>
    </div>
  )
}

// ============================================
// Icons
// ============================================

function CopyIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

export default AccountTabView
