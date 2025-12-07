/**
 * Super Editor - Prompt Hints
 * Mood, Color, Keyword → AI 프롬프트 강화를 위한 매핑 테이블
 */

// ============================================
// Types
// ============================================

export interface ColorPreset {
  primary: string
  background: string
  accent?: string
  text?: string  // 텍스트 색상 (가독성 보장)
}

export interface KeywordStyleHint {
  mood?: string[]
  typography?: 'serif' | 'sans-serif' | 'mixed'
  feel?: string
  colors?: string
  suggestedVariants?: string[]  // 키워드에 특화된 variant 추천
}

export interface EnhancedPromptInput {
  moods: string[]           // 분위기 다중 선택
  colorPreset?: string      // 색상 프리셋 key
  customColor?: string      // 직접 입력 색상
  keyword?: string          // 연상 키워드
  additionalText?: string   // 추가 요청
}

// ============================================
// Mood → Variant 힌트 매핑
// ============================================

/**
 * 분위기별 추천 variant
 * AI가 selectVariant에서 참고할 힌트 목록
 *
 * 총 14개 variant 사용 가능:
 * - 기존 7개: minimal, elegant, romantic, polaroid, split, typewriter, floating
 * - 교체 2개: cinematic (화양연화 스타일), magazine (MAISON 마스트헤드)
 * - 신규 5개: exhibition (갤러리), gothic (빅토리안), oldmoney (아이보리),
 *            monogram (네이비+골드), jewel (오페라 커튼)
 */
export const MOOD_VARIANT_HINTS: Record<string, string[]> = {
  romantic: ['romantic', 'floating', 'polaroid', 'gothic', 'jewel'],
  elegant: ['elegant', 'cinematic', 'magazine', 'oldmoney', 'monogram'],
  minimal: ['minimal', 'split', 'exhibition'],
  modern: ['minimal', 'split', 'magazine', 'exhibition'],
  warm: ['romantic', 'polaroid', 'typewriter', 'oldmoney'],
  luxury: ['elegant', 'cinematic', 'jewel', 'gothic', 'monogram'],
  playful: ['polaroid', 'magazine', 'floating'],
  natural: ['romantic', 'typewriter', 'minimal', 'oldmoney'],
}

/**
 * 여러 분위기의 variant 힌트를 합치고 우선순위 정렬
 */
export function getMoodVariantHints(moods: string[]): string[] {
  console.log('[DEBUG] getMoodVariantHints INPUT:', { moods })

  if (moods.length === 0) {
    const result = ['elegant', 'romantic', 'minimal']
    console.log('[DEBUG] getMoodVariantHints OUTPUT (default):', result)
    return result
  }

  // 각 mood의 힌트를 수집하고 빈도순 정렬
  const hintCounts = new Map<string, number>()

  for (const mood of moods) {
    const hints = MOOD_VARIANT_HINTS[mood] ?? []
    for (const hint of hints) {
      hintCounts.set(hint, (hintCounts.get(hint) ?? 0) + 1)
    }
  }

  // 빈도순 정렬 후 상위 3개 반환
  const result = Array.from(hintCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([hint]) => hint)

  console.log('[DEBUG] getMoodVariantHints OUTPUT:', result)
  return result
}

// ============================================
// 색상 프리셋
// ============================================

/**
 * 위저드에서 선택 가능한 색상 프리셋
 * key는 COLOR_OPTIONS의 value와 일치
 */
export const COLOR_PRESETS: Record<string, ColorPreset> = {
  // 기존 프리셋 (밝은 배경 → 어두운 텍스트)
  'white-gold': {
    primary: '#D4AF37',
    background: '#FFFEF5',
    accent: '#B8860B',
    text: '#1F2937',
  },
  'blush-pink': {
    primary: '#EC4899',
    background: '#FDF2F8',
    accent: '#DB2777',
    text: '#1F2937',
  },
  'deep-navy': {
    primary: '#1E3A8A',
    background: '#F8FAFC',
    accent: '#3B82F6',
    text: '#1E293B',
  },
  'natural-green': {
    primary: '#16A34A',
    background: '#F0FDF4',
    accent: '#22C55E',
    text: '#14532D',
  },
  'terracotta': {
    primary: '#C2410C',
    background: '#FFF7ED',
    accent: '#EA580C',
    text: '#7C2D12',
  },
  // 신규 추가 프리셋
  'burgundy': {
    primary: '#800020',
    background: '#FFF5F5',
    accent: '#A52A2A',
    text: '#450A0A',
  },
  'lavender': {
    primary: '#9F7AEA',
    background: '#FAF5FF',
    accent: '#805AD5',
    text: '#4C1D95',
  },
  'charcoal': {
    primary: '#374151',
    background: '#F9FAFB',
    accent: '#6B7280',
    text: '#111827',
  },
  'sage': {
    primary: '#6B8E23',
    background: '#F7FDF4',
    accent: '#9ACD32',
    text: '#365314',
  },
  'dusty-rose': {
    primary: '#C08081',
    background: '#FFF0F1',
    accent: '#E8B4B8',
    text: '#4A1E1F',
  },
  'champagne': {
    primary: '#D4A574',
    background: '#FFFDF5',
    accent: '#F7E7CE',
    text: '#78350F',
  },
  'midnight': {
    primary: '#191970',
    background: '#F0F4FF',
    accent: '#4169E1',
    text: '#1E3A8A',
  },
}

/**
 * 색상 프리셋 라벨 (한국어)
 */
export const COLOR_PRESET_LABELS: Record<string, string> = {
  'white-gold': '화이트 & 골드',
  'blush-pink': '블러쉬 핑크',
  'deep-navy': '딥 네이비',
  'natural-green': '내추럴 그린',
  'terracotta': '테라코타',
  'burgundy': '버건디',
  'lavender': '라벤더',
  'charcoal': '차콜',
  'sage': '세이지',
  'dusty-rose': '더스티 로즈',
  'champagne': '샴페인',
  'midnight': '미드나잇',
}

// ============================================
// 키워드 → 스타일 힌트
// ============================================

/**
 * 자주 사용되는 키워드에 대한 스타일 힌트
 * 정확히 일치하지 않아도 유사 키워드 매핑 가능
 */
export const KEYWORD_STYLE_HINTS: Record<string, KeywordStyleHint> = {
  // 장소
  '뉴욕': { mood: ['modern', 'minimal'], typography: 'sans-serif', feel: 'urban, sophisticated' },
  '파리': { mood: ['romantic', 'elegant'], typography: 'serif', feel: 'classic, artistic' },
  '박물관': { mood: ['elegant', 'minimal'], typography: 'serif', feel: 'classical, refined, artistic', suggestedVariants: ['exhibition', 'minimal', 'oldmoney'] },
  '미술관': { mood: ['modern', 'minimal'], typography: 'sans-serif', feel: 'contemporary, clean', suggestedVariants: ['exhibition', 'minimal', 'split'] },
  '성당': { mood: ['elegant', 'luxury'], typography: 'serif', feel: 'sacred, majestic' },
  '물의교회': { mood: ['minimal', 'elegant'], typography: 'serif', feel: 'sacred, serene, zen' },
  '호텔': { mood: ['luxury', 'elegant'], typography: 'serif', feel: 'sophisticated, premium' },
  '정원': { mood: ['natural', 'romantic'], typography: 'serif', feel: 'organic, peaceful' },
  '카페': { mood: ['warm', 'minimal'], typography: 'mixed', feel: 'cozy, intimate' },

  // 자연
  '바다': { mood: ['natural', 'romantic'], colors: 'blue-tones', feel: 'fresh, open, free' },
  '숲': { mood: ['natural', 'warm'], colors: 'green-tones', feel: 'organic, peaceful' },
  '산': { mood: ['natural', 'minimal'], colors: 'earth-tones', feel: 'majestic, serene' },
  '꽃': { mood: ['romantic', 'warm'], colors: 'pink-tones', feel: 'soft, delicate, feminine' },
  '벚꽃': { mood: ['romantic', 'warm'], colors: 'pink-tones', feel: 'spring, ephemeral, delicate' },
  '가을': { mood: ['warm', 'romantic'], colors: 'warm-tones', feel: 'cozy, nostalgic' },
  '겨울': { mood: ['minimal', 'elegant'], colors: 'cool-tones', feel: 'clean, pure, serene' },
  '노을': { mood: ['warm', 'romantic'], colors: 'orange-tones', feel: 'dramatic, emotional' },

  // 스타일
  '빈티지': { mood: ['warm'], typography: 'serif', feel: 'nostalgic, timeless, aged' },
  '레트로': { mood: ['playful', 'warm'], typography: 'mixed', feel: 'fun, nostalgic, colorful' },
  '클래식': { mood: ['elegant', 'luxury'], typography: 'serif', feel: 'timeless, refined' },
  '모던': { mood: ['modern', 'minimal'], typography: 'sans-serif', feel: 'clean, contemporary' },
  '심플': { mood: ['minimal'], typography: 'sans-serif', feel: 'clean, uncluttered' },

  // 감성
  '따뜻한': { mood: ['warm', 'romantic'], colors: 'warm-tones', feel: 'cozy, intimate' },
  '차분한': { mood: ['minimal', 'elegant'], colors: 'muted-tones', feel: 'serene, peaceful' },
  '화려한': { mood: ['luxury', 'playful'], colors: 'vibrant', feel: 'bold, eye-catching' },
  '소박한': { mood: ['natural', 'warm'], typography: 'serif', feel: 'humble, genuine' },
}

/**
 * 키워드에서 스타일 힌트 추출
 * 정확히 일치하지 않으면 부분 매칭 시도
 */
export function getKeywordStyleHint(keyword: string): KeywordStyleHint | null {
  const normalized = keyword.trim().toLowerCase()

  // 정확한 매칭
  if (KEYWORD_STYLE_HINTS[keyword]) {
    return KEYWORD_STYLE_HINTS[keyword]
  }

  // 부분 매칭 (키워드가 다른 키에 포함되거나 그 반대)
  for (const [key, hint] of Object.entries(KEYWORD_STYLE_HINTS)) {
    if (key.includes(normalized) || normalized.includes(key.toLowerCase())) {
      return hint
    }
  }

  return null
}

// ============================================
// Enhanced Prompt Builder
// ============================================

/**
 * 구조화된 입력을 AI 프롬프트로 변환
 *
 * @example
 * buildEnhancedPrompt({
 *   moods: ['romantic', 'elegant'],
 *   colorPreset: 'blush-pink',
 *   keyword: '박물관',
 *   additionalText: '캘리그라피 폰트'
 * })
 * // → "# 사용자 선택 (구조화된 입력)\n- 분위기: 로맨틱, 우아한\n..."
 */
export function buildEnhancedPrompt(input: EnhancedPromptInput): string {
  console.log('[DEBUG] buildEnhancedPrompt INPUT:', JSON.stringify(input, null, 2))

  const lines: string[] = []

  lines.push('# 사용자 선택 (구조화된 입력)')

  // 분위기
  if (input.moods.length > 0) {
    const moodLabels = input.moods.map(m => MOOD_LABEL_MAP[m] ?? m).join(', ')
    lines.push(`- 분위기: ${moodLabels}`)
  } else {
    lines.push('- 분위기: AI가 자유롭게 선택')
  }

  // 색상
  if (input.customColor) {
    lines.push(`- 색상: ${input.customColor} (사용자 직접 입력)`)
  } else if (input.colorPreset && COLOR_PRESETS[input.colorPreset]) {
    const preset = COLOR_PRESETS[input.colorPreset]
    const label = COLOR_PRESET_LABELS[input.colorPreset] ?? input.colorPreset
    lines.push(`- 색상: ${label} (primary: ${preset.primary}, background: ${preset.background})`)
  } else {
    lines.push('- 색상: AI가 분위기에 맞게 선택')
  }

  // 키워드
  if (input.keyword?.trim()) {
    lines.push(`- 키워드: "${input.keyword.trim()}"`)

    // 키워드 스타일 힌트 추가
    const hint = getKeywordStyleHint(input.keyword)
    if (hint) {
      lines.push('')
      lines.push('# 키워드 해석 가이드')
      if (hint.mood) {
        lines.push(`- 연관 분위기: ${hint.mood.join(', ')}`)
      }
      if (hint.typography) {
        lines.push(`- 추천 타이포그래피: ${hint.typography === 'serif' ? '세리프 (명조)' : hint.typography === 'sans-serif' ? '산세리프 (고딕)' : '믹스'}`)
      }
      if (hint.feel) {
        lines.push(`- 느낌: ${hint.feel}`)
      }
      if (hint.colors) {
        lines.push(`- 색상 톤: ${hint.colors}`)
      }
      if (hint.suggestedVariants) {
        lines.push(`- 추천 variant: ${hint.suggestedVariants.join(', ')} (이 키워드에 최적화된 스타일)`)
      }
    }
  }

  // 추가 요청
  if (input.additionalText?.trim()) {
    lines.push('')
    lines.push('# 추가 요청')
    lines.push(input.additionalText.trim())
  }

  // Variant 힌트
  const variantHints = getMoodVariantHints(input.moods)
  if (variantHints.length > 0) {
    lines.push('')
    lines.push('# 추천 Intro Variant (참고용)')
    lines.push(`이 분위기에 어울리는 variant: ${variantHints.join(', ')}`)
  }

  const result = lines.join('\n')
  console.log('[DEBUG] buildEnhancedPrompt OUTPUT:', result)
  return result
}

// ============================================
// Helper Maps
// ============================================

const MOOD_LABEL_MAP: Record<string, string> = {
  romantic: '로맨틱',
  elegant: '우아한',
  minimal: '미니멀',
  modern: '모던',
  warm: '따뜻한',
  luxury: '럭셔리',
  playful: '발랄한',
  natural: '자연스러운',
}
