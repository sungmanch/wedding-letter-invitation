import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { eq, and, desc } from 'drizzle-orm'
import {
  getDocumentContextForAI,
  applyAIEdit,
  type AIEditRequest,
  type JSONPatch,
} from '@/lib/super-editor-v2/actions'
import { BLOCK_TYPE_LABELS, aiEditLogsV2, editorSnapshotsV2 } from '@/lib/super-editor-v2/schema'

// ============================================
// Google AI Client
// ============================================

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')
const MODEL = 'gemini-3-pro-preview'

// ============================================
// AI Edit API Route
// ============================================

export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // 요청 파싱
    const body = await request.json() as AIEditRequest

    if (!body.documentId || !body.prompt) {
      return NextResponse.json(
        { error: 'documentId and prompt are required' },
        { status: 400 }
      )
    }

    // 문서 컨텍스트 조회
    const context = await getDocumentContextForAI(body.documentId)

    if (!context) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    // AI 프롬프트 생성
    const systemPrompt = buildSystemPrompt(context, body.targetBlockId, body.referenceAnalysis)
    const userPrompt = buildUserPrompt(body.prompt, body.context)

    // 디버깅: 프롬프트 크기 확인
    const totalPromptLength = systemPrompt.length + userPrompt.length
    console.log('[Gemini Debug] System prompt length:', systemPrompt.length)
    console.log('[Gemini Debug] User prompt length:', userPrompt.length)
    console.log('[Gemini Debug] Total prompt length:', totalPromptLength)
    console.log('[Gemini Debug] Estimated tokens:', Math.ceil(totalPromptLength / 4))

    // AI 호출 (Google Gemini)
    const aiResponse = await callGeminiAPI(systemPrompt, userPrompt)

    if (!aiResponse.success) {
      return NextResponse.json(
        { error: aiResponse.error, success: false },
        { status: 500 }
      )
    }

    // 패치 적용
    const result = await applyAIEdit(
      body.documentId,
      aiResponse.patches!,
      body.prompt,
      aiResponse.explanation!
    )

    // 스냅샷 ID 조회 (방금 생성된 ai-edit 스냅샷)
    const latestSnapshot = await db.query.editorSnapshotsV2.findFirst({
      where: and(
        eq(editorSnapshotsV2.documentId, body.documentId),
        eq(editorSnapshotsV2.type, 'ai-edit')
      ),
      orderBy: [desc(editorSnapshotsV2.snapshotNumber)],
      columns: { id: true },
    })

    // AI 사용 내역 로깅
    await db.insert(aiEditLogsV2).values({
      documentId: body.documentId,
      userId: user.id,
      prompt: body.prompt,
      targetBlockId: body.targetBlockId ?? null,
      context: body.context ?? null,
      patches: aiResponse.patches ?? null,
      explanation: aiResponse.explanation ?? null,
      success: result.success,
      errorMessage: result.error ?? null,
      snapshotId: latestSnapshot?.id ?? null,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error, success: false },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      patches: aiResponse.patches,
      explanation: aiResponse.explanation,
    })
  } catch (error) {
    console.error('AI Edit API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    )
  }
}

// ============================================
// Prompt Builders
// ============================================

function buildSystemPrompt(
  context: Awaited<ReturnType<typeof getDocumentContextForAI>>,
  targetBlockId?: string,
  referenceAnalysis?: AIEditRequest['referenceAnalysis']
): string {
  if (!context) return ''

  const blockLabels = Object.entries(BLOCK_TYPE_LABELS)
    .map(([type, label]) => `${type}: ${label}`)
    .join(', ')

  let targetBlockInfo = ''
  if (targetBlockId) {
    const targetBlockIndex = context.blocks.findIndex(b => b.id === targetBlockId)
    const targetBlock = context.blocks[targetBlockIndex]
    if (targetBlock && targetBlockIndex !== -1) {
      // 요소 요약 (토큰 절약)
      const elementsSummary = (targetBlock.elements ?? []).map((el, idx) => {
        return `  [${idx}] ${el.type} (id: ${el.id}, binding: ${el.binding || 'none'}, x: ${el.x}, y: ${el.y}, w: ${el.width}, h: ${el.height})`
      }).join('\n')

      targetBlockInfo = `
## 수정 대상 블록
- **블록 인덱스**: ${targetBlockIndex} (경로: /blocks/${targetBlockIndex}/...)
- ID: ${targetBlock.id}
- 타입: ${targetBlock.type} (${BLOCK_TYPE_LABELS[targetBlock.type]})
- 높이: ${targetBlock.height}vh
- enabled: ${targetBlock.enabled}
- 요소 목록:
${elementsSummary}
`
    }
  }

  return `당신은 청첩장 디자인 AI 어시스턴트입니다.
사용자의 요청을 분석하여 청첩장 문서를 수정하는 JSON Patch를 생성합니다.

## 블록 타입
${blockLabels}

## 블록 스키마 (수정 가능한 속성만 나열)
\`\`\`typescript
interface Block {
  id: string              // 읽기 전용, 수정 불가
  type: BlockType         // 읽기 전용, 수정 불가
  enabled: boolean        // 블록 활성화 여부
  height: number          // 블록 높이 (vh 단위, 10~200)
  elements: Element[]     // 요소 배열
  style?: {               // 블록 레벨 스타일 오버라이드
    background?: { color?: string, image?: string }
    padding?: { top?: number, bottom?: number }
  }
}

interface Element {
  id: string              // 읽기 전용
  type: 'text' | 'image' | 'button' | 'divider' | 'spacer' | 'map' | 'calendar'
  binding?: string        // 데이터 바인딩 경로 (기존 바인딩 수정 불가, 새 요소 추가 시 커스텀 바인딩 사용)

  // ⚠️⚠️⚠️ 중요: 위치/크기는 반드시 최상위 속성으로! ⚠️⚠️⚠️
  // style.size나 style.position에 넣으면 안됩니다!
  x: number               // 위치 X (%, 0-100) - 필수!
  y: number               // 위치 Y (%, 0-100) - 필수!
  width: number           // 너비 (%, 0-100) - 필수!
  height: number          // 높이 (%, 0-100) - 필수!

  zIndex?: number         // 레이어 순서
  rotation?: number       // 회전 각도 (deg)
  props?: {               // 요소 타입별 속성
    type: string          // 요소 타입 (필수)
    objectFit?: 'cover' | 'contain'  // 이미지용
  }
  style?: {
    text?: { fontSize: number, fontWeight: number, color: string, textAlign: string }
    opacity?: number
    background?: string
    // ❌ size, position 속성 사용 금지! 최상위 x,y,width,height 사용
  }
  animation?: {
    entrance?: {
      preset?: string  // fade-in, slide-left, slide-right, slide-up, slide-down, zoom-in
      custom?: TweenAction
      delay?: number   // ms
      duration?: number // ms
    }
  }
}

// 애니메이션 액션
interface TweenAction {
  type: 'tween'
  from?: { x?: number, y?: number, opacity?: number, scale?: number }
  to: { x?: number, y?: number, opacity?: number, scale?: number }
  duration: number  // ms
  easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'spring'
}
\`\`\`

## 현재 문서 상태

### 블록 목록
${context.blockSummary}

### 스타일 설정
- 프리셋: ${context.style?.preset || 'custom'}

### 웨딩 데이터
- 신랑: ${context.data.couple?.groom?.name || '(미입력)'}
- 신부: ${context.data.couple?.bride?.name || '(미입력)'}
- 날짜: ${context.data.wedding?.date || '(미입력)'}
- 장소: ${context.data.venue?.name || '(미입력)'}
${targetBlockInfo}
${referenceAnalysis ? `
## 참고 레퍼런스 분석 결과
사용자가 제공한 레퍼런스 이미지/URL을 분석한 결과입니다.
이 스타일을 참고하여 청첩장을 디자인해주세요.

- 분위기: ${referenceAnalysis.mood.join(', ')}
- 색상 팔레트: ${referenceAnalysis.colors.join(', ')}
- 타이포그래피: ${referenceAnalysis.typography}
- 레이아웃 스타일: ${referenceAnalysis.layout}
- 키워드: ${referenceAnalysis.keywords.join(', ')}
- 스타일 요약: ${referenceAnalysis.summary}

위 분석 결과를 반영하여:
1. style.preset을 적절히 선택하거나 (minimal-light, minimal-dark, classic-serif 등)
2. 블록의 style.background.color로 배경색을 지정하고
3. 텍스트 요소의 style.text.color로 글자색을 지정하세요
` : ''}

## 출력 형식

반드시 다음 JSON 형식으로만 응답하세요:

\`\`\`json
{
  "analysis": {
    "intent": "사용자 의도 요약",
    "affectedPaths": ["수정될 경로 목록"],
    "approach": "수정 방식 설명"
  },
  "patches": [
    { "op": "replace", "path": "/blocks/0/elements/0/style/text/fontSize", "value": 32 }
  ],
  "explanation": "사용자에게 보여줄 변경 설명 (한국어)"
}
\`\`\`

## 경로 규칙
- /blocks/{index}/... : 블록 수정
- /blocks/{index}/elements/{index}/... : 요소 수정
- /style/... : 전역 스타일 수정
- /data/... : 웨딩 데이터 수정

## 커스텀 변수 (새 텍스트 추가 시)
새 텍스트 요소를 추가할 때는 반드시 커스텀 바인딩과 데이터를 함께 설정하세요:
1. 요소 추가: binding에 "custom.키이름" 형식 사용 (예: "custom.title", "custom.subtitle")
2. 데이터 추가: /data/custom/키이름 경로에 초기 텍스트 값 설정

예시 - "Wedding Invitation" 텍스트 추가:
\`\`\`json
{
  "patches": [
    { "op": "add", "path": "/blocks/0/elements/-", "value": {
      "id": "el-custom-title",
      "type": "text",
      "binding": "custom.weddingTitle",
      "x": 50, "y": 10, "width": 80, "height": 10, "zIndex": 10,
      "props": { "type": "text" }
    }},
    { "op": "add", "path": "/data/custom", "value": {} },
    { "op": "add", "path": "/data/custom/weddingTitle", "value": "Wedding Invitation" }
  ]
}
\`\`\`
⚠️ /data/custom이 없으면 먼저 빈 객체로 생성한 뒤 값을 추가하세요.

## 주의사항
- 스키마에 정의된 속성만 수정하세요. 존재하지 않는 속성(예: layout, variant)을 만들지 마세요.
- 기존 요소의 바인딩(binding)은 수정하지 마세요 (새 요소 추가 시에만 커스텀 바인딩 사용)
- 블록의 id, type은 변경하지 마세요
- 유효한 JSON Patch만 생성하세요
- 한 번에 너무 많은 변경을 하지 마세요
- ⚠️ 요소 크기/위치 조정은 반드시 최상위 x, y, width, height를 수정하세요 (style.size 사용 금지!)
- 애니메이션 요청 시 animation.entrance를 사용하세요 (preset 또는 custom TweenAction)
- 양쪽에서 들어오는 효과: slide-left (왼쪽→), slide-right (→오른쪽), custom으로 from.x 조정
`
}

function buildUserPrompt(
  prompt: string,
  context?: AIEditRequest['context']
): string {
  let contextInfo = ''

  if (context?.selectedElementId) {
    contextInfo += `\n선택된 요소: ${context.selectedElementId}`
  }

  if (context?.viewportInfo) {
    contextInfo += `\n뷰포트: ${context.viewportInfo.width}x${context.viewportInfo.height}`
  }

  return `## 사용자 요청
${prompt}
${contextInfo}

위 요청을 분석하고 적절한 JSON Patch를 생성해주세요.`
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
        temperature: 0.3,  // 더 결정적인 출력
      },
    })

    const response = await result.response

    // 디버깅: 응답 상태 확인
    console.log('[Gemini Debug] candidates:', JSON.stringify(response.candidates, null, 2))
    console.log('[Gemini Debug] finish reason:', response.candidates?.[0]?.finishReason)
    console.log('[Gemini Debug] safety ratings:', JSON.stringify(response.candidates?.[0]?.safetyRatings, null, 2))

    const content = response.text()
    console.log('[Gemini Debug] content length:', content?.length ?? 0)
    console.log('[Gemini Debug] content preview:', content?.slice(0, 500))

    if (!content) {
      const finishReason = response.candidates?.[0]?.finishReason
      const safetyRatings = response.candidates?.[0]?.safetyRatings
      return {
        success: false,
        error: `Empty response from AI. Finish reason: ${finishReason}, Safety: ${JSON.stringify(safetyRatings)}`,
      }
    }

    // JSON 파싱
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/)
    if (!jsonMatch) {
      // JSON 블록이 없으면 전체 내용을 파싱 시도
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
