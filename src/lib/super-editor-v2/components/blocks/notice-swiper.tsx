'use client'

/**
 * Notice Swiper Component
 *
 * notice.items[] 배열을 카드 캐러셀로 렌더링
 * - 좌우 스와이프 지원 (GSAP 드래그)
 * - 각 카드별 아이콘, 배경색, 테두리색 커스터마이징
 * - Pagination dots
 */

import { useState, useRef, useCallback, useMemo, type CSSProperties } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import type { NoticeItem } from '../../schema/types'
import { useDocument } from '../../context/document-context'
import { useBlockTokens } from '../../context/block-context'
import {
  NOTICE_ICON_MAP,
  NOTICE_CARD_COLORS,
  NOTICE_CARD_TEMPLATE,
} from '../../presets/blocks/notice/card-icon'

// GSAP 플러그인 등록
if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP)
}

// ============================================
// Types
// ============================================

export interface NoticeSwiperProps {
  className?: string
}

// ============================================
// Main Component
// ============================================

export function NoticeSwiper({ className }: NoticeSwiperProps) {
  const { document } = useDocument()
  const tokens = useBlockTokens()
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const currentX = useRef(0)

  // notice.items 데이터 가져오기
  const items: NoticeItem[] = useMemo(() => {
    return document?.data?.notice?.items ?? []
  }, [document?.data?.notice?.items])

  const totalSlides = items.length

  // 슬라이드 이동
  const goTo = useCallback(
    (index: number, animate = true) => {
      if (totalSlides === 0) return

      let targetIndex = ((index % totalSlides) + totalSlides) % totalSlides
      setCurrentIndex(targetIndex)

      if (trackRef.current && containerRef.current) {
        const slideWidth = containerRef.current.offsetWidth
        gsap.to(trackRef.current, {
          x: -targetIndex * slideWidth,
          duration: animate ? 0.4 : 0,
          ease: 'power2.out',
        })
      }
    },
    [totalSlides]
  )

  // GSAP 드래그 핸들링
  useGSAP(
    () => {
      if (!containerRef.current || items.length <= 1) return

      const container = containerRef.current
      const track = trackRef.current
      if (!track) return

      const slideWidth = container.offsetWidth

      const handlePointerDown = (e: PointerEvent) => {
        isDragging.current = true
        startX.current = e.clientX
        currentX.current = (gsap.getProperty(track, 'x') as number) || 0

        gsap.killTweensOf(track)
        container.setPointerCapture(e.pointerId)
      }

      const handlePointerMove = (e: PointerEvent) => {
        if (!isDragging.current) return

        const diff = e.clientX - startX.current
        const newX = currentX.current + diff

        // 경계 저항감 (rubber band effect)
        const minX = -(totalSlides - 1) * slideWidth
        const maxX = 0

        let boundedX = newX
        if (newX > maxX) {
          boundedX = maxX + (newX - maxX) * 0.3
        } else if (newX < minX) {
          boundedX = minX + (newX - minX) * 0.3
        }

        gsap.set(track, { x: boundedX })
      }

      const handlePointerUp = (e: PointerEvent) => {
        if (!isDragging.current) return
        isDragging.current = false

        container.releasePointerCapture(e.pointerId)

        const diff = e.clientX - startX.current
        const velocity = diff / 100

        // 스냅할 인덱스 결정
        let targetIndex = currentIndex
        if (Math.abs(diff) > slideWidth * 0.2 || Math.abs(velocity) > 0.5) {
          if (diff > 0) {
            targetIndex = currentIndex - 1
          } else {
            targetIndex = currentIndex + 1
          }
        }

        // 경계 체크
        targetIndex = Math.max(0, Math.min(targetIndex, totalSlides - 1))
        goTo(targetIndex)
      }

      container.addEventListener('pointerdown', handlePointerDown)
      container.addEventListener('pointermove', handlePointerMove)
      container.addEventListener('pointerup', handlePointerUp)
      container.addEventListener('pointercancel', handlePointerUp)

      return () => {
        container.removeEventListener('pointerdown', handlePointerDown)
        container.removeEventListener('pointermove', handlePointerMove)
        container.removeEventListener('pointerup', handlePointerUp)
        container.removeEventListener('pointercancel', handlePointerUp)
      }
    },
    {
      scope: containerRef,
      dependencies: [currentIndex, totalSlides, items.length, goTo],
    }
  )

  // 빈 상태
  if (items.length === 0) {
    return (
      <div
        className={className}
        style={{
          padding: '40px 24px',
          textAlign: 'center',
          color: tokens.fgMuted,
        }}
      >
        공지사항을 추가해주세요
      </div>
    )
  }

  const containerStyle: CSSProperties = {
    width: '100%',
    overflow: 'hidden',
    cursor: items.length > 1 ? 'grab' : 'default',
    userSelect: 'none',
    touchAction: 'pan-y pinch-zoom',
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={containerStyle}
      data-component="notice-swiper"
    >
      {/* Track */}
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          willChange: 'transform',
        }}
      >
        {items.map((item, index) => (
          <NoticeCard
            key={index}
            item={item}
            index={index}
            tokens={tokens}
          />
        ))}
      </div>

      {/* Pagination Dots */}
      {items.length > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '24px',
          }}
        >
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              style={{
                width: index === currentIndex ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor:
                  index === currentIndex
                    ? tokens.accentDefault
                    : tokens.borderDefault,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              aria-label={`공지사항 ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// Notice Card Component
// ============================================

interface NoticeCardProps {
  item: NoticeItem
  index: number
  tokens: ReturnType<typeof useBlockTokens>
}

function NoticeCard({ item, index, tokens }: NoticeCardProps) {
  // 아이콘 URL 결정
  const iconUrl = useMemo(() => {
    if (item.iconType && item.iconType in NOTICE_ICON_MAP) {
      return NOTICE_ICON_MAP[item.iconType as keyof typeof NOTICE_ICON_MAP]
    }
    // 기본 아이콘 (순환)
    const defaultIcons = Object.values(NOTICE_ICON_MAP)
    return defaultIcons[index % defaultIcons.length]
  }, [item.iconType, index])

  // 카드 색상 결정
  const cardColors = useMemo(() => {
    if (item.backgroundColor && item.borderColor) {
      return {
        background: item.backgroundColor,
        border: item.borderColor,
      }
    }
    // 기본 색상 (순환)
    const colorKeys = Object.keys(NOTICE_CARD_COLORS) as Array<
      keyof typeof NOTICE_CARD_COLORS
    >
    const colorKey = colorKeys[index % colorKeys.length]
    return NOTICE_CARD_COLORS[colorKey]
  }, [item.backgroundColor, item.borderColor, index])

  const template = NOTICE_CARD_TEMPLATE

  const cardStyle: CSSProperties = {
    flex: '0 0 100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: `${template.container.layout.gap}px`,
    padding: `${template.container.style.padding}px`,
    margin: '0 24px',
    backgroundColor: cardColors.background,
    border: `${template.container.style.borderWidth}px ${template.container.style.borderStyle} ${cardColors.border}`,
    borderRadius: `${template.container.style.borderRadius}px`,
    boxSizing: 'border-box',
  }

  const iconStyle: CSSProperties = {
    width: `${template.icon.sizing.width.value}${template.icon.sizing.width.unit}`,
    height: `${template.icon.sizing.height.value}${template.icon.sizing.height.unit}`,
    objectFit: template.icon.objectFit,
  }

  const titleStyle: CSSProperties = {
    fontFamily: template.title.style.fontFamily,
    fontSize: `${template.title.style.fontSize}px`,
    fontWeight: template.title.style.fontWeight,
    color: tokens.fgEmphasis,
    textAlign: template.title.style.textAlign,
    lineHeight: template.title.style.lineHeight,
    margin: 0,
  }

  const contentStyle: CSSProperties = {
    fontFamily: template.content.style.fontFamily,
    fontSize: `${template.content.style.fontSize}px`,
    fontWeight: template.content.style.fontWeight,
    color: tokens.fgDefault,
    textAlign: template.content.style.textAlign,
    lineHeight: template.content.style.lineHeight,
    margin: 0,
    whiteSpace: 'pre-wrap',
  }

  return (
    <div style={cardStyle} data-notice-card={index}>
      {/* Icon */}
      <img src={iconUrl} alt="" style={iconStyle} />

      {/* Title */}
      <h3 style={titleStyle}>{item.title}</h3>

      {/* Content */}
      <p style={contentStyle}>{item.content}</p>
    </div>
  )
}

export default NoticeSwiper
