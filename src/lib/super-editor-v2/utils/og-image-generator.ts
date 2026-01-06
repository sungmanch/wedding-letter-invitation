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
 * 축하 OG 이미지 생성 (빵빠레/컨페티 포함)
 *
 * 크림색 배경에 컨페티와 "신랑이름 ❤️ 신부이름" 텍스트
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

  // 컨페티 색상 팔레트 (웨딩 테마)
  const confettiColors = [
    '#FFB6C1', // 연분홍
    '#FFD700', // 골드
    '#98D8C8', // 민트
    '#F7DC6F', // 연노랑
    '#DDA0DD', // 연보라
    '#87CEEB', // 하늘색
    '#FFDAB9', // 피치
  ]

  // 컨페티 그리기 (랜덤 시드 고정을 위해 결정적 위치 사용)
  const confettiPositions = [
    // 좌상단 영역
    { x: 80, y: 60, rotation: 15 },
    { x: 150, y: 120, rotation: -30 },
    { x: 60, y: 180, rotation: 45 },
    { x: 200, y: 80, rotation: -15 },
    { x: 120, y: 250, rotation: 60 },
    { x: 250, y: 150, rotation: -45 },
    { x: 180, y: 220, rotation: 30 },
    // 우상단 영역
    { x: 1000, y: 70, rotation: -20 },
    { x: 1100, y: 130, rotation: 35 },
    { x: 1050, y: 200, rotation: -50 },
    { x: 950, y: 160, rotation: 25 },
    { x: 1120, y: 250, rotation: -35 },
    { x: 1020, y: 100, rotation: 40 },
    { x: 1080, y: 180, rotation: -25 },
    // 좌하단 영역
    { x: 100, y: 450, rotation: 20 },
    { x: 180, y: 520, rotation: -40 },
    { x: 60, y: 550, rotation: 55 },
    { x: 220, y: 480, rotation: -15 },
    { x: 140, y: 580, rotation: 35 },
    { x: 280, y: 530, rotation: -55 },
    // 우하단 영역
    { x: 1020, y: 440, rotation: -25 },
    { x: 1100, y: 500, rotation: 30 },
    { x: 980, y: 560, rotation: -45 },
    { x: 1060, y: 480, rotation: 50 },
    { x: 1130, y: 570, rotation: -30 },
    { x: 1000, y: 520, rotation: 40 },
  ]

  confettiPositions.forEach((pos, index) => {
    const color = confettiColors[index % confettiColors.length]
    drawConfetti(ctx, pos.x, pos.y, color, pos.rotation)
  })

  // 빵빠레 (파티 포퍼) 그리기 - 양쪽에 배치
  drawPartyPopper(ctx, 80, OG_HEIGHT / 2 - 50, false) // 왼쪽
  drawPartyPopper(ctx, OG_WIDTH - 80, OG_HEIGHT / 2 - 50, true) // 오른쪽 (반전)

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
 * 컨페티 (종이 조각) 그리기
 */
function drawConfetti(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  rotation: number
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate((rotation * Math.PI) / 180)

  // 직사각형 컨페티
  ctx.fillStyle = color
  ctx.fillRect(-8, -16, 16, 32)

  ctx.restore()
}

/**
 * 빵빠레 (파티 포퍼) 그리기
 */
function drawPartyPopper(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  mirror: boolean
) {
  ctx.save()
  ctx.translate(x, y)
  if (mirror) {
    ctx.scale(-1, 1)
  }

  // 포퍼 몸통 (원뿔)
  ctx.fillStyle = '#FFD700'
  ctx.beginPath()
  ctx.moveTo(0, 60)
  ctx.lineTo(-25, 100)
  ctx.lineTo(25, 100)
  ctx.closePath()
  ctx.fill()

  // 포퍼 테두리
  ctx.strokeStyle = '#DAA520'
  ctx.lineWidth = 3
  ctx.stroke()

  // 포퍼 손잡이
  ctx.fillStyle = '#8B4513'
  ctx.fillRect(-8, 100, 16, 40)

  // 터지는 효과 (리본/스트리머)
  const streamColors = ['#FF69B4', '#98D8C8', '#FFD700', '#DDA0DD', '#87CEEB']
  streamColors.forEach((color, i) => {
    ctx.strokeStyle = color
    ctx.lineWidth = 4
    ctx.beginPath()
    const angle = -60 + i * 30
    const rad = (angle * Math.PI) / 180
    ctx.moveTo(0, 60)
    ctx.quadraticCurveTo(
      Math.cos(rad) * 60,
      60 + Math.sin(rad) * 30,
      Math.cos(rad) * 120,
      60 + Math.sin(rad) * 80
    )
    ctx.stroke()
  })

  ctx.restore()
}
