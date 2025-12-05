import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { getPromptForMode, type EditMode } from '@/lib/super-editor/prompts/mode-prompts'
import type { LayoutSchema } from '@/lib/super-editor/schema/layout'
import type { StyleSchema } from '@/lib/super-editor/schema/style'
import type { EditorSchema } from '@/lib/super-editor/schema/editor'

// ============================================
// Types
// ============================================

interface ChatRequest {
  message: string
  editMode?: EditMode
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
  const mode = request.editMode || 'style'

  // 현재 템플릿 상태 (모드에 따라 필요한 것만)
  const hasContext = request.currentLayout || request.currentStyle || request.currentEditor
  if (hasContext) {
    parts.push('## 현재 상태\n')

    // 모드별로 해당 스키마만 포함 (컨텍스트 절약)
    if (request.currentStyle && (mode === 'style' || mode === 'all')) {
      // 스타일은 핵심 정보만 요약
      const stylesSummary = {
        colors: request.currentStyle.theme?.colors,
        fonts: request.currentStyle.theme?.typography?.fonts,
      }
      parts.push(`### Style\n\`\`\`json\n${JSON.stringify(stylesSummary, null, 2)}\n\`\`\`\n`)
    }

    if (request.currentLayout && (mode === 'layout' || mode === 'all')) {
      // 레이아웃은 구조만 요약
      const layoutSummary = {
        meta: request.currentLayout.meta,
        screens: request.currentLayout.screens?.map((s) => ({
          id: s.id,
          type: s.type,
          name: s.name,
        })),
      }
      parts.push(`### Layout\n\`\`\`json\n${JSON.stringify(layoutSummary, null, 2)}\n\`\`\`\n`)
    }

    if (request.currentEditor && (mode === 'editor' || mode === 'all')) {
      // 에디터는 섹션 목록만 요약
      const editorSummary = {
        sections: request.currentEditor.sections?.map((s) => ({
          id: s.id,
          title: s.title,
          fieldCount: s.fields?.length || 0,
        })),
      }
      parts.push(`### Editor\n\`\`\`json\n${JSON.stringify(editorSummary, null, 2)}\n\`\`\`\n`)
    }
  }

  // 사용자 요청
  parts.push(`## 요청\n${request.message}`)

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
      return NextResponse.json({ error: '메시지가 필요합니다.' }, { status: 400 })
    }

    // 모드별 시스템 프롬프트 선택
    const editMode = body.editMode || 'style'
    const systemPrompt = getPromptForMode(editMode)

    // Gemini 모델 초기화 (시스템 프롬프트 포함)
    const model = genAI.getGenerativeModel({
      model: MODEL,
      systemInstruction: systemPrompt,
    })

    // 대화 히스토리 구성 (Gemini 형식)
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = []

    // 이전 대화 히스토리 추가 (최근 것만)
    if (body.history && body.history.length > 0) {
      for (const msg of body.history.slice(-4)) {
        // 최근 4개만
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        })
      }
    }

    // 현재 사용자 메시지 추가
    const userMessage = buildUserMessage(body)
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }],
    })
    console.log(contents)
    // Gemini API 호출
    const result = await model.generateContent({
      contents,
      generationConfig: {
        maxOutputTokens: 4096,
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

    return NextResponse.json({ error: '요청을 처리하는 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
