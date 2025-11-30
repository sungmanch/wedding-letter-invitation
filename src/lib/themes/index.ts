// ============================================
// Theme Template Loader
// 정적 템플릿과 AI 동적 생성 모두 지원
// ============================================

import type {
  ThemeTemplate,
  ThemePreview,
  ThemeCategory,
  AIThemeRequest,
  AIThemeResponse,
  InvitationThemeData,
  ColorPalette,
} from './schema'
import templatesData from './templates.json'

// ============================================
// 정적 템플릿 로드
// ============================================

const staticTemplates: ThemeTemplate[] = templatesData.templates as ThemeTemplate[]

/**
 * 모든 정적 템플릿 가져오기
 */
export function getAllTemplates(): ThemeTemplate[] {
  return staticTemplates
}

/**
 * ID로 템플릿 가져오기
 */
export function getTemplateById(id: string): ThemeTemplate | undefined {
  return staticTemplates.find((t) => t.id === id)
}

/**
 * 카테고리별 템플릿 가져오기
 */
export function getTemplatesByCategory(category: ThemeCategory): ThemeTemplate[] {
  return staticTemplates.filter((t) => t.category === category)
}

/**
 * 템플릿 미리보기 목록 가져오기
 */
export function getTemplatePreviews(): ThemePreview[] {
  return staticTemplates.map((t) => ({
    id: t.id,
    name: t.name,
    nameKo: t.nameKo,
    category: t.category,
    description: t.descriptionKo,
    thumbnail: t.preview.thumbnail,
    colors: t.preview.colors,
    mood: t.preview.mood,
  }))
}

// ============================================
// 키워드 기반 템플릿 매칭
// ============================================

/**
 * 사용자 프롬프트에서 키워드 추출
 */
function extractKeywords(prompt: string): string[] {
  // 간단한 키워드 추출 (실제로는 AI나 형태소 분석 사용 가능)
  const normalized = prompt.toLowerCase()
  const keywords: string[] = []

  // 미리 정의된 키워드 패턴 매칭
  const keywordPatterns: Record<string, string[]> = {
    cinematic: ['영화', '시네마틱', '화양연화', '필름', '빈티지', '감성'],
    modern: ['모던', '세련', '깔끔', '미니멀', '심플', '애플', '키노트'],
    playful: ['재미', '유쾌', '게임', '픽셀', '귀여운', '채팅', '카톡'],
    artistic: ['예술', '갤러리', '전시', '아트', '미술관', '타이포'],
    retro: ['레트로', 'LP', '바이닐', '80년대', '90년대', 'Y2K', '힙'],
    classic: ['클래식', '여행', '여권', '우아', '고급', '전통'],
  }

  for (const [category, patterns] of Object.entries(keywordPatterns)) {
    for (const pattern of patterns) {
      if (normalized.includes(pattern)) {
        keywords.push(category, pattern)
      }
    }
  }

  return [...new Set(keywords)]
}

/**
 * 템플릿과 키워드 매칭 점수 계산
 */
function calculateMatchScore(template: ThemeTemplate, keywords: string[]): number {
  let score = 0

  for (const keyword of keywords) {
    // 카테고리 매칭
    if (template.category === keyword) {
      score += 10
    }

    // matchKeywords 매칭
    for (const matchKeyword of template.matchKeywords) {
      if (matchKeyword.toLowerCase().includes(keyword.toLowerCase())) {
        score += 5
      }
    }

    // 이름 매칭
    if (template.nameKo.includes(keyword) || template.name.toLowerCase().includes(keyword)) {
      score += 3
    }

    // 설명 매칭
    if (template.descriptionKo.includes(keyword)) {
      score += 1
    }
  }

  return score
}

/**
 * 프롬프트 기반 템플릿 추천
 */
export function recommendTemplates(
  prompt: string,
  limit: number = 5
): ThemePreview[] {
  const keywords = extractKeywords(prompt)

  const scored = staticTemplates.map((template) => ({
    template,
    score: calculateMatchScore(template, keywords),
  }))

  // 점수 순 정렬, 동점이면 랜덤
  scored.sort((a, b) => {
    if (b.score === a.score) {
      return Math.random() - 0.5
    }
    return b.score - a.score
  })

  return scored.slice(0, limit).map(({ template, score }) => ({
    id: template.id,
    name: template.name,
    nameKo: template.nameKo,
    category: template.category,
    description: template.descriptionKo,
    thumbnail: template.preview.thumbnail,
    colors: template.preview.colors,
    mood: template.preview.mood,
    matchScore: score,
  }))
}

// ============================================
// AI 동적 템플릿 생성 (향후 구현)
// ============================================

/**
 * AI를 사용한 커스텀 템플릿 생성
 * (현재는 가장 매칭되는 정적 템플릿 기반으로 커스터마이징)
 */
export async function generateCustomTemplate(
  request: AIThemeRequest
): Promise<AIThemeResponse> {
  // TODO: 실제 AI API 호출로 대체
  const recommendations = recommendTemplates(request.userPrompt, 5)

  return {
    recommendations,
    // customTheme는 완전히 새로운 테마가 필요할 때만 생성
    customTheme: undefined,
  }
}

// ============================================
// 템플릿 → 사용자 데이터 변환
// ============================================

/**
 * 템플릿을 기반으로 초기 사용자 테마 데이터 생성
 */
export function createInvitationThemeData(
  templateId: string,
  customizations?: {
    colors?: Partial<ColorPalette>
    images?: InvitationThemeData['images']
  }
): InvitationThemeData | null {
  const template = getTemplateById(templateId)
  if (!template) return null

  return {
    templateId: template.id,
    templateSource: template.source,
    colors: {
      ...template.defaultColors,
      ...customizations?.colors,
    },
    fonts: template.defaultFonts,
    images: customizations?.images ?? {
      intro: [],
      gallery: [],
    },
    sections: template.sections,
    intro: template.intro,
    effects: template.effects,
  }
}

/**
 * 사용자 테마 데이터에 이미지 분석 기반 색상 적용
 */
export function applyImageColors(
  themeData: InvitationThemeData,
  extractedColors: Partial<ColorPalette>
): InvitationThemeData {
  return {
    ...themeData,
    colors: {
      ...themeData.colors,
      ...extractedColors,
    },
  }
}

// ============================================
// 유틸리티
// ============================================

/**
 * 템플릿 버전 확인
 */
export function getTemplatesVersion(): string {
  return templatesData.version
}

/**
 * 카테고리 한글 이름
 */
export const categoryNames: Record<ThemeCategory, string> = {
  cinematic: '시네마틱',
  playful: '유쾌한',
  artistic: '예술적',
  classic: '클래식',
  modern: '모던',
  retro: '레트로',
}

/**
 * 모든 카테고리 가져오기
 */
export function getAllCategories(): { id: ThemeCategory; name: string }[] {
  return Object.entries(categoryNames).map(([id, name]) => ({
    id: id as ThemeCategory,
    name,
  }))
}

// Re-export types
export type {
  ThemeTemplate,
  ThemePreview,
  ThemeCategory,
  InvitationThemeData,
  ColorPalette,
  SectionConfig,
  IntroConfig,
  EffectsConfig,
} from './schema'
