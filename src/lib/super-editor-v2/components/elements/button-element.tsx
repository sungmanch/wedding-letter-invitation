'use client'

/**
 * Button Element - 버튼 요소
 *
 * 링크, 전화, 지도, 복사, 공유, 연락하기 모달 액션 버튼
 * - Absolute 모드: 부모 컨테이너 100% 채움
 * - Auto Layout (hug) 모드: 콘텐츠에 맞게 크기 조정
 */

import { useCallback, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import type { ElementStyle } from '../../schema/types'
import { useDocument } from '../../context/document-context'
import { ContactModal } from '../ui/contact-modal'
import { RsvpModal } from '../ui/rsvp-modal'
import { GuestbookModal } from '../ui/guestbook-modal'
import { pxToRem } from '../../utils'

// Navigation Icons
import IconNaver from '@/assets/Icon_naver.svg'
import IconKakao from '@/assets/Icon_kakao.svg'
import IconTmap from '@/assets/Icon_tmap.svg'
import IconKakaoTalk from '@/assets/kakao-talk.png'

// ============================================
// Types
// ============================================

export interface ButtonElementProps {
  label: string
  action: 'link' | 'phone' | 'map' | 'copy' | 'share' | 'contact-modal' | 'rsvp-modal' | 'show-block' | 'guestbook-modal'
  value?: unknown
  style?: ElementStyle
  editable?: boolean
  className?: string
  /** Auto Layout hug 모드 여부 */
  hugMode?: boolean
  /** 커스텀 아이콘 (프리셋 ID 또는 'none') */
  icon?: 'naver' | 'kakao' | 'tmap' | 'none' | string
  /** show-block 액션에서 표시할 블록 타입 */
  targetBlockType?: string
}

// ============================================
// Navigation Icons (Naver, Kakao, Tmap)
// ============================================

/** 아이콘 프리셋 ID로 이미지 컴포넌트 반환 */
function getPresetIcon(iconId: string, size = 24): ReactNode {
  const iconStyle = { width: size, height: size }

  switch (iconId) {
    case 'naver':
      return <img src={IconNaver.src} alt="네이버 지도" style={iconStyle} />
    case 'kakao':
      return <img src={IconKakao.src} alt="카카오맵" style={iconStyle} />
    case 'kakao-talk':
      return <img src={IconKakaoTalk.src} alt="카카오톡" style={iconStyle} />
    case 'tmap':
      return <img src={IconTmap.src} alt="티맵" style={iconStyle} />
    case 'none':
      return null
    default:
      return null
  }
}

// ============================================
// Component
// ============================================

export function ButtonElement({
  label,
  action,
  value,
  style,
  editable = false,
  className = '',
  hugMode = false,
  icon,
  targetBlockType,
}: ButtonElementProps) {
  const { document, data } = useDocument()
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [rsvpModalOpen, setRsvpModalOpen] = useState(false)
  const [guestbookModalOpen, setGuestbookModalOpen] = useState(false)

  // 버튼 스타일
  const buttonStyle = useMemo<CSSProperties>(() => {
    const css: CSSProperties = {
      // Auto Layout에서는 부모 컨테이너가 크기를 제어하므로 항상 100% 채움
      // height만 hug일 때는 auto로 설정
      width: '100%',
      height: hugMode ? 'auto' : '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '8px 16px',
      backgroundColor: 'var(--accent-default)',
      color: 'var(--fg-on-accent)',
      border: 'none',
      borderRadius: 'var(--radius-md)',
      cursor: editable ? 'pointer' : 'pointer',
      fontSize: '14px',
      fontWeight: 500,
      transition: 'background-color 0.2s ease',
      whiteSpace: 'nowrap',  // 텍스트 줄바꿈 방지
    }

    // 스타일 오버라이드
    if (style?.background) {
      if (typeof style.background === 'string') {
        css.backgroundColor = style.background
      }
    }
    if (style?.text?.color) {
      css.color = style.text.color
    }
    // fontSize: 숫자면 rem 변환, 문자열(CSS 변수)이면 그대로 사용
    if (style?.text?.fontSize) {
      css.fontSize = typeof style.text.fontSize === 'string'
        ? style.text.fontSize
        : pxToRem(style.text.fontSize)
    }
    // NOTE: border는 auto-layout-element.tsx의 resolveElementStyle()에서 wrapper에 적용됨
    // 여기서 중복 적용하면 이중 border 문제 발생
    if (style?.border?.radius) {
      css.borderRadius = style.border.radius
    }

    return css
  }, [style, editable, hugMode])

  // 액션 핸들러
  const handleClick = useCallback(() => {
    if (editable) return

    const valueStr = String(value ?? '')

    switch (action) {
      case 'link':
        if (valueStr) {
          window.open(valueStr, '_blank', 'noopener,noreferrer')
        }
        break

      case 'phone':
        if (valueStr) {
          window.location.href = `tel:${valueStr.replace(/[^0-9]/g, '')}`
        }
        break

      case 'map':
        // 카카오맵 또는 네이버맵 연동
        if (valueStr) {
          // 좌표인 경우 (lat,lng 형식)
          if (valueStr.includes(',')) {
            const [lat, lng] = valueStr.split(',')
            window.open(`https://map.kakao.com/link/map/${lat},${lng}`, '_blank')
          } else {
            // 주소인 경우
            window.open(`https://map.kakao.com/link/search/${encodeURIComponent(valueStr)}`, '_blank')
          }
        }
        break

      case 'copy':
        if (valueStr) {
          navigator.clipboard.writeText(valueStr).then(() => {
            // TODO: 토스트 알림
            alert('복사되었습니다')
          })
        }
        break

      case 'share':
        if (navigator.share) {
          navigator.share({
            title: '청첩장',
            text: valueStr || '결혼식에 초대합니다',
            url: window.location.href,
          }).catch(() => {
            // 공유 취소됨
          })
        } else {
          // 공유 API 미지원 시 URL 복사
          navigator.clipboard.writeText(window.location.href).then(() => {
            alert('링크가 복사되었습니다')
          })
        }
        break

      case 'contact-modal':
        setContactModalOpen(true)
        break

      case 'rsvp-modal':
        setRsvpModalOpen(true)
        break

      case 'guestbook-modal':
        setGuestbookModalOpen(true)
        break

      case 'show-block':
        // targetBlockType에 따라 적절한 모달 열기
        if (targetBlockType === 'message') {
          setGuestbookModalOpen(true)
        }
        break
    }
  }, [action, value, editable, targetBlockType])

  // 액션별 아이콘
  const ActionIcon = useMemo(() => {
    // 커스텀 아이콘이 지정된 경우 우선 사용
    if (icon) {
      return getPresetIcon(icon, 20)
    }

    // 기본 액션별 아이콘
    switch (action) {
      case 'link':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        )

      case 'phone':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        )

      case 'map':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        )

      case 'copy':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )

      case 'share':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        )

      case 'contact-modal':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        )

      case 'rsvp-modal':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        )

      default:
        return null
    }
  }, [action, icon])

  return (
    <>
      <button
        type="button"
        className={`se2-button-element se2-button-element--${action} ${className}`}
        style={buttonStyle}
        onClick={handleClick}
        disabled={editable}
      >
        {ActionIcon}
        <span>{label}</span>
      </button>

      {/* 연락하기 모달 */}
      {action === 'contact-modal' && (
        <ContactModal
          open={contactModalOpen}
          onOpenChange={setContactModalOpen}
          data={data}
        />
      )}

      {/* RSVP 모달 */}
      {action === 'rsvp-modal' && (
        <RsvpModal
          open={rsvpModalOpen}
          onOpenChange={setRsvpModalOpen}
          invitationId={document.id}
          data={data}
          config={data.rsvp}
        />
      )}

      {/* 방명록 모달 */}
      {(action === 'guestbook-modal' || (action === 'show-block' && targetBlockType === 'message')) && (
        <GuestbookModal
          open={guestbookModalOpen}
          onOpenChange={setGuestbookModalOpen}
          invitationId={document.id}
          config={data.guestbook}
        />
      )}
    </>
  )
}

// ============================================
// Exports
// ============================================

export { ButtonElement as default }
