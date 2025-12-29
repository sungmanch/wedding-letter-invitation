/**
 * Super Editor v2 - useFontLoader Hook
 *
 * 편집 모드에서 타이포그래피 프리셋 변경 시 폰트 자동 로드
 */

'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import type { StyleSystem, TypographyPresetId } from '../schema/types'
import {
  loadStyleFonts,
  loadAllPresetFonts,
  loadPresetFonts,
} from '../fonts/loader'

// ============================================
// Types
// ============================================

interface FontLoaderState {
  isLoading: boolean
  loadedFonts: string[]
  error: string | null
}

interface UseFontLoaderOptions {
  /**
   * 편집 모드: 모든 프리셋 폰트 미리 로드
   * 공유 모드: 현재 스타일의 폰트만 로드
   */
  mode: 'edit' | 'view'
  /**
   * 현재 스타일 (mode='view'일 때 필수)
   */
  style?: StyleSystem
}

interface UseFontLoaderReturn extends FontLoaderState {
  /**
   * 수동으로 프리셋 폰트 로드
   */
  loadPreset: (presetId: TypographyPresetId) => Promise<void>
  /**
   * 모든 폰트 다시 로드
   */
  reload: () => Promise<void>
}

// ============================================
// Hook
// ============================================

export function useFontLoader(options: UseFontLoaderOptions): UseFontLoaderReturn {
  const { mode, style } = options
  const [state, setState] = useState<FontLoaderState>({
    isLoading: false,
    loadedFonts: [],
    error: null,
  })

  // 이전 프리셋 ID 추적 (변경 감지용)
  const prevPresetRef = useRef<string | undefined>(undefined)

  // 현재 옵션을 ref로 추적 (useEffect 내에서 사용)
  const optionsRef = useRef({ mode, style })
  optionsRef.current = { mode, style }

  // 폰트 로드 실행
  const loadFonts = useCallback(async () => {
    const { mode: currentMode, style: currentStyle } = optionsRef.current

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      if (currentMode === 'edit') {
        // 편집 모드: 모든 프리셋 폰트 로드
        const result = await loadAllPresetFonts()
        setState({
          isLoading: false,
          loadedFonts: result.loaded,
          error: result.failed.length > 0 ? `Failed to load: ${result.failed.join(', ')}` : null,
        })
      } else if (currentStyle) {
        // 공유 모드: 현재 스타일의 폰트만 로드
        const result = await loadStyleFonts(currentStyle)
        setState({
          isLoading: false,
          loadedFonts: result.loaded,
          error: result.failed.length > 0 ? `Failed to load: ${result.failed.join(', ')}` : null,
        })
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }))
    }
  }, [])

  // 초기 로드
  useEffect(() => {
    loadFonts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // 최초 마운트 시만 실행

  // 프리셋 변경 감지 (편집 모드에서 새 프리셋 선택 시)
  useEffect(() => {
    const currentPreset = style?.typography?.preset
    if (currentPreset && currentPreset !== prevPresetRef.current) {
      prevPresetRef.current = currentPreset
      // 새 프리셋 폰트 로드
      loadPresetFonts(currentPreset).then(result => {
        if (result.loaded.length > 0) {
          setState(prev => ({
            ...prev,
            loadedFonts: [...new Set([...prev.loadedFonts, ...result.loaded])],
          }))
        }
      })
    }
  }, [style?.typography?.preset])

  // 수동 프리셋 로드
  const loadPreset = useCallback(async (presetId: TypographyPresetId) => {
    setState(prev => ({ ...prev, isLoading: true }))
    try {
      const result = await loadPresetFonts(presetId)
      setState(prev => ({
        ...prev,
        isLoading: false,
        loadedFonts: [...new Set([...prev.loadedFonts, ...result.loaded])],
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }))
    }
  }, [])

  return {
    ...state,
    loadPreset,
    reload: loadFonts,
  }
}

// ============================================
// 편집 모드 전용 간편 훅
// ============================================

/**
 * 편집 모드에서 모든 폰트를 미리 로드하는 훅
 */
export function useEditorFonts() {
  return useFontLoader({ mode: 'edit' })
}

// ============================================
// 공유 모드 전용 간편 훅
// ============================================

/**
 * 공유 모드에서 현재 스타일의 폰트만 로드하는 훅
 */
export function useViewerFonts(style: StyleSystem) {
  return useFontLoader({ mode: 'view', style })
}
