import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { createDocument, updateDocument } from '@/lib/super-editor-v2/actions/document'
import { aiEditLogsV2 } from '@/lib/super-editor-v2/schema'
import { selectFallbackTemplate } from '@/lib/super-editor-v2/services/template-matcher'
import { applyTemplateToDocument } from '@/lib/super-editor-v2/services/template-applier'
import { TEMPLATE_CATALOG } from '@/lib/super-editor-v2/config/template-catalog'
import type { TemplateMetadata } from '@/lib/super-editor-v2/schema/template-metadata'

// ============================================
// Types
// ============================================

interface ReferenceAnalysis {
  mood: string[]
  colors: string[]
  typography: string
  layout: string
  keywords: string[]
  summary: string
}

interface GenerateRequest {
  prompt: string
  referenceAnalysis?: ReferenceAnalysis
}

interface TemplateSelectionResponse {
  templateId: string
  reasoning: {
    moodMatch: string
    colorMatch: string
    confidence: number
  }
  explanation: string
}

// ============================================
// Google AI Client
// ============================================

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')
const MODEL = 'gemini-2.0-flash-exp'

// ============================================
// Landing Generate API Route
// ============================================

export async function POST(request: NextRequest) {
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
    const body = await request.json() as GenerateRequest

    if (!body.prompt) {
      return NextResponse.json(
        { success: false, error: 'prompt is required' },
        { status: 400 }
      )
    }

    // 1. 새 문서 생성 (샘플 데이터로 시작)
    const document = await createDocument({
      title: `AI 생성 청첩장 - ${body.prompt.slice(0, 20)}...`,
      useSampleData: true,
    })

    console.log('[Landing Generate] Document created:', document.id)
    console.log('[Landing Generate] Prompt:', body.prompt)
    console.log('[Landing Generate] Reference:', body.referenceAnalysis ? 'Yes' : 'No')

    // 2. AI 템플릿 선택
    console.log('[AI Template Selection] Starting...')
    const aiSelection = await selectTemplateWithAI(body.prompt, body.referenceAnalysis)

    let selectedTemplateId: string
    let aiSelected = false
    let explanation = ''
    let confidence = 0

    if (aiSelection) {
      selectedTemplateId = aiSelection.templateId
      aiSelected = true
      explanation = aiSelection.explanation
      confidence = aiSelection.reasoning.confidence

      console.log('[AI Template Selection] ✅ Success:', {
        templateId: selectedTemplateId,
        confidence: confidence.toFixed(2),
        reasoning: aiSelection.reasoning,
      })
    } else {
      // 3. Fallback: AI 실패 시 기본 템플릿
      selectedTemplateId = selectFallbackTemplate(body.referenceAnalysis)
      aiSelected = false
      explanation = '기본 템플릿이 적용되었습니다'

      console.log('[AI Template Selection] ⚠️  AI failed, using fallback:', selectedTemplateId)
    }

    // 4. 템플릿 직접 적용 (AI Patch 없음!)
    console.log('[Template Application] Applying template:', selectedTemplateId)

    // DB 문서를 EditorDocument 형식으로 변환
    const editorDocument = {
      id: document.id,
      version: 2 as const,
      meta: {
        title: document.title,
        createdAt: document.createdAt.toISOString(),
        updatedAt: document.updatedAt.toISOString(),
      },
      style: document.style,
      animation: document.animation ?? {},
      blocks: document.blocks,
      data: document.data,
    }

    const { style, blocks } = applyTemplateToDocument(selectedTemplateId, editorDocument)
    await updateDocument(document.id, { style, blocks })

    // 5. 로깅
    await db.insert(aiEditLogsV2).values({
      documentId: document.id,
      userId: user.id,
      prompt: `[Template Selection] ${body.prompt}`,
      targetBlockId: null,
      context: {
        // 타입에 맞게 context 객체 구성
      },
      patches: null, // 더 이상 Patch 생성 안 함
      explanation: explanation,
      success: true,
      errorMessage: null,
      snapshotId: null,
    })

    return NextResponse.json({
      success: true,
      documentId: document.id,
      templateApplied: selectedTemplateId,
      aiSelected,
      confidence,
      explanation,
    })
  } catch (error) {
    console.error('Landing Generate API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// ============================================
// AI Template Selection
// ============================================

async function selectTemplateWithAI(
  prompt: string,
  referenceAnalysis?: ReferenceAnalysis
): Promise<TemplateSelectionResponse | null> {
  const systemPrompt = buildTemplateSelectionPrompt(referenceAnalysis)
  const userPrompt = `사용자 요청: "${prompt}"\n\n가장 적합한 템플릿을 선택해주세요.`

  const aiResponse = await callGeminiAPI(systemPrompt, userPrompt)

  if (!aiResponse.success || !aiResponse.data) {
    console.error('[AI Template Selection] Failed:', aiResponse.error)
    return null
  }

  return parseTemplateSelectionResponse(aiResponse.data)
}

function buildTemplateSelectionPrompt(referenceAnalysis?: ReferenceAnalysis): string {
  // 6개 템플릿 메타데이터를 마크다운으로 포맷
  const templateDescriptions = TEMPLATE_CATALOG.map((template: TemplateMetadata) => {
    const { id, name, mood, colors, typography, layout, keywords, summary } = template

    return `### ${id} - ${name}
- 분위기(mood): ${mood.join(', ')}
- 색상(colors): ${colors.slice(0, 5).join(', ')}
- 타이포그래피(typography): ${typography}
- 레이아웃(layout): ${layout}
- 키워드(keywords): ${keywords.join(', ')}
- 요약(summary): ${summary}`
  }).join('\n\n')

  const referenceSection = referenceAnalysis ? `
## 레퍼런스 분석 결과
사용자가 제공한 레퍼런스 이미지 분석 결과입니다. 이를 참고하여 템플릿을 선택하세요.

- 분위기(mood): ${referenceAnalysis.mood.join(', ')}
- 색상(colors): ${referenceAnalysis.colors.join(', ')}
- 타이포그래피(typography): ${referenceAnalysis.typography}
- 레이아웃(layout): ${referenceAnalysis.layout}
- 키워드(keywords): ${referenceAnalysis.keywords.join(', ')}
- 요약(summary): ${referenceAnalysis.summary}
` : ''

  return `당신은 청첩장 템플릿 추천 AI입니다.
사용자의 프롬프트${referenceAnalysis ? '와 레퍼런스 이미지 분석 결과' : ''}를 바탕으로, 6개의 템플릿 중 가장 적합한 1개를 선택하세요.

## 6개 템플릿 (AI 분석 메타데이터 기반)

${templateDescriptions}
${referenceSection}

## 선택 기준
1. **분위기 일치**: 사용자가 요청한 느낌(럭셔리, 미니멀, 로맨틱 등)과 템플릿 mood가 일치하는지
2. **색상 조화**: ${referenceAnalysis ? '레퍼런스 색상과 템플릿 색상이 조화로운지' : '사용자가 원하는 색상 느낌과 일치하는지'}
3. **키워드 매칭**: 사용자 프롬프트의 핵심 키워드와 템플릿 keywords가 겹치는지

## 출력 형식
반드시 다음 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요:

\`\`\`json
{
  "templateId": "unique1",
  "reasoning": {
    "moodMatch": "사용자가 원하는 [구체적 느낌]은 템플릿의 [mood] 분위기와 일치합니다",
    "colorMatch": "사용자가 원하는 [색상 느낌]은 템플릿의 [색상 팔레트]와 조화롭습니다",
    "confidence": 0.85
  },
  "explanation": "사용자에게 보여줄 선택 이유 (한국어, 친근하게, 1-2문장)"
}
\`\`\`

## 주의사항
- confidence는 0.0 ~ 1.0 사이의 숫자입니다 (0.7 이상이면 높은 확신)
- templateId는 반드시 위 6개 중 하나여야 합니다 (unique1 ~ unique6)
- explanation은 사용자가 읽을 내용이므로 친근하고 이해하기 쉽게 작성하세요
`
}

function parseTemplateSelectionResponse(content: string): TemplateSelectionResponse | null {
  try {
    // JSON 블록 추출
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/)
    const jsonStr = jsonMatch ? jsonMatch[1] : content

    const parsed = JSON.parse(jsonStr.trim())

    // 필수 필드 검증
    if (
      typeof parsed.templateId !== 'string' ||
      typeof parsed.reasoning !== 'object' ||
      typeof parsed.reasoning.confidence !== 'number' ||
      typeof parsed.explanation !== 'string'
    ) {
      console.error('[Parse Template Selection] Invalid response structure:', parsed)
      return null
    }

    // templateId 유효성 검증
    const validIds = ['unique1', 'unique2', 'unique3', 'unique4', 'unique5', 'unique6']
    if (!validIds.includes(parsed.templateId)) {
      console.error('[Parse Template Selection] Invalid templateId:', parsed.templateId)
      return null
    }

    return {
      templateId: parsed.templateId,
      reasoning: {
        moodMatch: parsed.reasoning.moodMatch || '',
        colorMatch: parsed.reasoning.colorMatch || '',
        confidence: parsed.reasoning.confidence,
      },
      explanation: parsed.explanation,
    }
  } catch (error) {
    console.error('[Parse Template Selection] Failed:', error, content)
    return null
  }
}

// ============================================
// Gemini API Call
// ============================================

interface GeminiResponse {
  success: boolean
  data?: string
  error?: string
}

async function callGeminiAPI(
  systemPrompt: string,
  userPrompt: string
): Promise<GeminiResponse> {
  if (!process.env.GOOGLE_AI_API_KEY) {
    return {
      success: false,
      error: 'GOOGLE_AI_API_KEY not configured',
    }
  }

  try {
    const model = genAI.getGenerativeModel({ model: MODEL })

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.3, // 낮은 temperature로 일관성 확보
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

    return {
      success: true,
      data: content,
    }
  } catch (error) {
    console.error('Gemini API call failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
