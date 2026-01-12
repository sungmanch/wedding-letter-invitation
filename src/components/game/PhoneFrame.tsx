'use client'

import { ReactNode } from 'react'

interface PhoneFrameProps {
  children: ReactNode
  width?: number
  height?: number
  className?: string
}

export function PhoneFrame({
  children,
  width = 280,
  height = 560,
  className = ''
}: PhoneFrameProps) {
  const bezelWidth = 8
  const notchHeight = 24
  const notchWidth = 80
  const bottomBezel = 16

  const contentWidth = width - (bezelWidth * 2)
  // bezelWidth(top) + notchHeight + bottomBezel를 제외한 높이
  const contentHeight = height - bezelWidth - notchHeight - bottomBezel

  return (
    <div
      className={`relative ${className}`}
      style={{ width, height }}
    >
      {/* Phone body */}
      <div
        className="absolute inset-0 rounded-[28px]"
        style={{
          background: 'linear-gradient(145deg, #2d2d2d 0%, #1a1a1a 100%)',
          boxShadow: `
            0 20px 60px rgba(0, 0, 0, 0.3),
            0 8px 25px rgba(0, 0, 0, 0.2),
            inset 0 1px 1px rgba(255, 255, 255, 0.1)
          `,
        }}
      />

      {/* Screen bezel highlight */}
      <div
        className="absolute rounded-[20px]"
        style={{
          top: bezelWidth - 1,
          left: bezelWidth - 1,
          right: bezelWidth - 1,
          bottom: bezelWidth - 1 + bottomBezel - bezelWidth,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      {/* Notch */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: bezelWidth,
          width: notchWidth,
          height: notchHeight,
          background: '#1a1a1a',
          borderRadius: '0 0 12px 12px',
          zIndex: 10,
        }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
          style={{ background: '#0a0a0a', boxShadow: 'inset 0 0 2px rgba(255,255,255,0.2)' }}
        />
      </div>

      {/* Screen content area */}
      <div
        className="absolute overflow-hidden"
        style={{
          top: bezelWidth + notchHeight,
          left: bezelWidth,
          width: contentWidth,
          height: contentHeight,
          borderRadius: '0 0 20px 20px',
          background: 'var(--bg-pure)',
        }}
      >
        <div className="w-full h-full overflow-y-auto scrollbar-blush">
          {children}
        </div>
      </div>

      {/* Home indicator */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: 6,
          width: 100,
          height: 4,
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: 2,
        }}
      />
    </div>
  )
}
