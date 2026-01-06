/**
 * OG 이미지 자동 생성 유틸리티
 *
 * Hero 블록의 이미지를 1200x630 (1.91:1) 비율로 크롭하여
 * OG 이미지로 사용할 수 있도록 변환
 */

import type { Block, Element, WeddingData } from '../schema/types'

// OG 이미지 표준 크기
const OG_WIDTH = 1200
const OG_HEIGHT = 630

/**
 * WeddingData에서 binding 경로로 값 추출
 */
function getBindingValue(data: WeddingData, binding: string): string | null {
  const parts = binding.split('.')
  let current: unknown = data

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part]
    } else {
      return null
    }
  }

  return typeof current === 'string' ? current : null
}

/**
 * Hero 블록에서 메인 이미지 URL 추출
 */
export function extractHeroImageUrl(blocks: Block[], data: WeddingData): string | null {
  // Hero 블록 찾기
  const heroBlock = blocks.find((b) => b.type === 'hero' && b.enabled)
  if (!heroBlock) return null

  // 이미지 요소 찾기 (재귀적으로 children도 탐색)
  const findImageElement = (elements: Element[]): Element | null => {
    for (const el of elements) {
      if (el.props.type === 'image') {
        return el
      }
      // Group의 children 탐색
      if (el.children && el.children.length > 0) {
        const found = findImageElement(el.children)
        if (found) return found
      }
    }
    return null
  }

  const imageElement = findImageElement(heroBlock.elements || [])
  if (!imageElement) return null

  // 1. value에서 직접 URL 가져오기
  if (imageElement.value && typeof imageElement.value === 'string') {
    return imageElement.value
  }

  // 2. binding에서 값 가져오기
  if (imageElement.binding) {
    const boundValue = getBindingValue(data, imageElement.binding)
    if (boundValue) return boundValue
  }

  // 3. fallback binding 확인
  if (imageElement.bindingFallback) {
    const fallbackValue = getBindingValue(data, imageElement.bindingFallback)
    if (fallbackValue) return fallbackValue
  }

  return null
}

/**
 * 이미지 URL을 1200x630 OG 비율로 크롭하여 base64로 반환
 */
export async function generateOgImageFromUrl(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous' // CORS 허용

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = OG_WIDTH
        canvas.height = OG_HEIGHT
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject(new Error('Canvas context를 생성할 수 없습니다'))
          return
        }

        // 이미지 비율 계산
        const imgRatio = img.width / img.height
        const ogRatio = OG_WIDTH / OG_HEIGHT

        let sourceX = 0
        let sourceY = 0
        let sourceWidth = img.width
        let sourceHeight = img.height

        if (imgRatio > ogRatio) {
          // 이미지가 OG보다 더 넓음 → 좌우 크롭
          sourceWidth = img.height * ogRatio
          sourceX = (img.width - sourceWidth) / 2
        } else {
          // 이미지가 OG보다 더 높음 → 상하 크롭 (상단 우선)
          sourceHeight = img.width / ogRatio
          sourceY = 0 // 상단 기준 크롭 (인물 사진 얼굴 고려)
        }

        // 크롭하여 그리기
        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          0,
          0,
          OG_WIDTH,
          OG_HEIGHT
        )

        // base64로 변환 (JPEG, 품질 90%)
        const base64 = canvas.toDataURL('image/jpeg', 0.9)
        resolve(base64)
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => {
      reject(new Error('이미지를 불러올 수 없습니다'))
    }

    img.src = imageUrl
  })
}

/**
 * Hero 블록에서 OG 이미지 생성 (통합 함수)
 *
 * @param blocks - 블록 배열
 * @param data - WeddingData (binding 해결용)
 * @returns base64 이미지 데이터 또는 null
 */
export async function generateOgImageFromHero(
  blocks: Block[],
  data: WeddingData
): Promise<string | null> {
  const imageUrl = extractHeroImageUrl(blocks, data)
  if (!imageUrl) {
    console.warn('Hero 블록에서 이미지를 찾을 수 없습니다')
    return null
  }

  try {
    const base64 = await generateOgImageFromUrl(imageUrl)
    return base64
  } catch (error) {
    console.error('OG 이미지 생성 실패:', error)
    return null
  }
}
