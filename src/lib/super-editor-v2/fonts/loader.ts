/**
 * Super Editor v2 - Font Loader
 *
 * 두 가지 모드:
 * 1. 편집 모드: 모든 폰트 동적 로딩 (사용자가 프리셋 선택 시 즉시 로드)
 * 2. 공유 모드: 해당 청첩장이 사용하는 폰트만 선택적 로딩
 */

import {
  TYPOGRAPHY_PRESETS,
  type TypographyPreset,
  type FontStack,
} from '../presets/typography-presets'
import type { TypographyPresetId, StyleSystem } from '../schema/types'

// ============================================
// Types
// ============================================

interface FontLoadResult {
  success: boolean
  loaded: string[]
  failed: string[]
}

// ============================================
// 로드된 폰트 추적
// ============================================

const loadedFonts = new Set<string>()
const loadingFonts = new Map<string, Promise<boolean>>()

// ============================================
// Google Fonts URL 빌더
// ============================================

/**
 * Google Fonts URL 생성
 * @example
 * buildGoogleFontsUrl(['Playfair Display:400,600', 'Noto Serif KR:400,700'])
 * // => 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Noto+Serif+KR:wght@400;700&display=swap'
 */
export function buildGoogleFontsUrl(fontSpecs: string[]): string {
  if (fontSpecs.length === 0) return ''

  const families = fontSpecs.map(spec => {
    const [name, weights] = spec.split(':')
    const encodedName = name.replace(/ /g, '+')

    if (!weights) {
      return `family=${encodedName}`
    }

    const weightStr = weights.split(',').join(';')
    return `family=${encodedName}:wght@${weightStr}`
  })

  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`
}

/**
 * FontStack에서 Google Fonts URL 생성
 */
export function buildUrlFromFontStack(stack: FontStack): string | null {
  if (!stack.googleFonts || stack.googleFonts.length === 0) {
    return null
  }
  return buildGoogleFontsUrl([...stack.googleFonts])
}

/**
 * 타이포그래피 프리셋에서 Google Fonts URL 생성
 */
export function buildUrlFromPreset(presetId: TypographyPresetId): string {
  const preset = TYPOGRAPHY_PRESETS[presetId]
  if (!preset) return ''

  const allFonts: string[] = []

  // display, heading, body 각각의 googleFonts 수집
  const stacks = [preset.fontStacks.display, preset.fontStacks.heading, preset.fontStacks.body]

  for (const stack of stacks) {
    if (stack.googleFonts && stack.googleFonts.length > 0) {
      for (const font of stack.googleFonts) {
        if (!allFonts.includes(font)) {
          allFonts.push(font)
        }
      }
    }
  }

  return buildGoogleFontsUrl(allFonts)
}

/**
 * StyleSystem에서 사용하는 모든 Google Fonts URL 생성
 * (공유 페이지용 - 해당 청첩장이 사용하는 폰트만)
 */
export function buildUrlFromStyle(style: StyleSystem): string {
  const allFonts: string[] = []

  // 1. 프리셋 폰트
  if (style.typography?.preset) {
    const preset = TYPOGRAPHY_PRESETS[style.typography.preset]
    if (preset) {
      const stacks = [preset.fontStacks.display, preset.fontStacks.heading, preset.fontStacks.body]
      for (const stack of stacks) {
        if (stack.googleFonts) {
          for (const font of stack.googleFonts) {
            if (!allFonts.includes(font)) {
              allFonts.push(font)
            }
          }
        }
      }
    }
  }

  // 2. 커스텀 폰트 (fontStacks.display/heading/body가 문자열일 때)
  // 커스텀 폰트는 font-family 문자열이므로 Google Fonts로 처리 불가
  // → globals.css @font-face 또는 CDN 사용 필요

  return buildGoogleFontsUrl(allFonts)
}

// ============================================
// 동적 폰트 로딩 (클라이언트)
// ============================================

/**
 * 스타일시트 동적 로드
 */
function loadStylesheet(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // 이미 로드된 스타일시트인지 확인
    const existing = document.querySelector(`link[href="${url}"]`)
    if (existing) {
      resolve()
      return
    }

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = url
    link.onload = () => resolve()
    link.onerror = () => reject(new Error(`Failed to load: ${url}`))
    document.head.appendChild(link)
  })
}

/**
 * 단일 FontStack 로드
 */
async function loadFontStack(stack: FontStack): Promise<boolean> {
  const primaryFont = stack.family[0]

  // 이미 로드됨
  if (loadedFonts.has(primaryFont)) {
    return true
  }

  // 로딩 중
  if (loadingFonts.has(primaryFont)) {
    return loadingFonts.get(primaryFont)!
  }

  // Google Fonts가 없으면 (로컬 폰트) 성공으로 간주
  if (!stack.googleFonts || stack.googleFonts.length === 0) {
    loadedFonts.add(primaryFont)
    return true
  }

  const loadPromise = (async () => {
    try {
      const url = buildGoogleFontsUrl([...stack.googleFonts!])
      await loadStylesheet(url)

      // 폰트 실제 로드 대기 (브라우저 Font Loading API)
      if ('fonts' in document) {
        await document.fonts.load(`400 16px "${primaryFont}"`)
      }

      loadedFonts.add(primaryFont)
      return true
    } catch (error) {
      console.error(`Failed to load font: ${primaryFont}`, error)
      return false
    } finally {
      loadingFonts.delete(primaryFont)
    }
  })()

  loadingFonts.set(primaryFont, loadPromise)
  return loadPromise
}

/**
 * 타이포그래피 프리셋의 모든 폰트 로드
 */
export async function loadPresetFonts(presetId: TypographyPresetId): Promise<FontLoadResult> {
  const preset = TYPOGRAPHY_PRESETS[presetId]
  if (!preset) {
    return { success: false, loaded: [], failed: [`Unknown preset: ${presetId}`] }
  }

  const stacks = [preset.fontStacks.display, preset.fontStacks.heading, preset.fontStacks.body]
  const loaded: string[] = []
  const failed: string[] = []

  await Promise.all(
    stacks.map(async (stack) => {
      const success = await loadFontStack(stack)
      const fontName = stack.family[0]
      if (success) {
        loaded.push(fontName)
      } else {
        failed.push(fontName)
      }
    })
  )

  return {
    success: failed.length === 0,
    loaded,
    failed,
  }
}

/**
 * StyleSystem의 폰트 로드
 */
export async function loadStyleFonts(style: StyleSystem): Promise<FontLoadResult> {
  const loaded: string[] = []
  const failed: string[] = []

  // 프리셋 폰트 로드
  if (style.typography?.preset) {
    const result = await loadPresetFonts(style.typography.preset)
    loaded.push(...result.loaded)
    failed.push(...result.failed)
  }

  return {
    success: failed.length === 0,
    loaded: [...new Set(loaded)],
    failed: [...new Set(failed)],
  }
}

/**
 * 모든 프리셋의 폰트 로드 (편집 모드용)
 * 에디터에서 폰트 프리뷰를 위해 모든 폰트를 미리 로드
 */
export async function loadAllPresetFonts(): Promise<FontLoadResult> {
  const loaded: string[] = []
  const failed: string[] = []

  const presetIds = Object.keys(TYPOGRAPHY_PRESETS) as TypographyPresetId[]

  await Promise.all(
    presetIds.map(async (presetId) => {
      const result = await loadPresetFonts(presetId)
      loaded.push(...result.loaded)
      failed.push(...result.failed)
    })
  )

  return {
    success: failed.length === 0,
    loaded: [...new Set(loaded)],
    failed: [...new Set(failed)],
  }
}

// ============================================
// SSR용 Link 태그 생성
// ============================================

/**
 * Next.js Head에 삽입할 link 태그용 href 배열 반환
 * (공유 페이지의 generateMetadata에서 사용)
 */
export function getFontLinkHrefs(style: StyleSystem): string[] {
  const hrefs: string[] = []

  // Google Fonts
  const googleUrl = buildUrlFromStyle(style)
  if (googleUrl) {
    hrefs.push(googleUrl)
  }

  // CDN 폰트 (Pretendard 등)
  // TODO: 프리셋에서 CDN URL도 수집 필요 시 확장

  return hrefs
}

/**
 * 정적 HTML용 <link> 태그 문자열 생성
 */
export function buildFontLinkTags(style: StyleSystem): string {
  const hrefs = getFontLinkHrefs(style)
  if (hrefs.length === 0) return ''

  const lines = [
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    ...hrefs.map(href => `<link href="${href}" rel="stylesheet">`),
  ]

  return lines.join('\n')
}

// ============================================
// 폰트 상태 확인
// ============================================

/**
 * 특정 폰트가 로드되었는지 확인
 */
export function isFontLoaded(fontFamily: string): boolean {
  return loadedFonts.has(fontFamily)
}

/**
 * 로드된 모든 폰트 목록
 */
export function getLoadedFonts(): string[] {
  return Array.from(loadedFonts)
}

/**
 * 폰트 로드 상태 초기화 (테스트용)
 */
export function resetFontLoader(): void {
  loadedFonts.clear()
  loadingFonts.clear()
}
