/**
 * Template Block Builder Service
 *
 * 템플릿의 BlockTemplate을 실제 Block 인스턴스로 변환하는 서비스
 * - WeddingData를 바인딩하여 실제 값 주입
 * - 템플릿 색상 팔레트 적용
 * - 고유 ID 생성
 */

import { nanoid } from 'nanoid'
import type { Block, Element, WeddingData } from '../schema/types'
import type { TemplateV2, BlockTemplate, ElementTemplate } from '../config/template-catalog-v2'

/**
 * 템플릿으로부터 Block 배열 생성
 *
 * @param template - TemplateV2 객체
 * @param weddingData - 사용자 웨딩 데이터
 * @returns 실제 Block 배열 (편집 가능)
 */
export function buildBlocksFromTemplate(template: TemplateV2, weddingData: WeddingData): Block[] {
  return template.blockStructure.map((blockTemplate) =>
    buildBlockFromTemplate(blockTemplate, template, weddingData)
  )
}

/**
 * 단일 BlockTemplate을 Block으로 변환
 */
function buildBlockFromTemplate(
  blockTemplate: BlockTemplate,
  template: TemplateV2,
  weddingData: WeddingData
): Block {
  return {
    id: nanoid(8),
    type: blockTemplate.type,
    enabled: blockTemplate.enabled,
    height: blockTemplate.height,
    elements: blockTemplate.elements.map((elementTemplate) =>
      buildElementFromTemplate(elementTemplate, template, weddingData)
    ),
  }
}

/**
 * 단일 ElementTemplate을 Element로 변환
 */
function buildElementFromTemplate(
  elementTemplate: ElementTemplate,
  template: TemplateV2,
  weddingData: WeddingData
): Element {
  const element: Element = {
    id: nanoid(8),
    type: elementTemplate.type,
    x: elementTemplate.x,
    y: elementTemplate.y,
    width: elementTemplate.width,
    height: elementTemplate.height,
    zIndex: elementTemplate.zIndex,
    props: elementTemplate.props,
  }

  // 바인딩이 있으면 추가
  if (elementTemplate.binding) {
    element.binding = elementTemplate.binding
  }

  // 값이 있으면 추가
  if (elementTemplate.value !== undefined) {
    element.value = elementTemplate.value
  }

  // 스타일 적용 (템플릿 색상 팔레트 반영)
  if (elementTemplate.style) {
    element.style = applyTemplateColorsToElementStyle(
      elementTemplate.style,
      template,
      elementTemplate.type
    )
  }

  return element
}

/**
 * Element 스타일에 템플릿 색상 팔레트 적용
 *
 * 템플릿 스타일에 하드코딩된 색상을 그대로 사용하되,
 * 향후 사용자가 색상 팔레트를 수정할 수 있도록 준비
 */
function applyTemplateColorsToElementStyle(
  style: any,
  template: TemplateV2,
  elementType: string
): any {
  const { colorPalette } = template.designPattern

  // 기본 스타일 복사
  const appliedStyle = { ...style }

  // 배경색이 템플릿 Secondary 색상인 경우 그대로 유지
  // (향후 색상 커스터마이징 시 동적으로 변경 가능)
  if (appliedStyle.backgroundColor) {
    // 현재는 템플릿 색상 그대로 사용
    // 나중에 사용자 커스터마이징 로직 추가 가능
  }

  // 텍스트 색상이 템플릿 Primary 색상인 경우 그대로 유지
  if (appliedStyle.color) {
    // 현재는 템플릿 색상 그대로 사용
  }

  return appliedStyle
}

/**
 * 템플릿 색상 팔레트로부터 색상 추론
 *
 * @param elementType - 요소 타입 (text, image, shape 등)
 * @param colorPalette - 템플릿 색상 팔레트
 * @param role - 색상 역할 ('text' | 'background' | 'accent')
 * @returns HEX 색상 코드
 */
export function inferColorFromPalette(
  elementType: string,
  colorPalette: {
    primary: [string, string, string]
    secondary: [string, string, string]
    tertiary: [string, string, string]
  },
  role: 'text' | 'background' | 'accent' = 'text'
): string {
  switch (role) {
    case 'text':
      return colorPalette.primary[0] // 가장 진한 색상
    case 'background':
      return colorPalette.secondary[0] // 가장 밝은 색상
    case 'accent':
      return colorPalette.tertiary[0] // 중간 색상
    default:
      return colorPalette.primary[0]
  }
}

/**
 * 템플릿 색상 팔레트 커스터마이징
 *
 * 사용자가 색상을 변경할 때 모든 블록에 새 색상 적용
 *
 * @param blocks - 기존 블록 배열
 * @param newPalette - 새로운 색상 팔레트
 * @returns 색상이 업데이트된 블록 배열
 */
export function updateBlocksWithCustomPalette(
  blocks: Block[],
  newPalette: {
    primary: [string, string, string]
    secondary: [string, string, string]
    tertiary: [string, string, string]
  }
): Block[] {
  return blocks.map((block) => ({
    ...block,
    elements: block.elements.map((element) => {
      if (!element.style) return element

      const updatedStyle = { ...element.style }

      // 배경색 매핑
      if (updatedStyle.backgroundColor) {
        // Primary 색상이면 교체
        if (isColorInPalette(updatedStyle.backgroundColor, 'primary')) {
          updatedStyle.backgroundColor = newPalette.primary[0]
        }
        // Secondary 색상이면 교체
        else if (isColorInPalette(updatedStyle.backgroundColor, 'secondary')) {
          updatedStyle.backgroundColor = newPalette.secondary[0]
        }
        // Tertiary 색상이면 교체
        else if (isColorInPalette(updatedStyle.backgroundColor, 'tertiary')) {
          updatedStyle.backgroundColor = newPalette.tertiary[0]
        }
      }

      // 텍스트 색상 매핑
      if (updatedStyle.color) {
        if (isColorInPalette(updatedStyle.color, 'primary')) {
          updatedStyle.color = newPalette.primary[0]
        } else if (isColorInPalette(updatedStyle.color, 'secondary')) {
          updatedStyle.color = newPalette.secondary[0]
        } else if (isColorInPalette(updatedStyle.color, 'tertiary')) {
          updatedStyle.color = newPalette.tertiary[0]
        }
      }

      return {
        ...element,
        style: updatedStyle,
      }
    }),
  }))
}

/**
 * 색상이 특정 팔레트 그룹에 속하는지 확인
 * (간단한 휴리스틱: 밝기 기준)
 */
function isColorInPalette(
  color: string,
  paletteType: 'primary' | 'secondary' | 'tertiary'
): boolean {
  // 간단한 구현: 흰색 계열은 secondary, 어두운 색은 primary, 중간은 tertiary
  const brightness = getColorBrightness(color)

  if (paletteType === 'primary') {
    return brightness < 0.3 // 어두운 색
  } else if (paletteType === 'secondary') {
    return brightness > 0.7 // 밝은 색
  } else {
    return brightness >= 0.3 && brightness <= 0.7 // 중간 색
  }
}

/**
 * 색상의 밝기 계산 (0~1)
 */
function getColorBrightness(hex: string): number {
  // #RRGGBB 형식에서 RGB 추출
  const rgb = hexToRgb(hex)
  if (!rgb) return 0.5

  // 상대 밝기 공식
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 / 255
}

/**
 * HEX 색상을 RGB로 변환
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}
