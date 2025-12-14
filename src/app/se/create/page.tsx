'use client'

/**
 * Super Editor - Create Page
 * Stage 1: 기본 정보 Form → Stage 2: AI 채팅(Letty)으로 스타일 선택
 */

import { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Loader2, Sparkles, RefreshCw, X } from 'lucide-react'
import { InvitationPreview } from '@/lib/super-editor/components'
import { introResultToLayout } from '@/lib/super-editor/adapters'
import {
  generateIntroOnlyAction,
  completeTemplateAction,
  saveInvitationAction,
} from '@/lib/super-editor/actions/generate'
import type { IntroGenerationResult } from '@/lib/super-editor/services'

// Stage 1: 기본 정보 폼
import { BasicInfoForm, DEFAULT_BASIC_INFO, type BasicInfoData } from './components/BasicInfoForm'

// Stage 2: Letty 대화 컴포넌트
import { LettyChat } from './components/LettyChat'
import type { CollectedData } from './hooks/useLettyConversation'

// 진행 인디케이터
import { ProgressIndicator } from './components/ProgressIndicator'

// PhoneFrame 크기 설정
const PHONE_FRAME_WIDTH = 320
const PHONE_FRAME_HEIGHT = 580

// Stage 타입
type Stage = 'form' | 'chat'

// ============================================
// Preview Components
// ============================================

function EmptyPreview() {
  return (
    <div className="w-full aspect-[9/16] rounded-2xl overflow-hidden shadow-lg relative">
      {/* 배경 이미지 */}
      <Image
        src="/examples/images/example_wedding_image5.png"
        alt="Wedding preview background"
        fill
        className="object-cover"
        priority
      />
      {/* 어두운 오버레이 */}
      <div className="absolute inset-0 bg-black/50" />

      {/* 콘텐츠 */}
      <div className="relative h-full flex flex-col items-center justify-center px-8">
        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <p className="text-center text-sm font-medium text-white/90">Letty와 대화하며</p>
        <p className="text-center text-sm font-medium text-white/90">청첩장을 디자인해보세요</p>
      </div>
    </div>
  )
}

/**
 * Stage 1용 기본 프리뷰 (Form 입력값 실시간 반영)
 */
function BasicPreview({ data }: { data: BasicInfoData }) {
  const displayDate = data.weddingDate
    ? formatDateKorean(data.weddingDate)
    : '2025년 5월 24일'
  const displayTime = data.weddingTime
    ? formatTimeKorean(data.weddingTime)
    : '오후 2시'

  return (
    <div className="w-full aspect-[9/16] rounded-2xl overflow-hidden shadow-lg relative">
      {/* 배경 이미지 */}
      <Image
        src="/examples/images/example_wedding_image5.png"
        alt="Wedding preview background"
        fill
        className="object-cover"
        priority
      />
      {/* 어두운 오버레이 */}
      <div className="absolute inset-0 bg-black/40" />

      {/* 콘텐츠 */}
      <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
        <p className="text-xs tracking-[0.3em] text-white/70 mb-4">WEDDING INVITATION</p>

        <h2
          className="text-2xl text-white mb-1"
          style={{ fontFamily: 'Noto Serif KR, serif' }}
        >
          {data.groomName || '신랑'}
        </h2>
        <span className="text-lg text-[var(--sage-300)] my-1">&</span>
        <h2
          className="text-2xl text-white mb-6"
          style={{ fontFamily: 'Noto Serif KR, serif' }}
        >
          {data.brideName || '신부'}
        </h2>

        <div className="w-12 h-[1px] bg-white/50 mb-6" />

        <p className="text-sm text-white/90 mb-1">{displayDate}</p>
        <p className="text-sm text-white/90 mb-4">{displayTime}</p>
        <p className="text-sm text-white/70">{data.venueName || '예식장'}</p>
      </div>
    </div>
  )
}

// ============================================
// 유틸리티 함수
// ============================================

function formatDateKorean(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  const weekdays = ['일', '월', '화', '수', '목', '금', '토']
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${weekdays[date.getDay()]}요일`
}

function formatTimeKorean(timeStr: string): string {
  if (!timeStr) return ''
  const [hourStr, minuteStr] = timeStr.split(':')
  const hour = parseInt(hourStr, 10)
  const minute = parseInt(minuteStr, 10)
  if (isNaN(hour)) return timeStr

  const period = hour < 12 ? '오전' : '오후'
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  const minutePart = minute > 0 ? ` ${minute}분` : ''

  return `${period} ${displayHour}시${minutePart}`
}

// ============================================
// 색상/분위기 라벨 (프롬프트용)
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

  if (data.moods.length > 0) {
    const moodLabels = data.moods.map((m) => MOOD_LABELS[m] || m).filter(Boolean)
    parts.push(`${moodLabels.join(', ')} 분위기`)
  }

  if (data.color) {
    const colorLabel = COLOR_LABELS[data.color]
    if (colorLabel) {
      parts.push(`${colorLabel} 색상`)
    }
  } else if (data.customColor) {
    parts.push(`${data.customColor} 색상`)
  }

  if (parts.length === 0) {
    return '우아하고 세련된 스타일로 만들어주세요'
  }

  return `${parts.join(', ')}의 청첩장을 만들어주세요`
}

/**
 * BasicInfoData → PreviewUserData 변환
 */
function basicInfoToUserData(data: BasicInfoData) {
  return {
    version: '1.0' as const,
    meta: {
      id: 'preview',
      templateId: 'default',
      layoutId: 'default',
      styleId: 'default',
      editorId: 'default',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    data: {
      couple: {
        groom: { name: data.groomName || '신랑', englishName: 'Groom' },
        bride: { name: data.brideName || '신부', englishName: 'Bride' },
      },
      wedding: {
        date: formatDateKorean(data.weddingDate),
        time: formatTimeKorean(data.weddingTime),
        venue: {
          name: data.venueName || '예식장',
          address: '',
          hall: '',
        },
      },
      message: {
        title: '저희 결혼합니다',
        content: '서로의 마음을 확인하고\n평생을 함께 하고자 합니다.',
      },
      photos: {
        main: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
        gallery: [],
      },
    },
  }
}

// ============================================
// Main Component
// ============================================

export default function SuperEditorCreatePage() {
  const router = useRouter()

  // Stage 관리
  const [stage, setStage] = useState<Stage>('form')

  // Stage 1: 기본 정보
  const [basicInfo, setBasicInfo] = useState<BasicInfoData>(DEFAULT_BASIC_INFO)

  // Stage 2: AI 생성
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [introResult, setIntroResult] = useState<IntroGenerationResult | null>(null)

  // 모바일 프리뷰 모달
  const [showMobilePreview, setShowMobilePreview] = useState(false)

  // Stage 2: 채팅에서 수집된 데이터 (진행 인디케이터용)
  const [collectedData, setCollectedData] = useState<Partial<CollectedData>>({})

  // collectedData 업데이트 핸들러
  const handleCollectedDataChange = useCallback((data: CollectedData) => {
    setCollectedData(data)
  }, [])

  // 프리뷰용 userData
  const previewUserData = useMemo(() => basicInfoToUserData(basicInfo), [basicInfo])

  // Stage 1 → Stage 2 전환
  const handleFormNext = useCallback(() => {
    setStage('chat')
  }, [])

  // Stage 2 → Stage 1 (뒤로가기)
  const handleBackToForm = useCallback(() => {
    setStage('form')
    setIntroResult(null)
  }, [])

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
      })

      if (!response.success || !response.data) {
        throw new Error(response.error ?? 'AI 생성에 실패했습니다')
      }

      setIntroResult(response.data)
    } catch (err) {
      console.error('Generation failed:', err)
      throw err
    } finally {
      setIsGenerating(false)
    }
  }, [])

  // 다시 생성
  const handleRegenerate = () => {
    setIntroResult(null)
  }

  // 편집 페이지로 이동
  const handleStartEditing = async () => {
    if (!introResult) return

    setIsLoading(true)

    try {
      // 전체 템플릿 완성
      const completeResponse = await completeTemplateAction({
        introResult: introResult,
      })

      if (!completeResponse.success || !completeResponse.data) {
        throw new Error(completeResponse.error ?? '템플릿 완성에 실패했습니다')
      }

      // DB 저장
      const saveResponse = await saveInvitationAction({
        generationResult: completeResponse.data,
        previewData: {
          groomName: basicInfo.groomName,
          brideName: basicInfo.brideName,
          weddingDate: basicInfo.weddingDate,
          weddingTime: basicInfo.weddingTime,
          venueName: basicInfo.venueName,
        },
      })

      if (!saveResponse.success || !saveResponse.data) {
        throw new Error(saveResponse.error ?? '저장에 실패했습니다')
      }

      router.push(`/se/${saveResponse.data.invitationId}/edit`)
    } catch (err) {
      console.error('Template save failed:', err)
      alert(err instanceof Error ? err.message : '저장에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  // 헤더 뒤로가기 핸들러
  const handleBack = () => {
    if (stage === 'chat') {
      handleBackToForm()
    } else {
      router.back()
    }
  }

  return (
    <div className="min-h-screen bg-[var(--ivory-50)]">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-[var(--sand-200)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2 -ml-2 rounded-full hover:bg-[var(--sage-50)] transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-[var(--text-primary)]">새 청첩장 만들기</h1>
                <p className="text-xs text-[var(--text-muted)]">
                  {stage === 'form' ? '1/2 기본 정보' : '2/2 스타일 선택'}
                </p>
              </div>
            </div>
            {stage === 'chat' && introResult && (
              <button
                onClick={handleStartEditing}
                disabled={isLoading}
                className="px-4 py-2 bg-[var(--sage-500)] text-white text-sm font-medium rounded-lg hover:bg-[var(--sage-600)] disabled:opacity-50 transition-colors"
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-56px)]">
          {/* Left Panel */}
          <div className="flex-1 lg:max-w-xl flex flex-col bg-white border-r border-[var(--sand-200)]">
            {stage === 'form' ? (
              <BasicInfoForm data={basicInfo} onChange={setBasicInfo} onNext={handleFormNext} />
            ) : (
              <LettyChat
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                initialData={basicInfo}
                onCollectedDataChange={handleCollectedDataChange}
              />
            )}
          </div>

          {/* Right Panel - Preview */}
          <div className="hidden lg:flex flex-1 flex-col items-center justify-start p-8 bg-[var(--ivory-100)] overflow-y-auto">
            <div className="flex flex-col items-center w-full max-w-sm">
              <div className="text-sm text-[var(--text-muted)] mb-4">
                {stage === 'form' ? '미리보기' : '인트로 미리보기'}
              </div>

              {stage === 'form' ? (
                <BasicPreview data={basicInfo} />
              ) : introResult ? (
                <div className="p-4 border border-[var(--sand-200)] rounded-xl bg-white/50">
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
              {stage === 'chat' && introResult && (
                <button
                  onClick={handleRegenerate}
                  className="mt-4 flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--sage-50)] rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  다시 생성하기
                </button>
              )}

              {/* Progress Indicator - Stage 2에서만 표시 */}
              {stage === 'chat' && (
                <div className="mt-6 w-full">
                  <ProgressIndicator
                    basicInfo={basicInfo}
                    collectedData={collectedData}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Preview FAB (Stage 2에서만) */}
      {stage === 'chat' && introResult && (
        <div className="fixed bottom-20 right-4 lg:hidden">
          <button
            onClick={() => setShowMobilePreview(true)}
            className="w-14 h-14 bg-[var(--sage-500)] text-white rounded-full shadow-lg flex items-center justify-center"
          >
            <Sparkles className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Mobile Preview Modal */}
      {showMobilePreview && introResult && (
        <div className="fixed inset-0 z-50 lg:hidden bg-[var(--ivory-50)]/95 backdrop-blur-sm">
          <div className="flex flex-col h-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--sand-200)]">
              <h3 className="text-[var(--text-primary)] font-medium">인트로 미리보기</h3>
              <button
                onClick={() => setShowMobilePreview(false)}
                className="p-2 rounded-full hover:bg-[var(--sage-50)] transition-colors"
              >
                <X className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-y-auto p-4 flex items-start justify-center bg-[var(--ivory-100)]">
              <div className="p-4 border border-[var(--sand-200)] rounded-xl bg-white/50">
                <InvitationPreview
                  layout={introResultToLayout(introResult)}
                  style={introResult.style}
                  userData={previewUserData}
                  mode="preview"
                  visibleSections={['intro']}
                  withFrame
                  frameWidth={280}
                  frameHeight={500}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-4 border-t border-[var(--sand-200)] space-y-3 bg-white">
              <button
                onClick={handleStartEditing}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-[var(--sage-500)] text-white font-medium rounded-xl hover:bg-[var(--sage-600)] disabled:opacity-50 transition-colors"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    준비 중...
                  </span>
                ) : (
                  '이 디자인으로 시작'
                )}
              </button>
              <button
                onClick={() => {
                  setShowMobilePreview(false)
                  handleRegenerate()
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--sage-50)] rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                다시 생성하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
