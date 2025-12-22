import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'

// ============================================
// Types
// ============================================

interface AnalyzeReferenceRequest {
  url?: string         // URL (이미지 또는 웹페이지)
  imageData?: string   // base64 이미지 (직접 업로드 시)
}

interface AnalysisResult {
  mood: string[]           // ["미니멀", "모던", "우아한"]
  colors: string[]         // ["#FFFFFF", "#C9A962", "#1A1A1A"]
  typography: string       // "세리프" | "산세리프" | "손글씨"
  layout: string           // "사진중심" | "텍스트중심" | "균형"
  keywords: string[]       // 스타일 키워드
  summary: string          // 한줄 요약
}

interface AnalyzeReferenceResponse {
  success: boolean
  analysis?: AnalysisResult
  thumbnail?: string       // 분석한 이미지 URL (원본 URL 또는 OG 이미지)
  error?: string
}

// ============================================
// Google AI Client
// ============================================

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')
const MODEL = 'gemini-2.0-flash'

// ============================================
// API Route
// ============================================

export async function POST(request: NextRequest): Promise<NextResponse<AnalyzeReferenceResponse>> {
  try {
    // 인증 확인
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // 요청 파싱
    const body = await request.json() as AnalyzeReferenceRequest

    if (!body.url && !body.imageData) {
      return NextResponse.json(
        { success: false, error: 'URL 또는 이미지 데이터가 필요합니다' },
        { status: 400 }
      )
    }

    // Gemini API 호출
    const result = await analyzeWithGemini(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      analysis: result.analysis,
      thumbnail: body.url, // 원본 URL을 썸네일로 사용
    })
  } catch (error) {
    console.error('Analyze Reference API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// ============================================
// Gemini Analysis
// ============================================

interface GeminiAnalysisResult {
  success: boolean
  analysis?: AnalysisResult
  error?: string
}

async function analyzeWithGemini(
  request: AnalyzeReferenceRequest
): Promise<GeminiAnalysisResult> {
  if (!process.env.GOOGLE_AI_API_KEY) {
    return {
      success: false,
      error: 'GOOGLE_AI_API_KEY not configured',
    }
  }

  try {
    const model = genAI.getGenerativeModel({ model: MODEL })

    // 프롬프트 구성
    const prompt = buildAnalysisPrompt(request.url)

    // 컨텐츠 구성
    const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = []

    // 텍스트 프롬프트 추가
    parts.push({ text: prompt })

    // 이미지 데이터가 있으면 추가
    if (request.imageData) {
      // base64 데이터에서 mime type과 data 분리
      const matches = request.imageData.match(/^data:(.+);base64,(.+)$/)
      if (matches) {
        parts.push({
          inlineData: {
            mimeType: matches[1],
            data: matches[2],
          },
        })
      }
    }

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts,
        },
      ],
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.3,
      },
    })

    const response = await result.response
    const content = response.text()

    if (!content) {
      return {
        success: false,
        error: 'Empty response from AI',
      }
    }

    // JSON 파싱
    const analysis = parseAnalysisResponse(content)

    if (!analysis) {
      return {
        success: false,
        error: 'Failed to parse AI response',
      }
    }

    return {
      success: true,
      analysis,
    }
  } catch (error) {
    console.error('Gemini API call failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

function buildAnalysisPrompt(url?: string): string {
  const urlSection = url
    ? `사용자가 청첩장 스타일 참고용으로 다음 URL을 제공했습니다.
이 URL의 내용(이미지 또는 웹페이지)을 분석하여 청첩장 디자인 스타일을 추출해주세요.

URL: ${url}`
    : `사용자가 청첩장 스타일 참고용으로 이미지를 직접 업로드했습니다.
이 이미지를 분석하여 청첩장 디자인 스타일을 추출해주세요.`

  return `${urlSection}

분석 항목:
1. mood: 전체적인 분위기 키워드 (미니멀, 모던, 클래식, 로맨틱, 럭셔리, 내추럴, 빈티지 등) - 최대 3개
2. colors: 주요 색상 HEX 코드 3-5개 (배경색, 텍스트색, 포인트색 순)
3. typography: 폰트 스타일 ("세리프" | "산세리프" | "손글씨" 중 하나)
4. layout: 레이아웃 특성 ("사진중심" | "텍스트중심" | "균형" 중 하나)
5. keywords: 핵심 스타일 키워드 (해시태그 형태로 5개 이내)
6. summary: 디자인 스타일을 한 문장으로 요약

JSON 형식으로만 응답해주세요. 다른 텍스트는 포함하지 마세요:
{
  "mood": ["미니멀", "모던"],
  "colors": ["#FFFFFF", "#1A1A1A", "#C9A962"],
  "typography": "세리프",
  "layout": "사진중심",
  "keywords": ["미니멀", "화이트톤", "골드포인트", "세리프", "우아한"],
  "summary": "깔끔한 화이트 배경에 골드 포인트가 돋보이는 클래식한 스타일"
}`
}

function parseAnalysisResponse(content: string): AnalysisResult | null {
  try {
    // JSON 블록 추출 시도
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/)
    const jsonStr = jsonMatch ? jsonMatch[1] : content

    const parsed = JSON.parse(jsonStr.trim())

    // 필수 필드 검증
    if (
      !Array.isArray(parsed.mood) ||
      !Array.isArray(parsed.colors) ||
      typeof parsed.typography !== 'string' ||
      typeof parsed.layout !== 'string' ||
      !Array.isArray(parsed.keywords) ||
      typeof parsed.summary !== 'string'
    ) {
      console.error('Invalid analysis response structure:', parsed)
      return null
    }

    return {
      mood: parsed.mood,
      colors: parsed.colors,
      typography: parsed.typography,
      layout: parsed.layout,
      keywords: parsed.keywords,
      summary: parsed.summary,
    }
  } catch (error) {
    console.error('Failed to parse analysis response:', error, content)
    return null
  }
}
