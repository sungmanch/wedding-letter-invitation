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

/**
 * 기본 OG 이미지 생성 (텍스트 기반)
 *
 * 흰 배경에 "신랑이름 ❤️ 신부이름" 텍스트
 */
export function generateDefaultOgImage(data: WeddingData): string {
  const canvas = document.createElement('canvas')
  canvas.width = OG_WIDTH
  canvas.height = OG_HEIGHT
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Canvas context를 생성할 수 없습니다')
  }

  // 흰 배경
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, OG_WIDTH, OG_HEIGHT)

  // 이름 가져오기
  const groomName = data.couple?.groom?.name || data.groom?.name || '신랑'
  const brideName = data.couple?.bride?.name || data.bride?.name || '신부'

  // 텍스트 설정
  const text = `${groomName} ❤️ ${brideName}`

  // 폰트 설정 (시스템 폰트 사용) - 1.2배 크기
  ctx.font = 'bold 86px "Apple SD Gothic Neo", "Malgun Gothic", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // 텍스트 색상 (부드러운 회색)
  ctx.fillStyle = '#4A4A4A'

  // 가운데 배치
  ctx.fillText(text, OG_WIDTH / 2, OG_HEIGHT / 2)

  // 하단에 작은 문구 추가
  ctx.font = '34px "Apple SD Gothic Neo", "Malgun Gothic", sans-serif'
  ctx.fillStyle = '#9CA3AF'
  ctx.fillText('결혼합니다', OG_WIDTH / 2, OG_HEIGHT / 2 + 96)

  return canvas.toDataURL('image/jpeg', 0.9)
}

/**
 * 축하 OG 이미지 생성 (컨페티 포함)
 *
 * 크림색 배경에 다양한 종이 장식과 "신랑이름 ❤️ 신부이름" 텍스트
 */
export function generateCelebrationOgImage(data: WeddingData): string {
  const canvas = document.createElement('canvas')
  canvas.width = OG_WIDTH
  canvas.height = OG_HEIGHT
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Canvas context를 생성할 수 없습니다')
  }

  // 크림색 배경
  ctx.fillStyle = '#FFF9F0'
  ctx.fillRect(0, 0, OG_WIDTH, OG_HEIGHT)

  // 컨페티 색상 팔레트 (축제 느낌)
  const confettiColors = [
    '#FF6B6B', // 빨강
    '#FFD93D', // 노랑
    '#6BCB77', // 초록
    '#4D96FF', // 파랑
    '#FF6BD6', // 핑크
    '#9B59B6', // 보라
    '#FF9F43', // 주황
    '#00D2D3', // 청록
  ]

  // 다양한 종이 장식 그리기
  const confettiItems: Array<{
    x: number
    y: number
    rotation: number
    type: 'rect' | 'circle' | 'triangle' | 'star' | 'streamer'
    size: number
  }> = [
    // 좌상단 영역
    { x: 50, y: 40, rotation: 25, type: 'rect', size: 1 },
    { x: 120, y: 80, rotation: -15, type: 'circle', size: 0.8 },
    { x: 80, y: 140, rotation: 45, type: 'triangle', size: 1.2 },
    { x: 180, y: 60, rotation: -35, type: 'star', size: 1 },
    { x: 40, y: 200, rotation: 60, type: 'streamer', size: 1 },
    { x: 150, y: 180, rotation: -20, type: 'rect', size: 0.7 },
    { x: 220, y: 120, rotation: 30, type: 'circle', size: 1.1 },
    { x: 100, y: 250, rotation: -50, type: 'triangle', size: 0.9 },
    { x: 260, y: 80, rotation: 15, type: 'star', size: 0.8 },
    { x: 200, y: 220, rotation: -40, type: 'rect', size: 1 },
    { x: 300, y: 160, rotation: 55, type: 'circle', size: 0.6 },
    { x: 70, y: 300, rotation: -25, type: 'streamer', size: 0.9 },
    // 우상단 영역
    { x: 950, y: 50, rotation: -30, type: 'rect', size: 1.1 },
    { x: 1020, y: 100, rotation: 20, type: 'circle', size: 0.9 },
    { x: 1100, y: 60, rotation: -45, type: 'triangle', size: 1 },
    { x: 980, y: 160, rotation: 35, type: 'star', size: 1.2 },
    { x: 1140, y: 130, rotation: -15, type: 'streamer', size: 1 },
    { x: 1050, y: 200, rotation: 50, type: 'rect', size: 0.8 },
    { x: 920, y: 220, rotation: -55, type: 'circle', size: 1 },
    { x: 1120, y: 240, rotation: 25, type: 'triangle', size: 0.7 },
    { x: 1000, y: 280, rotation: -35, type: 'star', size: 0.9 },
    { x: 880, y: 120, rotation: 40, type: 'rect', size: 0.6 },
    { x: 1160, y: 80, rotation: -20, type: 'circle', size: 1.1 },
    // 좌하단 영역
    { x: 60, y: 400, rotation: 30, type: 'rect', size: 0.9 },
    { x: 130, y: 480, rotation: -40, type: 'circle', size: 1 },
    { x: 90, y: 540, rotation: 55, type: 'triangle', size: 1.1 },
    { x: 200, y: 420, rotation: -20, type: 'star', size: 0.8 },
    { x: 50, y: 580, rotation: 45, type: 'streamer', size: 1.2 },
    { x: 170, y: 560, rotation: -35, type: 'rect', size: 0.7 },
    { x: 240, y: 500, rotation: 25, type: 'circle', size: 0.9 },
    { x: 110, y: 450, rotation: -50, type: 'triangle', size: 1 },
    { x: 280, y: 550, rotation: 15, type: 'star', size: 1.1 },
    { x: 320, y: 480, rotation: -30, type: 'rect', size: 0.6 },
    // 우하단 영역
    { x: 940, y: 420, rotation: -25, type: 'rect', size: 1 },
    { x: 1010, y: 480, rotation: 35, type: 'circle', size: 0.8 },
    { x: 1090, y: 440, rotation: -50, type: 'triangle', size: 1.2 },
    { x: 970, y: 550, rotation: 20, type: 'star', size: 0.9 },
    { x: 1130, y: 520, rotation: -40, type: 'streamer', size: 1 },
    { x: 1050, y: 580, rotation: 45, type: 'rect', size: 0.7 },
    { x: 900, y: 500, rotation: -15, type: 'circle', size: 1.1 },
    { x: 1160, y: 450, rotation: 30, type: 'triangle', size: 0.8 },
    { x: 880, y: 580, rotation: -55, type: 'star', size: 1 },
    { x: 1020, y: 400, rotation: 50, type: 'rect', size: 0.9 },
  ]

  confettiItems.forEach((item, index) => {
    const color = confettiColors[index % confettiColors.length]
    drawConfettiShape(ctx, item.x, item.y, color, item.rotation, item.type, item.size)
  })

  // 이름 가져오기
  const groomName = data.couple?.groom?.name || data.groom?.name || '신랑'
  const brideName = data.couple?.bride?.name || data.bride?.name || '신부'

  // 텍스트 설정
  const text = `${groomName} ❤️ ${brideName}`

  // 텍스트 그림자 효과
  ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
  ctx.shadowBlur = 10
  ctx.shadowOffsetX = 2
  ctx.shadowOffsetY = 2

  // 폰트 설정
  ctx.font = 'bold 86px "Apple SD Gothic Neo", "Malgun Gothic", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // 텍스트 색상
  ctx.fillStyle = '#4A4A4A'

  // 가운데 배치
  ctx.fillText(text, OG_WIDTH / 2, OG_HEIGHT / 2)

  // 그림자 리셋
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0

  // 하단에 작은 문구 추가
  ctx.font = '34px "Apple SD Gothic Neo", "Malgun Gothic", sans-serif'
  ctx.fillStyle = '#9CA3AF'
  ctx.fillText('결혼합니다', OG_WIDTH / 2, OG_HEIGHT / 2 + 96)

  return canvas.toDataURL('image/jpeg', 0.9)
}

/**
 * 다양한 모양의 컨페티 그리기
 */
function drawConfettiShape(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  rotation: number,
  type: 'rect' | 'circle' | 'triangle' | 'star' | 'streamer',
  size: number
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.scale(size, size)
  ctx.fillStyle = color

  switch (type) {
    case 'rect':
      // 직사각형 종이
      ctx.fillRect(-6, -12, 12, 24)
      break

    case 'circle':
      // 원형 종이
      ctx.beginPath()
      ctx.arc(0, 0, 10, 0, Math.PI * 2)
      ctx.fill()
      break

    case 'triangle':
      // 삼각형 종이
      ctx.beginPath()
      ctx.moveTo(0, -12)
      ctx.lineTo(-10, 10)
      ctx.lineTo(10, 10)
      ctx.closePath()
      ctx.fill()
      break

    case 'star':
      // 별 모양
      drawStar(ctx, 0, 0, 5, 12, 6)
      break

    case 'streamer':
      // 구불구불한 리본
      ctx.strokeStyle = color
      ctx.lineWidth = 4
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(0, -20)
      ctx.quadraticCurveTo(15, -5, 0, 10)
      ctx.quadraticCurveTo(-15, 25, 0, 40)
      ctx.stroke()
      break
  }

  ctx.restore()
}

/**
 * 별 모양 그리기
 */
function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
) {
  let rot = (Math.PI / 2) * 3
  let x = cx
  let y = cy
  const step = Math.PI / spikes

  ctx.beginPath()
  ctx.moveTo(cx, cy - outerRadius)

  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius
    y = cy + Math.sin(rot) * outerRadius
    ctx.lineTo(x, y)
    rot += step

    x = cx + Math.cos(rot) * innerRadius
    y = cy + Math.sin(rot) * innerRadius
    ctx.lineTo(x, y)
    rot += step
  }

  ctx.lineTo(cx, cy - outerRadius)
  ctx.closePath()
  ctx.fill()
}
