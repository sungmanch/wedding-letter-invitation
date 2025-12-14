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
    const systemPrompt = buildSystemPrompt(context, body.targetBlockId)
    const userPrompt = buildUserPrompt(body.prompt, body.context)

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
  targetBlockId?: string
): string {
  if (!context) return ''

  const blockLabels = Object.entries(BLOCK_TYPE_LABELS)
    .map(([type, label]) => `${type}: ${label}`)
    .join(', ')

  let targetBlockInfo = ''
  if (targetBlockId) {
    const targetBlock = context.blocks.find(b => b.id === targetBlockId)
    if (targetBlock) {
      targetBlockInfo = `
## 수정 대상 블록
- ID: ${targetBlock.id}
- 타입: ${targetBlock.type} (${BLOCK_TYPE_LABELS[targetBlock.type]})
- 요소 수: ${targetBlock.elements.length}
- 현재 상태: ${JSON.stringify(targetBlock, null, 2)}
`
    }
  }

  return `당신은 청첩장 디자인 AI 어시스턴트입니다.
사용자의 요청을 분석하여 청첩장 문서를 수정하는 JSON Patch를 생성합니다.

## 블록 타입
${blockLabels}

## 현재 문서 상태

### 블록 목록
${context.blockSummary}

### 스타일 설정
${JSON.stringify(context.style, null, 2)}

### 웨딩 데이터
- 신랑: ${context.data.groom.name || '(미입력)'}
- 신부: ${context.data.bride.name || '(미입력)'}
- 날짜: ${context.data.wedding.date || '(미입력)'}
- 장소: ${context.data.venue.name || '(미입력)'}
${targetBlockInfo}

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
- /style/... : 전역 스타일 수정
- /data/... : 웨딩 데이터 수정

## 주의사항
- 변수 바인딩(binding)은 수정하지 마세요
- 블록의 id는 변경하지 마세요
- 유효한 JSON Patch만 생성하세요
- 한 번에 너무 많은 변경을 하지 마세요
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
        maxOutputTokens: 4096,
        temperature: 0.7,
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
