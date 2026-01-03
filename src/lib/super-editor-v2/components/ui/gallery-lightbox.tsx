'use client'

/**
 * Gallery Lightbox Component
 *
 * 갤러리 이미지 전체화면 뷰어
 * - 전체화면 모달로 이미지 표시
 * - GSAP 드래그로 스와이프 네비게이션
 * - 핀치 줌 지원 예정
 * - 좌우 화살표 네비게이션
 */

import { useState, useRef, useCallback, useEffect, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

// GSAP 플러그인 등록
if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP)
}

// ============================================
// Types
// ============================================

export interface GalleryLightboxProps {
  images: string[]
  initialIndex?: number
  open: boolean
  onClose: () => void
}

// ============================================
// Main Component
// ============================================

export function GalleryLightbox({
  images,
  initialIndex = 0,
  open,
  onClose,
}: GalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const currentX = useRef(0)

  const totalSlides = images.length

  // initialIndex 변경 시 인덱스 업데이트
  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex)
    }
  }, [open, initialIndex])

  // 슬라이드 이동
  const goTo = useCallback(
    (index: number, animate = true) => {
      if (totalSlides === 0) return

      let targetIndex = Math.max(0, Math.min(index, totalSlides - 1))
      setCurrentIndex(targetIndex)

      if (trackRef.current && containerRef.current) {
        const slideWidth = containerRef.current.offsetWidth
        gsap.to(trackRef.current, {
          x: -targetIndex * slideWidth,
          duration: animate ? 0.3 : 0,
          ease: 'power2.out',
        })
      }
    },
    [totalSlides]
  )

  // 이전/다음 슬라이드
  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      goTo(currentIndex - 1)
    }
  }, [currentIndex, goTo])

  const goNext = useCallback(() => {
    if (currentIndex < totalSlides - 1) {
      goTo(currentIndex + 1)
    }
  }, [currentIndex, totalSlides, goTo])

  // 키보드 네비게이션
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          goPrev()
          break
        case 'ArrowRight':
          goNext()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose, goPrev, goNext])

  // 열릴 때 초기 위치 설정
  useEffect(() => {
    if (open && trackRef.current && containerRef.current) {
      const slideWidth = containerRef.current.offsetWidth
      gsap.set(trackRef.current, { x: -initialIndex * slideWidth })
    }
  }, [open, initialIndex])

  // GSAP 드래그 핸들링
  useGSAP(
    () => {
      if (!open || !containerRef.current || images.length <= 1) return

      const container = containerRef.current
      const track = trackRef.current
      if (!track) return

      const slideWidth = container.offsetWidth

      const handlePointerDown = (e: PointerEvent) => {
        // 버튼 클릭은 무시
        if ((e.target as HTMLElement).closest('button')) return

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
        if (Math.abs(diff) > slideWidth * 0.15 || Math.abs(velocity) > 0.3) {
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
      dependencies: [open, currentIndex, totalSlides, images.length, goTo],
    }
  )

  // 모달 열림 시 body 스크롤 방지
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  const overlayStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 99999,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    display: 'flex',
    flexDirection: 'column',
  }

  const headerStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    zIndex: 10,
  }

  const closeButtonStyle: CSSProperties = {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    color: 'white',
    transition: 'background-color 0.2s',
  }

  const counterStyle: CSSProperties = {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '14px',
    fontWeight: 500,
  }

  const containerStyle: CSSProperties = {
    flex: 1,
    overflow: 'hidden',
    cursor: images.length > 1 ? 'grab' : 'default',
    userSelect: 'none',
    touchAction: 'pan-y pinch-zoom',
    display: 'flex',
    alignItems: 'center',
  }

  const trackStyle: CSSProperties = {
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    willChange: 'transform',
  }

  const slideStyle: CSSProperties = {
    flex: '0 0 100vw',
    width: '100vw',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px 20px',
    boxSizing: 'border-box',
  }

  const imageStyle: CSSProperties = {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    borderRadius: '4px',
  }

  const navButtonStyle: CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    color: 'white',
    transition: 'background-color 0.2s, opacity 0.2s',
    zIndex: 10,
  }

  // Portal을 사용하여 document.body에 직접 렌더링 (지도 등 높은 z-index 요소 위에 표시)
  return createPortal(
    <div
      style={overlayStyle}
      onClick={(e) => {
        // 배경 클릭 시 닫기 (이미지나 버튼 클릭 제외)
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label="이미지 뷰어"
    >
      {/* Header */}
      <div style={headerStyle}>
        <span style={counterStyle}>
          {currentIndex + 1} / {totalSlides}
        </span>
        <button
          style={closeButtonStyle}
          onClick={onClose}
          aria-label="닫기"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Image Viewer */}
      <div ref={containerRef} style={containerStyle}>
        <div ref={trackRef} style={trackStyle}>
          {images.map((src, index) => (
            <div key={index} style={slideStyle}>
              <img
                src={src}
                alt={`갤러리 이미지 ${index + 1}`}
                style={imageStyle}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons (Desktop) */}
      {images.length > 1 && (
        <>
          <button
            style={{
              ...navButtonStyle,
              left: '16px',
              opacity: currentIndex === 0 ? 0.3 : 1,
              cursor: currentIndex === 0 ? 'default' : 'pointer',
            }}
            onClick={goPrev}
            disabled={currentIndex === 0}
            aria-label="이전 이미지"
            onMouseEnter={(e) => {
              if (currentIndex > 0) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            style={{
              ...navButtonStyle,
              right: '16px',
              opacity: currentIndex === totalSlides - 1 ? 0.3 : 1,
              cursor: currentIndex === totalSlides - 1 ? 'default' : 'pointer',
            }}
            onClick={goNext}
            disabled={currentIndex === totalSlides - 1}
            aria-label="다음 이미지"
            onMouseEnter={(e) => {
              if (currentIndex < totalSlides - 1) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {images.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            zIndex: 10,
          }}
        >
          {images.map((_, index) => (
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
                    ? 'white'
                    : 'rgba(255, 255, 255, 0.4)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
              }}
              aria-label={`이미지 ${index + 1}로 이동`}
            />
          ))}
        </div>
      )}
    </div>,
    document.body
  )
}

// ============================================
// Exports
// ============================================

export { GalleryLightbox as default }
