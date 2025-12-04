import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { SUPER_EDITOR_SYSTEM_PROMPT } from '@/lib/super-editor/prompts'
import type { LayoutSchema } from '@/lib/super-editor/schema/layout'
import type { StyleSchema } from '@/lib/super-editor/schema/style'
import type { EditorSchema } from '@/lib/super-editor/schema/editor'

// ============================================
// Types
// ============================================

interface ChatRequest {
  message: string
  currentLayout?: LayoutSchema
  currentStyle?: StyleSchema
  currentEditor?: EditorSchema
  history?: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
}

interface ChatResponse {
  message: string
  changes?: {
    type: 'full' | 'partial'
    layout?: LayoutSchema
    style?: StyleSchema
    editor?: EditorSchema
    description?: string
    affectedNodes?: string[]
  }
  suggestions?: Array<{
    id: string
    type: 'add' | 'modify' | 'remove' | 'style'
    title: string
    description: string
    priority: 'high' | 'medium' | 'low'
  }>
}

// ============================================
// Google AI Client
// ============================================

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')
const MODEL = 'gemini-3-pro-preview'

// ============================================
// Helper Functions
// ============================================

function buildUserMessage(request: ChatRequest): string {
  const parts: string[] = []

  // 현재 템플릿 상태
  if (request.currentLayout || request.currentStyle || request.currentEditor) {
    parts.push('## 현재 템플릿 상태\n')

    if (request.currentLayout) {
      parts.push(`### Layout\n\`\`\`json\n${JSON.stringify(request.currentLayout, null, 2)}\n\`\`\`\n`)
    }

    if (request.currentStyle) {
      parts.push(`### Style\n\`\`\`json\n${JSON.stringify(request.currentStyle, null, 2)}\n\`\`\`\n`)
    }

    if (request.currentEditor) {
      parts.push(`### Editor\n\`\`\`json\n${JSON.stringify(request.currentEditor, null, 2)}\n\`\`\`\n`)
    }
  }

  // 사용자 요청
  parts.push(`## 사용자 요청\n${request.message}`)

  // 응답 형식 안내
  parts.push(`
## 응답 형식

다음 JSON 형식으로 응답해주세요:

\`\`\`json
{
  "message": "사용자에게 보여줄 친근한 응답 메시지",
  "changes": {
    "type": "full" | "partial",
    "layout": { ... 변경된 LayoutSchema (변경 없으면 생략) },
    "style": { ... 변경된 StyleSchema (변경 없으면 생략) },
    "editor": { ... 변경된 EditorSchema (변경 없으면 생략) },
    "description": "변경 내용 요약",
    "affectedNodes": ["변경된 노드 ID 목록"]
  },
  "suggestions": [
    {
      "id": "suggestion-1",
      "type": "add",
      "title": "제안 제목",
      "description": "제안 설명",
      "priority": "high" | "medium" | "low"
    }
  ]
}
\`\`\`

**중요:**
- message는 한국어로 친근하게 작성
- 변경사항이 없으면 changes는 생략
- 현재 템플릿이 없으면 새로 생성 (type: "full")
- 현재 템플릿이 있으면 부분 수정 (type: "partial") 권장
- suggestions는 다음 단계로 추천할 작업들 (2-3개)
`)

  return parts.join('\n')
}

function parseAIResponse(content: string): ChatResponse {
  // JSON 블록 추출
  const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/)
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1])
    } catch {
      // JSON 파싱 실패 시 기본 응답
    }
  }

  // 전체가 JSON인 경우
  try {
    return JSON.parse(content)
  } catch {
    // JSON이 아닌 경우 메시지로만 처리
    return {
      message: content,
    }
  }
}

// ============================================
// API Route Handler
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()

    if (!body.message) {
      return NextResponse.json(
        { error: '메시지가 필요합니다.' },
        { status: 400 }
      )
    }

    // Gemini 모델 초기화
    const model = genAI.getGenerativeModel({ model: MODEL })

    // 대화 히스토리 구성 (Gemini 형식)
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = []

    // 이전 대화 히스토리 추가
    if (body.history && body.history.length > 0) {
      for (const msg of body.history) {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        })
      }
    }

    // 현재 사용자 메시지 추가 (시스템 프롬프트 포함)
    const userMessage = buildUserMessage(body)
    const fullPrompt = contents.length === 0
      ? `${SUPER_EDITOR_SYSTEM_PROMPT}\n\n${userMessage}`
      : userMessage

    contents.push({
      role: 'user',
      parts: [{ text: fullPrompt }],
    })

    // Gemini API 호출
    const result = await model.generateContent({
      contents,
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.7,
      },
    })

    const response = await result.response
    const text = response.text()

    if (!text) {
      throw new Error('AI 응답을 처리할 수 없습니다.')
    }

    const parsed = parseAIResponse(text)

    return NextResponse.json(parsed)

  } catch (error: unknown) {
    console.error('Super Editor Chat API Error:', error)

    return NextResponse.json(
      { error: '요청을 처리하는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
