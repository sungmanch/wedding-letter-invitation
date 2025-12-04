'use client'

import { useMemo } from 'react'
import { useSuperEditor } from '../context'
import { createNodeRenderer } from '../primitives'
import type { PrimitiveNode } from '../schema/primitives'

interface PreviewFrameProps {
  className?: string
  width?: number
  height?: number
}

export function PreviewFrame({
  className = '',
  width = 375,
  height = 667,
}: PreviewFrameProps) {
  const { state, selectNode, getCurrentScreen } = useSuperEditor()
  const { userData, style, mode, selectedNodeId } = state

  const currentScreen = getCurrentScreen()

  // 렌더링 컨텍스트 생성
  const renderContext = useMemo(() => {
    return createNodeRenderer({
      data: (userData?.data as Record<string, unknown>) || {},
      mode,
      selectedNodeId: selectedNodeId || undefined,
      onSelectNode: selectNode,
    })
  }, [userData, mode, selectedNodeId, selectNode])

  // 스타일 테마를 CSS 변수로 변환
  const themeStyles = useMemo(() => {
    if (!style?.theme) return {}

    const vars: Record<string, string> = {}

    // 색상
    if (style.theme.colors) {
      const { colors } = style.theme
      if (colors.primary) vars['--color-primary'] = colors.primary[500] || colors.primary.toString()
      if (colors.secondary) vars['--color-secondary'] = colors.secondary[500] || colors.secondary.toString()
      if (colors.background?.default) vars['--color-background'] = colors.background.default
      if (colors.text?.primary) vars['--color-text'] = colors.text.primary
    }

    // 폰트
    if (style.theme.typography?.fonts) {
      const { fonts } = style.theme.typography
      if (fonts.heading) vars['--font-heading'] = fonts.heading.family
      if (fonts.body) vars['--font-body'] = fonts.body.family
    }

    return vars
  }, [style])

  if (!currentScreen) {
    return (
      <div
        className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="text-center text-gray-500">
          <svg
            className="w-12 h-12 mx-auto mb-2 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm">템플릿을 선택하세요</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative bg-white shadow-xl rounded-lg overflow-hidden ${className}`}
      style={{
        width,
        height,
        ...themeStyles,
      }}
    >
      {/* 모바일 프레임 */}
      <div className="absolute inset-0 overflow-auto">
        {renderContext.renderNode(currentScreen)}
      </div>

      {/* 편집 모드 오버레이 */}
      {mode === 'edit' && (
        <div className="absolute top-2 right-2 flex gap-1 z-50">
          <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
            편집 모드
          </span>
        </div>
      )}
    </div>
  )
}

// 화면 네비게이터
export function ScreenNavigator() {
  const { state, setActiveScreen } = useSuperEditor()
  const { layout, activeScreenIndex } = state

  if (!layout?.screens || layout.screens.length <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 py-3">
      {layout.screens.map((screen, index) => (
        <button
          key={screen.id}
          onClick={() => setActiveScreen(index)}
          className={`
            w-2.5 h-2.5 rounded-full transition-all
            ${index === activeScreenIndex
              ? 'bg-blue-500 scale-125'
              : 'bg-gray-300 hover:bg-gray-400'
            }
          `}
          title={screen.name || `화면 ${index + 1}`}
        />
      ))}
    </div>
  )
}

// 미리보기 컨테이너 (프레임 + 네비게이터)
export function PreviewContainer({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <PreviewFrame />
      <ScreenNavigator />
    </div>
  )
}
