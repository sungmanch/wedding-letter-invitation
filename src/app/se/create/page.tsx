'use client'

/**
 * Super Editor - Create Page
 * AI 채팅(Letty)으로 인트로 생성
 */

import { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Sparkles, RefreshCw } from 'lucide-react'
import { InvitationPreview } from '@/lib/super-editor/components'
import { introResultToLayout } from '@/lib/super-editor/adapters'
import {
  generateIntroOnlyAction,
  completeTemplateAction,
  saveInvitationAction,
} from '@/lib/super-editor/actions/generate'
import type { IntroGenerationResult } from '@/lib/super-editor/services'
import {
  PreviewDataForm,
  formDataToUserData,
  DEFAULT_PREVIEW_FORM_DATA,
  type PreviewFormData,
} from './PreviewDataForm'

// Letty 대화 컴포넌트
import { LettyChat } from './components/LettyChat'
import type { CollectedData } from './hooks/useLettyConversation'

// PhoneFrame 크기 설정
const PHONE_FRAME_WIDTH = 320
const PHONE_FRAME_HEIGHT = 580

function EmptyPreview() {
  return (
    <div className="flex flex-col items-center justify-center text-[#F5E6D3]/50 px-8 py-16 border border-[#C9A962]/30 rounded-xl bg-[#1A1A1A]/50">
      <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4">
        <Sparkles className="w-10 h-10 text-[#F5E6D3]/30" />
      </div>
      <p className="text-center text-sm font-medium">Letty와 대화하며</p>
      <p className="text-center text-sm font-medium">청첩장을 디자인해보세요</p>
    </div>
  )
}

// ============================================
// 색상 프리셋 라벨 (프롬프트용)
// ============================================

const COLOR_LABELS: Record<string, string> = {
  'white-gold': '화이트 & 골드',
  'blush-pink': '블러쉬 핑크',
  'deep-navy': '딥 네이비',
  'natural-green': '내추럴 그린',
  'terracotta': '테라코타',
}

const MOOD_LABELS: Record<string, string> = {
  romantic: '로맨틱',
  elegant: '우아한',
  minimal: '미니멀',
  modern: '모던',
  warm: '따뜻한',
  luxury: '럭셔리',
}

// CollectedData → 프롬프트 문자열 변환
function buildPromptFromCollectedData(data: CollectedData): string {
  const parts: string[] = []

  // 분위기
  if (data.moods.length > 0) {
    const moodLabels = data.moods
      .map(m => MOOD_LABELS[m] || m)
      .filter(Boolean)
    parts.push(`${moodLabels.join(', ')} 분위기`)
  }

  // 색상
  if (data.color) {
    const colorLabel = COLOR_LABELS[data.color]
    if (colorLabel) {
      parts.push(`${colorLabel} 색상`)
    }
  } else if (data.customColor) {
    parts.push(`${data.customColor} 색상`)
  }

  // 키워드
  if (data.keyword) {
    parts.push(`"${data.keyword}" 느낌`)
  }

  // 기본값 (모두 Letty에게 맡긴 경우)
  if (parts.length === 0) {
    return '우아하고 세련된 스타일로 만들어주세요'
  }

  return `${parts.join(', ')}의 청첩장을 만들어주세요`
}

// ============================================
// Main Component
// ============================================

export default function SuperEditorCreatePage() {
  const router = useRouter()

  // Chat/Loading state
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  // Stage 1 결과: Style + Intro (AI 생성용)
  const [introResult, setIntroResult] = useState<IntroGenerationResult | null>(null)

  // 프리뷰 데이터 폼
  const [previewFormData, setPreviewFormData] = useState<PreviewFormData>(DEFAULT_PREVIEW_FORM_DATA)
  const previewUserData = useMemo(() => formDataToUserData(previewFormData), [previewFormData])

  // AI 생성 핸들러 (LettyChat에서 호출)
  const handleGenerate = useCallback(async (data: CollectedData) => {
    setIsGenerating(true)

    try {
      const prompt = buildPromptFromCollectedData(data)

      const response = await generateIntroOnlyAction({
        prompt,
        mood: data.moods.length > 0 ? data.moods : undefined,
        colorPreset: data.color || undefined,
        customColor: data.customColor || undefined,
        keyword: data.keyword || undefined,
      })

      if (!response.success || !response.data) {
        throw new Error(response.error ?? 'AI 생성에 실패했습니다')
      }

      setIntroResult(response.data)
    } catch (err) {
      console.error('Generation failed:', err)
      throw err // LettyChat에서 에러 처리
    } finally {
      setIsGenerating(false)
    }
  }, [])

  // Regenerate / Reset
  const handleRegenerate = () => {
    setIntroResult(null)
  }

  // Stage 2 & 3: 기본 섹션 추가 후 DB 저장 및 편집 화면으로 이동
  const handleStartEditing = async () => {
    if (!introResult) return

    setIsLoading(true)

    try {
      // Stage 2: 기본 섹션들로 전체 템플릿 완성
      const completeResponse = await completeTemplateAction({
        introResult: introResult,
      })

      if (!completeResponse.success || !completeResponse.data) {
        throw new Error(completeResponse.error ?? '템플릿 완성에 실패했습니다')
      }

      // Stage 3: DB 저장
      const saveResponse = await saveInvitationAction({
        generationResult: completeResponse.data,
        previewData: {
          groomName: previewFormData.groomName,
          brideName: previewFormData.brideName,
          weddingDate: previewFormData.weddingDate,
          weddingTime: previewFormData.weddingTime,
          mainImage: previewFormData.mainImage,
        },
      })

      if (!saveResponse.success || !saveResponse.data) {
        throw new Error(saveResponse.error ?? '저장에 실패했습니다')
      }

      // 편집 페이지로 이동
      router.push(`/se/${saveResponse.data.invitationId}/edit`)
    } catch (err) {
      console.error('Template save failed:', err)
      alert(err instanceof Error ? err.message : '저장에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0806]">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#0A0806]/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-[#F5E6D3]/70" />
              </button>
              <h1 className="text-lg font-semibold text-[#F5E6D3]">새 청첩장 만들기</h1>
            </div>
            {introResult && (
              <button
                onClick={handleStartEditing}
                disabled={isLoading}
                className="px-4 py-2 bg-[#C9A962] text-[#0A0806] text-sm font-medium rounded-lg hover:bg-[#B8A052] disabled:opacity-50 transition-colors"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    준비 중...
                  </span>
                ) : (
                  '이 디자인으로 시작'
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - 2 Panel Layout */}
      <main className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-56px)]">
          {/* Left Panel - Letty Chat */}
          <div className="flex-1 lg:max-w-xl flex flex-col bg-[#1A1A1A] border-r border-white/10">
            <LettyChat onGenerate={handleGenerate} isGenerating={isGenerating} />
          </div>

          {/* Right Panel - Preview (Intro Only) */}
          <div className="hidden lg:flex flex-1 flex-col items-center justify-start p-8 bg-[#0A0806] overflow-y-auto">
            <div className="flex flex-col items-center w-full max-w-md">
              {/* 프리뷰 데이터 입력 폼 */}
              <div className="w-full mb-6">
                <PreviewDataForm
                  data={previewFormData}
                  onChange={setPreviewFormData}
                />
              </div>

              <div className="text-sm text-[#F5E6D3]/60 mb-4">인트로 미리보기</div>
              {introResult ? (
                <div className="p-4 border border-[#C9A962]/30 rounded-xl bg-[#1A1A1A]/50">
                  <InvitationPreview
                    layout={introResultToLayout(introResult)}
                    style={introResult.style}
                    userData={previewUserData}
                    mode="preview"
                    visibleSections={['intro']}
                    withFrame
                    frameWidth={PHONE_FRAME_WIDTH}
                    frameHeight={PHONE_FRAME_HEIGHT}
                  />
                </div>
              ) : (
                <EmptyPreview />
              )}

              {/* Regenerate button */}
              {introResult && (
                <button
                  onClick={handleRegenerate}
                  className="mt-4 flex items-center gap-2 px-4 py-2 text-sm text-[#F5E6D3]/60 hover:text-[#F5E6D3] hover:bg-white/10 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  다시 생성하기
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Preview FAB */}
      {introResult && (
        <div className="fixed bottom-20 right-4 lg:hidden">
          <button
            onClick={() => {
              /* TODO: 모바일 프리뷰 모달 */
            }}
            className="w-14 h-14 bg-[#C9A962] text-[#0A0806] rounded-full shadow-lg flex items-center justify-center"
          >
            <Sparkles className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  )
}
