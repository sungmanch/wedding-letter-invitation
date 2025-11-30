'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'
import { db } from '@/lib/db'
import { invitations, invitationDesigns, type InvitationDesign } from '@/lib/db/invitation-schema'
import { eq, and, desc } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')
const MODEL = 'gemini-3-pro-preview'
// ============================================
// Stage 1: 디자인 프리뷰 (미리보기 카드용)
// ============================================
export interface DesignPreview {
  id: string
  name: string // 예: "Pure & Minimalist"
  nameKo: string // 예: "순수하고 간결한"
  description: string // 2-3문장 설명
  mood: string[] // 분위기 키워드 (예: ["깨끗함", "정갈함", "현대적인"])
  colors: {
    background: string // 배경색
    text: string // 텍스트 색상
    accent: string // 포인트 색상
  }
  fontStyle: {
    title: 'serif' | 'sans-serif' | 'script' // 제목 폰트 스타일
    body: 'serif' | 'sans-serif' // 본문 폰트 스타일
  }
  visualKeywords: string[] // 시각적 키워드 (예: ["여백", "중앙정렬", "단정함"])
  recommended: string // 추천 대상 (예: "호텔 예식이나 격식 있는 분위기를 선호할 때")
}

// ============================================
// Stage 2: 화면 구조 (실제 렌더링용)
// ============================================
export interface ScreenSection {
  id: string
  type:
    | 'hero' // 메인 이미지 + 이름
    | 'greeting' // 인사말
    | 'calendar' // 날짜/시간
    | 'gallery' // 사진 갤러리
    | 'location' // 장소 정보
    | 'parents' // 혼주 정보
    | 'account' // 축의금 계좌
    | 'message' // 축하 메시지
    | 'rsvp' // 참석 여부
    | 'closing' // 마무리
  layout: 'fullscreen' | 'centered' | 'left-aligned' | 'right-aligned' | 'split'
  animation?: {
    type: 'fade' | 'slide-up' | 'slide-left' | 'scale' | 'parallax' | 'magic-scroll'
    trigger: 'on-enter' | 'on-scroll'
    duration?: number
  }
  style: {
    backgroundColor?: string
    textColor?: string
    padding?: string
    imageFilter?: 'none' | 'grayscale' | 'sepia' | 'warm' | 'cool'
  }
  content?: {
    titleSize?: 'small' | 'medium' | 'large' | 'xlarge'
    showDecorations?: boolean
    decorationType?: 'floral' | 'botanical' | 'gold-frame' | 'minimal-line' | 'none'
  }
}

export interface ScreenStructure {
  previewId: string
  theme: {
    name: string
    colors: {
      primary: string
      secondary: string
      background: string
      text: string
      accent: string
    }
    fonts: {
      title: string // 실제 폰트 이름
      body: string
    }
  }
  sections: ScreenSection[]
  globalEffects: {
    useMagicScroll: boolean
    scrollIndicator: boolean
    backgroundMusic: boolean
    snowEffect: boolean
    petalEffect: boolean
  }
}

// ============================================
// Stage 1: 디자인 프리뷰 생성 (이미지 분석 포함)
// ============================================
export async function generateDesignPreviews(
  userPrompt: string,
  imageBase64?: string // base64 encoded image (optional)
): Promise<{ success: boolean; data?: DesignPreview[]; error?: string }> {
  const systemPrompt = `당신은 웨딩 청첩장 디자인 전문가입니다.
${imageBase64 ? '제공된 웨딩 사진을 분석하고, 사진의 분위기, 색감, 배경, 의상 등을 고려하여 사진과 가장 잘 어울리는 5가지 청첩장 디자인 프리뷰를 생성해야 합니다.' : '사용자의 요청에 따라 5가지 다른 스타일의 청첩장 디자인 프리뷰를 생성해야 합니다.'}

다음 5가지 기본 스타일을 참고하되, ${imageBase64 ? '사진의 분위기에 맞게 색상과 스타일을 조정하세요' : '사용자의 요청에 맞게 변형하세요'}:

1. Pure & Minimalist (순수하고 간결한)
- 가장 호불호가 없으며 세련된 스타일
- 흰색 배경에 군더더기 없는 디자인
- 분위기: 깨끗함, 정갈함, 현대적인

2. Warm & Romantic (따뜻하고 로맨틱한)
- 부드러운 색감과 감성적인 분위기
- 은은한 수채화 느낌이나 베이지 톤
- 분위기: 따뜻함, 사랑스러운, 감성적인

3. Classic & Elegant (클래식하고 우아한)
- 호텔 예식이나 격식 있는 분위기
- 깊이 있는 색상과 금박 느낌
- 분위기: 고급스러운, 격식 있는, 차분한

4. Modern & Editorial (트렌디한 매거진 스타일)
- 패션 잡지처럼 감각적이고 개성 있는 스타일
- 과감한 레이아웃과 풀스크린 사진
- 분위기: 트렌디한, 힙한, 시선을 사로잡는

5. Traditional & Korean (전통과 현대의 조화)
- 한복, 한옥 등 한국 전통 요소가 있을 때 추천
- 전통미와 현대적 감각의 조화
- 분위기: 단아한, 품격있는, 한국적인

${
  imageBase64
    ? `
사진 분석 시 고려할 사항:
- 배경 (한옥, 정원, 호텔, 야외 등)
- 의상 (한복, 웨딩드레스, 턱시도 등)
- 계절감 (벚꽃, 단풍, 눈 등)
- 전체적인 색조 (따뜻한/차가운, 밝은/어두운)
- 사진의 분위기 (로맨틱, 모던, 전통적 등)

사진에서 추출한 주요 색상을 청첩장의 포인트 컬러로 활용하세요.`
    : ''
}

각 프리뷰는 다음 JSON 형식으로 제공하세요:
{
  "id": "unique-id-string",
  "name": "영문 스타일 이름",
  "nameKo": "한글 스타일 이름",
  "description": "2-3문장으로 이 스타일의 특징과 느낌을 설명${imageBase64 ? ' (사진과의 조화 포인트 포함)' : ''}",
  "mood": ["분위기", "키워드", "3개"],
  "colors": {
    "background": "#FFFFFF",
    "text": "#1F2937",
    "accent": "#D4768A"
  },
  "fontStyle": {
    "title": "serif | sans-serif | script",
    "body": "serif | sans-serif"
  },
  "visualKeywords": ["시각적", "특징", "키워드"],
  "recommended": "이 스타일을 추천하는 상황"
}

중요:
1. ${imageBase64 ? '사진의 분위기와 어울리는' : '사용자의 요청을 반영한'} 5가지 서로 다른 스타일을 제공하세요
2. 각 스타일은 명확하게 구분되어야 합니다
3. JSON 배열 형식으로만 응답하세요`

  try {
    const model = genAI.getGenerativeModel({ model: MODEL })

    // Build content parts
    const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = []

    // Add image if provided
    if (imageBase64) {
      // Remove data URL prefix if present
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '')
      parts.push({
        inlineData: {
          mimeType: 'image/png',
          data: base64Data,
        },
      })
    }

    // Add text prompt
    parts.push({
      text: `${systemPrompt}\n\n${userPrompt ? `사용자 추가 요청: "${userPrompt}"\n\n` : ''}JSON 배열로만 응답해주세요.`,
    })

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts,
        },
      ],
      generationConfig: {
        maxOutputTokens: 4096,
        temperature: 0.8,
      },
    })

    const response = await result.response
    const text = response.text()

    if (!text) {
      throw new Error('No response from AI')
    }

    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error('Could not extract JSON')
    }

    const previews = JSON.parse(jsonMatch[0]) as DesignPreview[]
    return { success: true, data: previews.slice(0, 5) }
  } catch (error) {
    console.error('Failed to generate previews:', error)
    // 폴백 프리뷰 반환
    return { success: true, data: getDefaultPreviews() }
  }
}

// ============================================
// Stage 2: 화면 구조 생성 (이미지 분석 포함)
// ============================================
export async function generateScreenStructure(
  preview: DesignPreview,
  imageBase64?: string // base64 encoded image (optional)
): Promise<{ success: boolean; data?: ScreenStructure; error?: string }> {
  const isModernStyle =
    preview.name.toLowerCase().includes('modern') ||
    preview.name.toLowerCase().includes('editorial')

  const isTraditionalStyle =
    preview.name.toLowerCase().includes('traditional') ||
    preview.name.toLowerCase().includes('korean')

  const systemPrompt = `당신은 웨딩 청첩장 UI/UX 전문가입니다.
선택된 디자인 프리뷰를 기반으로 실제 화면 구조를 생성해야 합니다.
${imageBase64 ? '제공된 웨딩 사진의 분위기와 완벽하게 조화되는 화면 구조를 만들어주세요.' : ''}

선택된 스타일:
- 이름: ${preview.name} (${preview.nameKo})
- 분위기: ${preview.mood.join(', ')}
- 색상: 배경 ${preview.colors.background}, 텍스트 ${preview.colors.text}, 포인트 ${preview.colors.accent}
- 폰트: 제목 ${preview.fontStyle.title}, 본문 ${preview.fontStyle.body}
- 시각적 특징: ${preview.visualKeywords.join(', ')}

${isModernStyle ? '이 스타일은 모던/트렌디한 스타일이므로 magic-scroll 효과와 parallax 애니메이션을 적극 활용하세요.' : ''}
${isTraditionalStyle ? '이 스타일은 전통적인 스타일이므로 단아하고 품격있는 레이아웃을 사용하세요. 한국 전통 문양이나 자연 요소를 장식에 활용하세요.' : ''}

${
  imageBase64
    ? `
사진 분석 기반 추가 고려사항:
- 사진의 주요 색상을 accent 컬러로 활용
- 사진의 분위기 (밝음/어두움)에 맞는 배경색 선택
- 한복/한옥이 있다면 전통적 장식 요소 추가
- 벚꽃/자연 배경이 있다면 petalEffect 고려
`
    : ''
}

다음 JSON 형식으로 화면 구조를 생성하세요:
{
  "previewId": "${preview.id}",
  "theme": {
    "name": "테마 이름",
    "colors": {
      "primary": "메인색 (hex)",
      "secondary": "보조색 (hex)",
      "background": "배경색 (hex)",
      "text": "텍스트색 (hex)",
      "accent": "강조색 (hex)"
    },
    "fonts": {
      "title": "Noto Serif KR | Pretendard | Nanum Myeongjo | Cormorant Garamond",
      "body": "Pretendard | Noto Sans KR"
    }
  },
  "sections": [
    {
      "id": "hero",
      "type": "hero",
      "layout": "fullscreen | centered | left-aligned | right-aligned | split",
      "animation": {
        "type": "fade | slide-up | slide-left | scale | parallax | magic-scroll",
        "trigger": "on-enter | on-scroll",
        "duration": 800
      },
      "style": {
        "backgroundColor": "#색상",
        "textColor": "#색상",
        "padding": "large | medium | small",
        "imageFilter": "none | grayscale | sepia | warm | cool"
      },
      "content": {
        "titleSize": "small | medium | large | xlarge",
        "showDecorations": true,
        "decorationType": "floral | botanical | gold-frame | minimal-line | traditional | none"
      }
    }
    // 다른 섹션들...
  ],
  "globalEffects": {
    "useMagicScroll": ${isModernStyle},
    "scrollIndicator": true,
    "backgroundMusic": false,
    "snowEffect": false,
    "petalEffect": ${isTraditionalStyle || preview.mood.some((m) => m.includes('로맨틱') || m.includes('봄'))}
  }
}

섹션 타입 목록: hero, greeting, calendar, gallery, location, parents, account, message, closing

중요:
1. 스타일에 맞는 레이아웃과 애니메이션을 선택하세요
2. 모던 스타일은 magic-scroll과 parallax 효과를 사용하세요
3. 클래식/전통 스타일은 fade와 간결한 애니메이션을 사용하세요
4. 최소 6개 이상의 섹션을 포함하세요
5. JSON 형식으로만 응답하세요`

  try {
    const model = genAI.getGenerativeModel({ model: MODEL })

    // Build content parts
    const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = []

    // Add image if provided
    if (imageBase64) {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '')
      parts.push({
        inlineData: {
          mimeType: 'image/png',
          data: base64Data,
        },
      })
    }

    // Add text prompt
    parts.push({
      text: `${systemPrompt}\n\nJSON으로만 응답해주세요.`,
    })

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts,
        },
      ],
      generationConfig: {
        maxOutputTokens: 4096,
        temperature: 0.7,
      },
    })

    const response = await result.response
    const text = response.text()

    if (!text) {
      throw new Error('No response from AI')
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Could not extract JSON')
    }

    const structure = JSON.parse(jsonMatch[0]) as ScreenStructure
    return { success: true, data: structure }
  } catch (error) {
    console.error('Failed to generate screen structure:', error)
    // 폴백 구조 반환
    return { success: true, data: getDefaultScreenStructure(preview) }
  }
}

// ============================================
// 폴백 데이터
// ============================================
function getDefaultPreviews(): DesignPreview[] {
  return [
    {
      id: 'pure-minimalist',
      name: 'Pure & Minimalist',
      nameKo: '순수하고 간결한',
      description:
        '가장 호불호가 없으며 세련된 스타일입니다. 흰색 배경에 군더더기 없는 디자인으로, 두 분의 사진과 이름이 가장 돋보입니다.',
      mood: ['깨끗함', '정갈함', '현대적인'],
      colors: { background: '#FFFFFF', text: '#1F2937', accent: '#6B7280' },
      fontStyle: { title: 'serif', body: 'sans-serif' },
      visualKeywords: ['여백', '중앙정렬', '단정함'],
      recommended: '심플하고 모던한 분위기를 원하시는 분',
    },
    {
      id: 'warm-romantic',
      name: 'Warm & Romantic',
      nameKo: '따뜻하고 로맨틱한',
      description:
        '부드러운 색감과 감성적인 분위기를 선호하는 분들에게 인기 있는 스타일입니다. 은은한 수채화 느낌이 가미됩니다.',
      mood: ['따뜻함', '사랑스러운', '감성적인'],
      colors: { background: '#FFF8F5', text: '#5C4A42', accent: '#E8B4B8' },
      fontStyle: { title: 'script', body: 'serif' },
      visualKeywords: ['부드러움', '꽃장식', '파스텔'],
      recommended: '로맨틱하고 감성적인 분위기를 원하시는 분',
    },
    {
      id: 'classic-elegant',
      name: 'Classic & Elegant',
      nameKo: '클래식하고 우아한',
      description:
        '호텔 예식이나 격식 있는 분위기를 선호할 때 좋은 디자인입니다. 깊이 있는 색상과 금박 느낌의 텍스트로 고급스러움을 강조합니다.',
      mood: ['고급스러운', '격식있는', '차분한'],
      colors: { background: '#1A2744', text: '#D4AF37', accent: '#C9A962' },
      fontStyle: { title: 'serif', body: 'serif' },
      visualKeywords: ['금박', '정중앙', '클래식'],
      recommended: '호텔 예식이나 격식 있는 분위기를 선호하시는 분',
    },
    {
      id: 'modern-editorial',
      name: 'Modern & Editorial',
      nameKo: '트렌디한 매거진 스타일',
      description:
        '마치 패션 잡지의 한 페이지처럼 감각적이고 개성 있는 스타일입니다. 사진이 화면을 가득 채우고 텍스트가 과감하게 배치됩니다.',
      mood: ['트렌디한', '힙한', '감각적인'],
      colors: { background: '#000000', text: '#FFFFFF', accent: '#FF6B6B' },
      fontStyle: { title: 'sans-serif', body: 'sans-serif' },
      visualKeywords: ['풀스크린', '비대칭', '임팩트'],
      recommended: '개성 있고 트렌디한 스타일을 원하시는 분',
    },
    {
      id: 'garden-natural',
      name: 'Garden & Natural',
      nameKo: '싱그러운 자연주의',
      description:
        '자연의 싱그러움을 담은 스타일입니다. 보태니컬 일러스트와 자연스러운 색감으로 밝은 에너지를 줍니다.',
      mood: ['싱그러운', '밝은', '네추럴한'],
      colors: { background: '#FAFFF7', text: '#2D5016', accent: '#7CB342' },
      fontStyle: { title: 'serif', body: 'sans-serif' },
      visualKeywords: ['보태니컬', '잎사귀', '자연'],
      recommended: '야외 웨딩이나 자연스러운 분위기를 원하시는 분',
    },
  ]
}

function getDefaultScreenStructure(preview: DesignPreview): ScreenStructure {
  const isModern =
    preview.name.toLowerCase().includes('modern') ||
    preview.name.toLowerCase().includes('editorial')

  const fontMap: Record<string, string> = {
    serif: 'Noto Serif KR',
    'sans-serif': 'Pretendard',
    script: 'Nanum Myeongjo',
  }

  return {
    previewId: preview.id,
    theme: {
      name: preview.nameKo,
      colors: {
        primary: preview.colors.accent,
        secondary: preview.colors.text,
        background: preview.colors.background,
        text: preview.colors.text,
        accent: preview.colors.accent,
      },
      fonts: {
        title: fontMap[preview.fontStyle.title] || 'Noto Serif KR',
        body: fontMap[preview.fontStyle.body] || 'Pretendard',
      },
    },
    sections: [
      {
        id: 'hero',
        type: 'hero',
        layout: isModern ? 'fullscreen' : 'centered',
        animation: {
          type: isModern ? 'magic-scroll' : 'fade',
          trigger: 'on-enter',
          duration: 800,
        },
        style: {
          backgroundColor: preview.colors.background,
          textColor: preview.colors.text,
          padding: 'large',
          imageFilter: isModern ? 'none' : 'none',
        },
        content: {
          titleSize: isModern ? 'xlarge' : 'large',
          showDecorations: !isModern,
          decorationType: isModern ? 'none' : 'minimal-line',
        },
      },
      {
        id: 'greeting',
        type: 'greeting',
        layout: 'centered',
        animation: { type: isModern ? 'parallax' : 'fade', trigger: 'on-scroll' },
        style: { backgroundColor: preview.colors.background, textColor: preview.colors.text },
      },
      {
        id: 'calendar',
        type: 'calendar',
        layout: 'centered',
        animation: { type: 'slide-up', trigger: 'on-scroll' },
        style: { backgroundColor: preview.colors.background, textColor: preview.colors.text },
      },
      {
        id: 'gallery',
        type: 'gallery',
        layout: isModern ? 'fullscreen' : 'centered',
        animation: { type: isModern ? 'magic-scroll' : 'fade', trigger: 'on-scroll' },
        style: { imageFilter: isModern ? 'none' : 'none' },
      },
      {
        id: 'location',
        type: 'location',
        layout: 'centered',
        animation: { type: 'slide-up', trigger: 'on-scroll' },
        style: { backgroundColor: preview.colors.background, textColor: preview.colors.text },
      },
      {
        id: 'account',
        type: 'account',
        layout: 'centered',
        animation: { type: 'fade', trigger: 'on-scroll' },
        style: { backgroundColor: preview.colors.background, textColor: preview.colors.text },
      },
      {
        id: 'message',
        type: 'message',
        layout: 'centered',
        animation: { type: 'fade', trigger: 'on-scroll' },
        style: { backgroundColor: preview.colors.background, textColor: preview.colors.text },
      },
      {
        id: 'closing',
        type: 'closing',
        layout: 'centered',
        animation: { type: 'fade', trigger: 'on-scroll' },
        style: { backgroundColor: preview.colors.background, textColor: preview.colors.text },
      },
    ],
    globalEffects: {
      useMagicScroll: isModern,
      scrollIndicator: true,
      backgroundMusic: false,
      snowEffect: false,
      petalEffect: preview.name.toLowerCase().includes('romantic'),
    },
  }
}

// ============================================
// 레거시 호환용 (기존 함수 유지)
// ============================================
interface DesignData {
  theme: string
  colors: {
    primary: string
    secondary: string
    background: string
    text: string
  }
  layout: 'classic' | 'modern' | 'minimal' | 'romantic' | 'traditional'
  fonts: {
    title: string
    body: string
  }
  decorations: string[]
  styleDescription: string
}

// Generate 5 design variations based on user prompt (레거시)
export async function generateDesigns(
  invitationId: string,
  stylePrompt: string
): Promise<{ success: boolean; data?: InvitationDesign[]; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: '로그인이 필요합니다' }
    }

    // Verify ownership
    const invitation = await db.query.invitations.findFirst({
      where: and(eq(invitations.id, invitationId), eq(invitations.userId, user.id)),
    })

    if (!invitation) {
      return { success: false, error: '청첩장을 찾을 수 없습니다' }
    }

    // Get the latest batch number
    const latestDesign = await db.query.invitationDesigns.findFirst({
      where: eq(invitationDesigns.invitationId, invitationId),
      orderBy: [desc(invitationDesigns.generationBatch)],
    })

    const newBatch = (latestDesign?.generationBatch ?? 0) + 1

    // Generate designs using Claude API
    const designsData = await generateDesignVariations(stylePrompt)

    // Save designs to database
    const savedDesigns: InvitationDesign[] = []

    for (const designData of designsData) {
      const [design] = await db
        .insert(invitationDesigns)
        .values({
          invitationId,
          designData,
          generationBatch: newBatch,
          isSelected: false,
        })
        .returning()

      savedDesigns.push(design)
    }

    return { success: true, data: savedDesigns }
  } catch (error) {
    console.error('Failed to generate designs:', error)
    return { success: false, error: '디자인 생성에 실패했습니다' }
  }
}

async function generateDesignVariations(userPrompt: string): Promise<DesignData[]> {
  const systemPrompt = `당신은 웨딩 청첩장 디자인 전문가입니다. 사용자의 요청에 따라 5가지 다른 스타일의 웨딩 청첩장 디자인을 생성해야 합니다.

각 디자인은 다음 JSON 형식으로 제공해야 합니다:
{
  "theme": "디자인 테마 이름 (한글, 예: 봄날의 로맨스)",
  "colors": {
    "primary": "메인 강조색 (hex, 예: #D4768A)",
    "secondary": "보조색 (hex, 예: #D4AF37)",
    "background": "배경색 (hex, 예: #FFFBFC)",
    "text": "텍스트 색상 (hex, 예: #1F2937)"
  },
  "layout": "레이아웃 타입 (classic, modern, minimal, romantic, traditional 중 하나)",
  "fonts": {
    "title": "제목 폰트 (Noto Serif KR, Pretendard, Nanum Myeongjo 중 하나)",
    "body": "본문 폰트 (Pretendard, Noto Sans KR 중 하나)"
  },
  "decorations": ["장식 요소 배열 (floral_top, floral_bottom, gold_border, simple_line, hearts, leaves 중 선택)"],
  "styleDescription": "디자인 설명 (한글, 2-3문장)"
}

중요 규칙:
1. 5개의 서로 다른 디자인을 생성하세요
2. 각 디자인은 독특한 색상 조합과 분위기를 가져야 합니다
3. 사용자의 요청을 반영하되, 다양한 해석을 보여주세요
4. 색상은 웨딩에 어울리는 우아하고 세련된 색상을 사용하세요
5. 응답은 반드시 JSON 배열 형식으로만 제공하세요 (다른 텍스트 없이)`

  const userMessage = `다음 스타일의 웨딩 청첩장 디자인 5개를 생성해주세요: "${userPrompt}"

JSON 배열 형식으로만 응답해주세요.`

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3-pro-preview' })

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\n${userMessage}` }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 4096,
        temperature: 0.8,
      },
    })

    const response = await result.response
    const text = response.text()

    if (!text) {
      throw new Error('No text content in response')
    }

    // Parse JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from response')
    }

    const designs = JSON.parse(jsonMatch[0]) as DesignData[]

    // Validate and ensure we have 5 designs
    if (!Array.isArray(designs) || designs.length === 0) {
      throw new Error('Invalid designs array')
    }

    // Return up to 5 designs, filling with defaults if needed
    const validatedDesigns = designs.slice(0, 5).map(validateDesign)

    // If we have fewer than 5, generate more with variations
    while (validatedDesigns.length < 5) {
      validatedDesigns.push(generateFallbackDesign(userPrompt, validatedDesigns.length))
    }

    return validatedDesigns
  } catch (error) {
    console.error('AI design generation failed:', error)
    // Return fallback designs if AI fails
    return generateFallbackDesigns(userPrompt)
  }
}

function validateDesign(design: Partial<DesignData>): DesignData {
  return {
    theme: design.theme || '클래식 로맨스',
    colors: {
      primary: design.colors?.primary || '#D4768A',
      secondary: design.colors?.secondary || '#D4AF37',
      background: design.colors?.background || '#FFFBFC',
      text: design.colors?.text || '#1F2937',
    },
    layout: (['classic', 'modern', 'minimal', 'romantic', 'traditional'].includes(
      design.layout || ''
    )
      ? design.layout
      : 'classic') as DesignData['layout'],
    fonts: {
      title: design.fonts?.title || 'Noto Serif KR',
      body: design.fonts?.body || 'Pretendard',
    },
    decorations: Array.isArray(design.decorations) ? design.decorations : ['floral_top'],
    styleDescription: design.styleDescription || '우아하고 세련된 클래식 스타일의 청첩장입니다.',
  }
}

function generateFallbackDesign(prompt: string, index: number): DesignData {
  const variations: DesignData[] = [
    {
      theme: '봄날의 로맨스',
      colors: { primary: '#FFB6C1', secondary: '#D4AF37', background: '#FFF0F5', text: '#1F2937' },
      layout: 'romantic',
      fonts: { title: 'Noto Serif KR', body: 'Pretendard' },
      decorations: ['floral_top', 'floral_bottom'],
      styleDescription: '부드러운 핑크톤과 꽃 장식으로 로맨틱한 분위기를 연출한 청첩장입니다.',
    },
    {
      theme: '모던 엘레강스',
      colors: { primary: '#1F2937', secondary: '#D4AF37', background: '#FAFAFA', text: '#1F2937' },
      layout: 'modern',
      fonts: { title: 'Pretendard', body: 'Pretendard' },
      decorations: ['simple_line'],
      styleDescription: '심플하면서도 고급스러운 모던 스타일의 청첩장입니다.',
    },
    {
      theme: '가든 웨딩',
      colors: { primary: '#48BB78', secondary: '#D4AF37', background: '#F0FFF4', text: '#1F2937' },
      layout: 'minimal',
      fonts: { title: 'Nanum Myeongjo', body: 'Noto Sans KR' },
      decorations: ['leaves', 'floral_top'],
      styleDescription: '자연의 싱그러움을 담은 가든 웨딩 컨셉의 청첩장입니다.',
    },
    {
      theme: '클래식 골드',
      colors: { primary: '#D4AF37', secondary: '#8B4513', background: '#FFFDF7', text: '#1F2937' },
      layout: 'classic',
      fonts: { title: 'Noto Serif KR', body: 'Pretendard' },
      decorations: ['gold_border', 'simple_line'],
      styleDescription: '전통적인 우아함과 골드 포인트로 품격을 더한 청첩장입니다.',
    },
    {
      theme: '미니멀 화이트',
      colors: { primary: '#6B7280', secondary: '#E5E7EB', background: '#FFFFFF', text: '#1F2937' },
      layout: 'minimal',
      fonts: { title: 'Pretendard', body: 'Pretendard' },
      decorations: ['simple_line'],
      styleDescription: '깔끔하고 모던한 미니멀리즘 스타일의 청첩장입니다.',
    },
  ]

  return variations[index % variations.length]
}

function generateFallbackDesigns(prompt: string): DesignData[] {
  return [0, 1, 2, 3, 4].map((i) => generateFallbackDesign(prompt, i))
}

// Regenerate designs (for additional payment)
export async function regenerateDesigns(
  invitationId: string,
  newPrompt: string
): Promise<{ success: boolean; data?: InvitationDesign[]; error?: string }> {
  // This is the same as generateDesigns but with a new prompt
  // In production, this would require payment verification
  return generateDesigns(invitationId, newPrompt)
}
