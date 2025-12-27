import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { eq, and, desc } from 'drizzle-orm'
import { createDocument, updateDocument } from '@/lib/super-editor-v2/actions/document'
import {
  getDocumentContextForAI,
  applyAIEdit,
  type AIEditRequest,
  type JSONPatch,
} from '@/lib/super-editor-v2/actions'
import { BLOCK_TYPE_LABELS, aiEditLogsV2, editorSnapshotsV2 } from '@/lib/super-editor-v2/schema'
import { matchBestTemplate, selectFallbackTemplate } from '@/lib/super-editor-v2/services/template-matcher'
import { applyTemplateToDocument } from '@/lib/super-editor-v2/services/template-applier'
import { getTemplateById } from '@/lib/super-editor-v2/config/template-catalog'
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

// ============================================
// Google AI Client
// ============================================

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')
const MODEL = 'gemini-3-pro-preview'

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

    // 2. 템플릿 매칭 (레퍼런스가 있을 때) → 템플릿 가이드 AI 생성
    if (body.referenceAnalysis) {
      console.log('[Template Matching] Starting template matching...')

      const matchResult = matchBestTemplate(body.referenceAnalysis, { minScore: 0.4 })

      if (matchResult) {
        console.log('[Template Match] ✅ Template matched:', {
          templateId: matchResult.templateId,
          score: matchResult.score.toFixed(3),
          details: {
            mood: matchResult.matchDetails.moodScore.toFixed(3),
            color: matchResult.matchDetails.colorScore.toFixed(3),
            typography: matchResult.matchDetails.typographyScore.toFixed(3),
            layout: matchResult.matchDetails.layoutScore.toFixed(3),
            keyword: matchResult.matchDetails.keywordScore.toFixed(3),
          },
        })

        // 🎨 NEW: 템플릿을 AI guide로 사용
        const template = getTemplateById(matchResult.templateId)

        if (!template) {
          return NextResponse.json(
            { success: false, error: 'Template not found' },
            { status: 500 }
          )
        }

        const context = await getDocumentContextForAI(document.id)
        if (!context) {
          return NextResponse.json(
            { success: false, error: 'Failed to get document context' },
            { status: 500 }
          )
        }

        // 템플릿 가이드 시스템 프롬프트 생성
        const systemPrompt = buildTemplateGuidedSystemPrompt(context, template)
        const userPrompt = buildLandingUserPrompt(body.prompt)

        // AI 호출 (템플릿 컨텍스트 포함)
        const aiResponse = await callGeminiAPI(systemPrompt, userPrompt)

        if (!aiResponse.success || !aiResponse.patches) {
          // AI 실패 시 fallback: 템플릿 직접 적용
          console.warn('[Template-Guided AI] AI failed, using direct template application')
          const { style, blocks } = applyTemplateToDocument(matchResult.templateId, document)
          await updateDocument(document.id, { style, blocks })

          return NextResponse.json({
            success: true,
            documentId: document.id,
            templateApplied: matchResult.templateId,
            matchScore: matchResult.score,
            aiApplied: false,
            explanation: `템플릿을 직접 적용했습니다 (AI 실패)`,
          })
        }

        // 패치 적용
        const result = await applyAIEdit(
          document.id,
          aiResponse.patches,
          body.prompt,
          aiResponse.explanation || 'AI 디자인 적용'
        )

        // 스냅샷 ID 조회
        const latestSnapshot = await db.query.editorSnapshotsV2.findFirst({
          where: and(
            eq(editorSnapshotsV2.documentId, document.id),
            eq(editorSnapshotsV2.type, 'ai-edit')
          ),
          orderBy: [desc(editorSnapshotsV2.snapshotNumber)],
          columns: { id: true },
        })

        // AI 사용 내역 로깅
        await db.insert(aiEditLogsV2).values({
          documentId: document.id,
          userId: user.id,
          prompt: `[Template-Guided: ${template.name}] ${body.prompt}`,
          targetBlockId: null,
          context: null,
          patches: aiResponse.patches,
          explanation: aiResponse.explanation ?? null,
          success: result.success,
          errorMessage: result.error ?? null,
          snapshotId: latestSnapshot?.id ?? null,
        })

        return NextResponse.json({
          success: true,
          documentId: document.id,
          templateApplied: matchResult.templateId,
          matchScore: matchResult.score,
          aiApplied: true,  // ✅ AI 사용됨 (템플릿 가이드)
          explanation: aiResponse.explanation,
        })
      } else {
        // Fallback: 점수가 너무 낮음 → AI 가이드 방식 사용
        const fallbackTemplateId = selectFallbackTemplate(body.referenceAnalysis)
        console.log('[Template Match] ⚠️  No good match, using fallback + AI:', fallbackTemplateId)

        const template = getTemplateById(fallbackTemplateId)
        if (template) {
          const context = await getDocumentContextForAI(document.id)
          if (context) {
            const systemPrompt = buildTemplateGuidedSystemPrompt(context, template)
            const userPrompt = buildLandingUserPrompt(body.prompt)
            const aiResponse = await callGeminiAPI(systemPrompt, userPrompt)

            if (aiResponse.success && aiResponse.patches) {
              const result = await applyAIEdit(
                document.id,
                aiResponse.patches,
                body.prompt,
                aiResponse.explanation || ''
              )

              // 스냅샷 ID 조회
              const latestSnapshot = await db.query.editorSnapshotsV2.findFirst({
                where: and(
                  eq(editorSnapshotsV2.documentId, document.id),
                  eq(editorSnapshotsV2.type, 'ai-edit')
                ),
                orderBy: [desc(editorSnapshotsV2.snapshotNumber)],
                columns: { id: true },
              })

              // AI 로깅
              await db.insert(aiEditLogsV2).values({
                documentId: document.id,
                userId: user.id,
                prompt: `[Template-Guided Fallback: ${template.name}] ${body.prompt}`,
                targetBlockId: null,
                context: null,
                patches: aiResponse.patches,
                explanation: aiResponse.explanation ?? null,
                success: result.success,
                errorMessage: result.error ?? null,
                snapshotId: latestSnapshot?.id ?? null,
              })

              return NextResponse.json({
                success: true,
                documentId: document.id,
                templateApplied: fallbackTemplateId,
                matchScore: 0,
                aiApplied: true,
                explanation: aiResponse.explanation,
              })
            }
          }
        }

        // Double fallback: 템플릿 직접 적용
        const { style, blocks } = applyTemplateToDocument(fallbackTemplateId, document)
        await updateDocument(document.id, { style, blocks })

        return NextResponse.json({
          success: true,
          documentId: document.id,
          templateApplied: fallbackTemplateId,
          matchScore: 0,
          aiApplied: false,
          explanation: `레퍼런스 분위기에 맞는 템플릿을 적용했습니다.`,
        })
      }
    }

    // 3. AI 생성 플로우 (레퍼런스 없을 때 or 템플릿 매칭 스킵)
    console.log('[Landing Generate] Using AI generation (no reference)')

    const context = await getDocumentContextForAI(document.id)

    if (!context) {
      return NextResponse.json(
        { success: false, error: 'Failed to get document context' },
        { status: 500 }
      )
    }

    // 4. AI 프롬프트 생성 (랜딩용 - 전체 디자인 생성)
    const systemPrompt = buildLandingSystemPrompt(context, body.referenceAnalysis)
    const userPrompt = buildLandingUserPrompt(body.prompt)

    // 5. AI 호출
    const aiResponse = await callGeminiAPI(systemPrompt, userPrompt)

    if (!aiResponse.success || !aiResponse.patches) {
      // AI 실패해도 문서는 생성됨 - 기본 템플릿으로 진행
      console.error('[Landing Generate] AI failed:', aiResponse.error)
      return NextResponse.json({
        success: true,
        documentId: document.id,
        aiApplied: false,
        aiError: aiResponse.error,
      })
    }

    // 6. 패치 적용
    const result = await applyAIEdit(
      document.id,
      aiResponse.patches,
      body.prompt,
      aiResponse.explanation || 'AI 디자인 적용'
    )

    // 7. 스냅샷 ID 조회
    const latestSnapshot = await db.query.editorSnapshotsV2.findFirst({
      where: and(
        eq(editorSnapshotsV2.documentId, document.id),
        eq(editorSnapshotsV2.type, 'ai-edit')
      ),
      orderBy: [desc(editorSnapshotsV2.snapshotNumber)],
      columns: { id: true },
    })

    // 8. AI 사용 내역 로깅
    await db.insert(aiEditLogsV2).values({
      documentId: document.id,
      userId: user.id,
      prompt: body.prompt,
      targetBlockId: null,
      context: null,  // context 타입은 AIEditRequest['context']와 호환되어야 함
      patches: aiResponse.patches,
      explanation: aiResponse.explanation ?? null,
      success: result.success,
      errorMessage: result.error ?? null,
      snapshotId: latestSnapshot?.id ?? null,
    })

    return NextResponse.json({
      success: true,
      documentId: document.id,
      aiApplied: result.success,
      explanation: aiResponse.explanation,
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
// Prompt Builders (Landing-specific)
// ============================================

function buildLandingSystemPrompt(
  context: Awaited<ReturnType<typeof getDocumentContextForAI>>,
  referenceAnalysis?: ReferenceAnalysis
): string {
  if (!context) return ''

  const blockLabels = Object.entries(BLOCK_TYPE_LABELS)
    .map(([type, label]) => `${type}: ${label}`)
    .join(', ')

  return `당신은 청첩장 디자인 AI 어시스턴트입니다.
사용자의 느낌/분위기 요청을 바탕으로 아름다운 청첩장을 디자인합니다.
JSON Patch를 생성하여 기본 청첩장을 사용자가 원하는 스타일로 변환합니다.

## 역할
사용자는 "럭셔리하게", "미니멀하게", "따뜻하게" 등 **느낌만 말합니다**.
당신이 그 느낌을 구체적인 디자인으로 해석해야 합니다:
- 색상 (배경, 텍스트)
- 폰트 스타일 (크기, 굵기)
- 레이아웃 (요소 위치, 크기)
- 분위기 (여백, 정렬)

## 블록 타입
${blockLabels}

## 스타일 프리셋 옵션
- minimal-light: 밝은 미니멀
- minimal-dark: 어두운 미니멀 (럭셔리, 시네마틱)
- classic-serif: 클래식 세리프
- modern-sans: 모던 산세리프
- romantic-script: 로맨틱 스크립트
- nature-organic: 자연 오가닉

## 색상 가이드
- 럭셔리/시네마틱: 어두운 배경 (#0A0A0A ~ #1A1A1A) + 골드/크림 텍스트
- 미니멀/심플: 화이트/아이보리 배경 + 다크 그레이 텍스트
- 따뜻함/감성: 크림/베이지 배경 + 브라운/세피아 텍스트
- 모던/트렌디: 뉴트럴 배경 + 강조색 포인트

## 현재 문서 상태
### 블록 목록
${context.blockSummary}

### 스타일 설정
- 프리셋: ${context.style?.preset || 'custom'}
${referenceAnalysis ? `
## 참고 레퍼런스 분석 결과
사용자가 제공한 레퍼런스 이미지입니다. 이 스타일을 참고하세요.

- 분위기: ${referenceAnalysis.mood.join(', ')}
- 색상 팔레트: ${referenceAnalysis.colors.join(', ')}
- 타이포그래피: ${referenceAnalysis.typography}
- 레이아웃 스타일: ${referenceAnalysis.layout}
- 키워드: ${referenceAnalysis.keywords.join(', ')}
- 스타일 요약: ${referenceAnalysis.summary}
` : ''}

## 출력 형식
반드시 다음 JSON 형식으로만 응답하세요:

\`\`\`json
{
  "analysis": {
    "intent": "사용자가 원하는 느낌 해석",
    "styleDirection": "적용할 스타일 방향",
    "colorPalette": ["#색상1", "#색상2", "#색상3"]
  },
  "patches": [
    { "op": "replace", "path": "/style/preset", "value": "minimal-dark" },
    { "op": "replace", "path": "/blocks/0/style/background/color", "value": "#0A0A0A" }
  ],
  "explanation": "사용자에게 보여줄 변경 설명 (한국어, 친근하게)"
}
\`\`\`

## 주요 수정 대상
1. /style/preset - 전체 스타일 프리셋
2. /blocks/{index}/style/background/color - 블록 배경색
3. /blocks/{index}/elements/{index}/style/text/color - 텍스트 색상
4. /blocks/{index}/elements/{index}/style/text/fontSize - 폰트 크기
5. /blocks/{index}/height - 블록 높이 (vh)

## 주의사항
- 사용자는 디자인 전문가가 아닙니다. 느낌만 말합니다.
- 당신이 전문가로서 느낌을 구체적인 디자인으로 해석하세요.
- 첫 인상이 중요합니다 - intro 블록(인덱스 0)에 특히 신경 쓰세요.
- 일관된 색상 팔레트를 유지하세요.
`
}

function buildLandingUserPrompt(prompt: string): string {
  return `## 사용자 요청
"${prompt}"

위 느낌을 가진 청첩장으로 디자인해주세요.
사용자의 의도를 잘 해석하여 전체적인 스타일을 적용해주세요.`
}

/**
 * 템플릿 메타데이터를 AI에게 design guide로 전달하는 시스템 프롬프트 생성
 */
function buildTemplateGuidedSystemPrompt(
  context: Awaited<ReturnType<typeof getDocumentContextForAI>>,
  template: TemplateMetadata
): string {
  if (!context) return ''

  const { designPattern } = template
  const blockLabels = Object.entries(BLOCK_TYPE_LABELS)
    .map(([type, label]) => `${type}: ${label}`)
    .join(', ')

  return `당신은 청첩장 디자인 AI 어시스턴트입니다.
사용자의 요청과 선택된 템플릿을 바탕으로 아름다운 청첩장을 디자인합니다.

## 선택된 템플릿: ${template.name} (${template.id})

### 템플릿 분위기
${template.mood.join(', ')} - ${template.summary}

### 색상 시스템 (반드시 이 팔레트 사용)
**Primary Colors** (메인 텍스트, 강조 요소):
- ${designPattern.colorPalette.primary[0]} (다크)
- ${designPattern.colorPalette.primary[1]} (미드톤)
- ${designPattern.colorPalette.primary[2]} (하이라이트)

**Secondary Colors** (배경, 카드 surface):
- ${designPattern.colorPalette.secondary[0]} (가장 밝음)
- ${designPattern.colorPalette.secondary[1]} (중간 밝기)
- ${designPattern.colorPalette.secondary[2]} (약간 어두움)

**Tertiary Colors** (강조색, 버튼, 링크):
- ${designPattern.colorPalette.tertiary[0]} (주 강조)
- ${designPattern.colorPalette.tertiary[1]} (보조 강조)
- ${designPattern.colorPalette.tertiary[2]} (divider, border)

### 타이포그래피 가이드
- 스타일: ${template.typography}
- 레이아웃 특성: ${template.layout}

### 디자인 원칙
1. **일관성**: 모든 블록이 위 컬러 팔레트를 사용해야 합니다
2. **계층**: Primary(텍스트) > Secondary(배경) > Tertiary(강조)
3. **분위기**: ${template.mood.join(', ')} 느낌을 유지하세요
4. **전체 적용**: intro뿐만 아니라 greeting, gallery, venue 등 모든 섹션에 일관되게 적용

## 블록 타입
${blockLabels}

## 현재 문서 상태
### 블록 목록
${context.blockSummary}

### 스타일 설정
- 프리셋: ${context.style?.preset || 'custom'}

## 출력 형식
반드시 다음 JSON 형식으로만 응답하세요:

\`\`\`json
{
  "analysis": {
    "templateUsed": "${template.id}",
    "colorStrategy": "위 Primary/Secondary/Tertiary 팔레트 적용 방식 설명",
    "moodInterpretation": "템플릿 분위기를 어떻게 반영했는지"
  },
  "patches": [
    { "op": "replace", "path": "/style/preset", "value": "${designPattern.stylePreset || 'custom'}" },
    { "op": "replace", "path": "/blocks/0/style/background/color", "value": "${designPattern.colorPalette.secondary[0]}" },
    { "op": "replace", "path": "/blocks/0/elements/0/style/text/color", "value": "${designPattern.colorPalette.primary[0]}" }
  ],
  "explanation": "사용자에게 보여줄 변경 설명 (한국어, 친근하게)"
}
\`\`\`

## 주요 수정 대상
1. /style/preset - ${designPattern.stylePreset || 'custom'}
2. /blocks/{index}/style/background/color - Secondary 팔레트 사용
3. /blocks/{index}/elements/{index}/style/text/color - Primary 팔레트 사용
4. /blocks/{index}/elements/{index}/style/text/fontSize - 템플릿 분위기에 맞게
5. 버튼/강조 요소 - Tertiary 팔레트 사용

## 주의사항
- 템플릿 색상을 정확히 따르세요 (HEX 코드 그대로 사용)
- 모든 블록에 일관된 색상 시스템을 적용하세요
- 첫 인상이 중요합니다 - intro 블록(인덱스 0)에 특히 신경 쓰세요
`
}

// ============================================
// Gemini API Call
// ============================================

interface GeminiResponse {
  success: boolean
  patches?: JSONPatch[]
  explanation?: string
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
        maxOutputTokens: 8192,
        temperature: 0.5, // 약간의 창의성
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
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/)
    if (!jsonMatch) {
      try {
        const parsed = JSON.parse(content)
        return {
          success: true,
          patches: parsed.patches,
          explanation: parsed.explanation,
        }
      } catch {
        return {
          success: false,
          error: 'Failed to parse AI response',
        }
      }
    }

    const parsed = JSON.parse(jsonMatch[1])

    return {
      success: true,
      patches: parsed.patches,
      explanation: parsed.explanation,
    }
  } catch (error) {
    console.error('Gemini API call failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
