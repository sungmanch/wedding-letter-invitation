import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { LayoutSchema } from '@/lib/super-editor/schema/layout'
import type { StyleSchema } from '@/lib/super-editor/schema/style'
import type { EditorSchema } from '@/lib/super-editor/schema/editor'
import type { UserData } from '@/lib/super-editor/schema/user-data'

// ============================================
// Types
// ============================================

interface SuggestionsRequest {
  layout?: LayoutSchema
  style?: StyleSchema
  editor?: EditorSchema
  userData?: UserData
}

interface Suggestion {
  id: string
  type: 'add' | 'modify' | 'remove' | 'style'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
}

// ============================================
// Google AI Client
// ============================================

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')
const MODEL = 'gemini-3-pro-preview'

// ============================================
// System Prompt for Suggestions
// ============================================

const SUGGESTIONS_SYSTEM_PROMPT = `당신은 청첩장 디자인 전문 AI입니다.
현재 청첩장 템플릿을 분석하고, 개선을 위한 제안을 생성합니다.

# 분석 관점
1. **필수 섹션 누락**: 지도, 갤러리, 계좌정보, 참석여부 등
2. **UX 개선**: 버튼 위치, 여백, 가독성
3. **스타일 일관성**: 색상, 폰트, 간격 통일
4. **애니메이션**: 적절한 트랜지션 추가
5. **접근성**: 충분한 색상 대비, 터치 영역

# 응답 형식
JSON 배열로 2-4개의 제안을 반환합니다:

\`\`\`json
{
  "suggestions": [
    {
      "id": "suggestion-1",
      "type": "add",
      "title": "갤러리 섹션 추가",
      "description": "사진 갤러리가 없습니다. 커플 사진을 보여줄 갤러리를 추가하면 좋겠어요.",
      "priority": "high"
    }
  ]
}
\`\`\`

## type 종류
- add: 새로운 컴포넌트/섹션 추가
- modify: 기존 컴포넌트 수정
- remove: 불필요한 요소 제거
- style: 스타일/디자인 변경

## priority 기준
- high: 필수 섹션 누락, 심각한 UX 문제
- medium: 개선하면 좋은 사항
- low: 선택적 개선 사항

제안은 구체적이고 실행 가능해야 합니다.
한국어로 친근하게 작성해주세요.
`

// ============================================
// Helper Functions
// ============================================

function buildAnalysisMessage(request: SuggestionsRequest): string {
  const parts: string[] = ['## 현재 청첩장 분석 요청\n']

  if (request.layout) {
    // 간단한 구조 요약
    const screenTypes = request.layout.screens.map(s => s.type)
    const nodeTypes = new Set<string>()

    function collectNodeTypes(node: { type: string; children?: unknown[] }) {
      nodeTypes.add(node.type)
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(child => collectNodeTypes(child as { type: string; children?: unknown[] }))
      }
    }

    request.layout.screens.forEach(screen => collectNodeTypes(screen.root))

    parts.push(`### Layout 요약`)
    parts.push(`- 카테고리: ${request.layout.meta.category}`)
    parts.push(`- 화면 타입: ${screenTypes.join(', ')}`)
    parts.push(`- 사용된 컴포넌트: ${Array.from(nodeTypes).join(', ')}`)
    parts.push('')
  }

  if (request.style) {
    parts.push(`### Style 요약`)
    parts.push(`- 이름: ${request.style.meta.name}`)
    parts.push(`- 분위기: ${request.style.meta.mood?.join(', ') || '미지정'}`)
    parts.push(`- 메인 색상: ${request.style.theme.colors.primary[500]}`)
    parts.push('')
  }

  if (request.editor) {
    const sectionTitles = request.editor.sections.map(s => s.title)
    parts.push(`### Editor 섹션`)
    parts.push(`- ${sectionTitles.join(', ')}`)
    parts.push('')
  }

  if (request.userData) {
    // 어떤 데이터가 채워졌는지 확인
    const filledFields: string[] = []
    const emptyFields: string[] = []

    const checkData = (obj: Record<string, unknown>, prefix = '') => {
      for (const [key, value] of Object.entries(obj)) {
        const path = prefix ? `${prefix}.${key}` : key
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          checkData(value as Record<string, unknown>, path)
        } else if (value !== undefined && value !== null && value !== '') {
          filledFields.push(path)
        } else {
          emptyFields.push(path)
        }
      }
    }

    if (typeof request.userData.data === 'object') {
      checkData(request.userData.data as Record<string, unknown>)
    }

    parts.push(`### 데이터 상태`)
    parts.push(`- 입력된 필드: ${filledFields.length}개`)
    parts.push(`- 비어있는 필드: ${emptyFields.length}개`)
    parts.push('')
  }

  if (!request.layout) {
    parts.push('⚠️ 템플릿이 아직 생성되지 않았습니다.')
  }

  parts.push('\n위 정보를 바탕으로 개선 제안을 해주세요.')

  return parts.join('\n')
}

function parseResponse(content: string): Suggestion[] {
  // JSON 블록 추출
  const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/)
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[1])
      return parsed.suggestions || []
    } catch {
      // 파싱 실패
    }
  }

  // 전체가 JSON인 경우
  try {
    const parsed = JSON.parse(content)
    return parsed.suggestions || []
  } catch {
    return []
  }
}

// ============================================
// API Route Handler
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body: SuggestionsRequest = await request.json()

    // Gemini 모델 초기화
    const model = genAI.getGenerativeModel({ model: MODEL })

    // Gemini API 호출
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${SUGGESTIONS_SYSTEM_PROMPT}\n\n${buildAnalysisMessage(body)}` }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      },
    })

    const response = await result.response
    const text = response.text()

    if (!text) {
      throw new Error('AI 응답을 처리할 수 없습니다.')
    }

    const suggestions = parseResponse(text)

    return NextResponse.json({ suggestions })

  } catch (error: unknown) {
    console.error('Super Editor Suggestions API Error:', error)

    return NextResponse.json(
      { error: '요청을 처리하는 중 오류가 발생했습니다.', suggestions: [] },
      { status: 500 }
    )
  }
}
