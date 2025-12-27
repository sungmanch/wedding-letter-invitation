/**
 * Intro Template Analyzer
 *
 * unique1~6.png 이미지를 AI로 분석하여 템플릿 메타데이터를 생성합니다.
 * 실행: tsx scripts/analyze-intro-templates.ts
 *
 * 생성 파일: src/lib/super-editor-v2/config/template-catalog.ts
 */

import 'dotenv/config'
import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs/promises'
import path from 'path'
import type { TemplateMetadata } from '../src/lib/super-editor-v2/schema/template-metadata'

// ============================================
// Configuration
// ============================================

const TEMPLATES = [
  { id: 'unique1', name: '클래식 엘레강스' },
  { id: 'unique2', name: '캐주얼 플레이풀' },
  { id: 'unique3', name: '미니멀 모던' },
  { id: 'unique4', name: '다크 로맨틱' },
  { id: 'unique5', name: '브라이트 캐주얼' },
  { id: 'unique6', name: '모노크롬 볼드' },
]

const PUBLIC_DIR = path.join(process.cwd(), 'public')
const OUTPUT_FILE = path.join(
  process.cwd(),
  'src/lib/super-editor-v2/config/template-catalog.ts'
)

// ============================================
// AI Client
// ============================================

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')
const MODEL = 'gemini-2.0-flash'

// ============================================
// Analysis Prompt
// ============================================

function buildAnalysisPrompt(): string {
  return `이 청첩장 디자인 템플릿을 상세히 분석해주세요.

분석 항목:
1. mood: 분위기 키워드 3-5개 (elegant, casual, minimal, romantic, playful, dramatic, modern, vintage, luxury, warm, cool 등)
2. colors: 주요 색상 HEX 코드 6-9개 (Primary/Secondary/Tertiary로 분류)
   - Primary: 메인 텍스트, 강조 요소 (가장 진한 색상 3개)
   - Secondary: 배경, 카드 surface (가장 밝은 색상 3개)
   - Tertiary: 하이라이트, 버튼, 링크 (중간 명도 색상 3개)
3. typography: 폰트 스타일 ("script" | "handwritten" | "serif" | "sans-serif" | "display")
4. layout: 레이아웃 ("photo-dominant" | "text-overlay" | "split" | "card" | "centered")
5. keywords: 스타일 키워드 5-8개 (outdoor, studio, nature, modern, vintage, white-bg, dark-bg, overlay 등)
6. summary: 한 문장 요약 (한국어)
7. designPattern: 구체적 디자인 패턴
   - introType: "elegant" | "minimal" | "romantic" | "cinematic" | "polaroid"
   - imageLayout: "fullscreen-bg" | "centered" | "card" | "split-left"
   - textLayout: "bottom-overlay" | "center" | "below-image" | "side-right"
   - colorTheme: "light" | "dark" | "overlay" | "warm"
   - stylePreset: "minimal-light" | "minimal-dark" | "classic-serif" | "modern-sans" | "romantic-script" | "nature-organic" (optional)
   - colorPalette: { primary: [3개], secondary: [3개], tertiary: [3개] }

JSON만 반환:
{
  "mood": ["elegant", "classic", "romantic"],
  "colors": ["#1A1A1A", "#C9A962", "#8B7355", "#FFFFFF", "#F8F6F3", "#FAF8F5", "#E6DCC8", "#D4C5A9", "#C2B490"],
  "typography": "script",
  "layout": "photo-dominant",
  "keywords": ["outdoor", "nature", "classic", "white-bg", "script"],
  "summary": "야외 배경 스크립트 폰트의 클래식한 우아함",
  "designPattern": {
    "introType": "elegant",
    "imageLayout": "centered",
    "textLayout": "below-image",
    "colorTheme": "light",
    "stylePreset": "classic-serif",
    "colorPalette": {
      "primary": ["#1A1A1A", "#C9A962", "#8B7355"],
      "secondary": ["#FFFFFF", "#F8F6F3", "#FAF8F5"],
      "tertiary": ["#E6DCC8", "#D4C5A9", "#C2B490"]
    }
  }
}

중요:
- colorPalette의 primary는 텍스트에 사용될 진한 색상을 선택하세요 (명도 낮음)
- colorPalette의 secondary는 배경에 사용될 밝은 색상을 선택하세요 (명도 높음)
- colorPalette의 tertiary는 포인트/강조에 사용될 중간 색상을 선택하세요 (중간 명도)
- 각 카테고리는 정확히 3개씩 선택해주세요`
}

// ============================================
// Analyze Template
// ============================================

interface AnalysisResult {
  mood: string[]
  colors: string[]
  typography: string
  layout: string
  keywords: string[]
  summary: string
  designPattern: {
    introType: string
    imageLayout: string
    textLayout: string
    colorTheme: string
    stylePreset?: string
    colorPalette: {
      primary: [string, string, string]
      secondary: [string, string, string]
      tertiary: [string, string, string]
    }
  }
}

async function analyzeTemplate(
  id: string,
  imagePath: string
): Promise<AnalysisResult> {
  console.log(`\n📸 Analyzing ${id}...`)

  const model = genAI.getGenerativeModel({ model: MODEL })

  // 이미지 읽기
  const imageBuffer = await fs.readFile(imagePath)
  const base64 = imageBuffer.toString('base64')

  // AI 호출
  const result = await model.generateContent({
    contents: [
      {
        role: 'user',
        parts: [
          { text: buildAnalysisPrompt() },
          {
            inlineData: {
              mimeType: 'image/png',
              data: base64,
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 2048,
    },
  })

  const response = await result.response
  const content = response.text()

  // JSON 파싱
  const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/)
  const jsonStr = jsonMatch ? jsonMatch[1] : content

  const parsed = JSON.parse(jsonStr.trim())

  console.log(`✅ ${id} analyzed:`)
  console.log(`   Mood: ${parsed.mood.join(', ')}`)
  console.log(`   Colors: ${parsed.colors.length} colors`)
  console.log(`   Typography: ${parsed.typography}`)
  console.log(`   Layout: ${parsed.layout}`)
  console.log(`   Summary: ${parsed.summary}`)

  return parsed
}

// ============================================
// Generate Catalog File
// ============================================

async function generateCatalog(): Promise<void> {
  console.log('🚀 Starting template analysis...')
  console.log(`Model: ${MODEL}`)
  console.log(`Templates: ${TEMPLATES.length}`)
  console.log('')

  const catalog: TemplateMetadata[] = []

  // 각 템플릿 분석
  for (const template of TEMPLATES) {
    const imagePath = path.join(PUBLIC_DIR, 'examples', `${template.id}.png`)

    // 파일 존재 확인
    try {
      await fs.access(imagePath)
    } catch {
      console.error(`❌ Image not found: ${imagePath}`)
      continue
    }

    // AI 분석
    const analysis = await analyzeTemplate(template.id, imagePath)

    // 메타데이터 생성
    const metadata: TemplateMetadata = {
      id: template.id,
      name: template.name,
      imagePath: `/examples/${template.id}.png`,
      mood: analysis.mood,
      colors: analysis.colors,
      typography: analysis.typography,
      layout: analysis.layout,
      keywords: analysis.keywords,
      summary: analysis.summary,
      designPattern: {
        introType: analysis.designPattern.introType as any,
        imageLayout: analysis.designPattern.imageLayout as any,
        textLayout: analysis.designPattern.textLayout as any,
        colorTheme: analysis.designPattern.colorTheme as any,
        stylePreset: analysis.designPattern.stylePreset as any,
        colorPalette: analysis.designPattern.colorPalette,
      },
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    catalog.push(metadata)

    // Rate limiting (Gemini API)
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  // TypeScript 파일 생성
  const code = `/**
 * Template Catalog (Auto-generated)
 *
 * 이 파일은 scripts/analyze-intro-templates.ts에 의해 자동 생성되었습니다.
 * 수동으로 편집하지 마세요.
 *
 * Generated at: ${new Date().toISOString()}
 */

import type { TemplateCatalog } from '../schema/template-metadata'

/**
 * 사전 분석된 템플릿 카탈로그
 *
 * unique1~6.png 이미지를 AI로 분석한 결과를 저장합니다.
 * 사용자 레퍼런스와 매칭하여 가장 유사한 템플릿을 선택하는 데 사용됩니다.
 */
export const TEMPLATE_CATALOG: TemplateCatalog = ${JSON.stringify(catalog, null, 2)}

/**
 * 템플릿 ID로 템플릿 메타데이터 조회
 */
export function getTemplateById(id: string) {
  return TEMPLATE_CATALOG.find((t) => t.id === id)
}

/**
 * 모든 템플릿 ID 목록
 */
export function getAllTemplateIds(): string[] {
  return TEMPLATE_CATALOG.map((t) => t.id)
}
`

  // 파일 쓰기
  await fs.writeFile(OUTPUT_FILE, code, 'utf-8')

  console.log('')
  console.log('✅ Template catalog generated successfully!')
  console.log(`📝 Output: ${OUTPUT_FILE}`)
  console.log(`📊 Templates analyzed: ${catalog.length}`)
}

// ============================================
// Main
// ============================================

async function main() {
  try {
    // API 키 확인
    if (!process.env.GOOGLE_AI_API_KEY) {
      console.error('❌ GOOGLE_AI_API_KEY not set')
      console.error('Set it in your environment or .env file')
      process.exit(1)
    }

    await generateCatalog()
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

main()
