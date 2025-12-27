'use client'

/**
 * Super Editor v2 - Create Page (Redesigned)
 *
 * Text Prompt + Reference URL 두 입력으로 단순화
 * - 기본 정보(이름, 날짜 등)는 편집 페이지에서 입력
 * - URL은 Gemini API로 분석하여 스타일 힌트 추출
 */

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'
import { createDocument } from '@/lib/super-editor-v2/actions/document'
import { ReferenceInput, type AnalysisResult } from './components/ReferenceInput'

// ============================================
// Prompt Examples (based on system prompt)
// ============================================

const PROMPT_EXAMPLES = {
  layout: [
    '메인 사진을 화면 가득 채우고, 이름은 하단에 작게',
    'hero 블록 높이를 100vh로, 사진 위에 반투명 오버레이',
    '갤러리 블록을 인사말 위로 올려줘',
    '방명록 섹션을 활성화해줘',
  ],
  style: [
    '어두운 배경에 골드 텍스트, 럭셔리한 느낌',
    '화이트 배경에 세리프 폰트, 클래식하게',
    '시네마틱한 다크 테마로 바꿔줘',
    '핑크 파스텔톤으로 로맨틱하게',
  ],
  typography: [
    '신랑신부 이름 폰트 크기를 32px로',
    '인사말 텍스트를 가운데 정렬, 행간 1.8',
    '제목은 굵게, 본문은 가볍게',
  ],
  animation: [
    '인사말에 fade-in 애니메이션 추가',
    '요소들이 왼쪽에서 슬라이드되어 나타나게',
    '0.5초 딜레이로 순차적으로 나타나게',
  ],
}

export default function SE2CreatePage() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [referenceAnalysis, setReferenceAnalysis] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showExamples, setShowExamples] = useState(false)

  // 입력 검증 - 프롬프트는 필수
  const hasValidInput = prompt.trim()

  // 빈 문서로 시작 (샘플 데이터로 미리보기 제공)
  const handleCreateEmpty = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const document = await createDocument({
        title: '새 청첩장',
        useSampleData: true,
      })
      router.push(`/se2/${document.id}/edit`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '문서 생성에 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  // AI로 생성
  const handleCreateWithAI = useCallback(async () => {
    if (!prompt.trim()) {
      setError('어떤 청첩장을 만들고 싶은지 설명해주세요')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // 먼저 샘플 데이터로 문서 생성 (AI가 스타일만 수정)
      const document = await createDocument({
        title: prompt.slice(0, 50) || '새 청첩장',
        useSampleData: true,
      })

      // 프롬프트 구성 (레퍼런스 분석 결과 포함)
      let fullPrompt = '새 청첩장을 만들어주세요.'

      if (referenceAnalysis) {
        fullPrompt += `\n\n[참고 레퍼런스 스타일]\n`
        fullPrompt += `- 분위기: ${referenceAnalysis.mood.join(', ')}\n`
        fullPrompt += `- 색상: ${referenceAnalysis.colors.join(', ')}\n`
        fullPrompt += `- 타이포: ${referenceAnalysis.typography}\n`
        fullPrompt += `- 레이아웃: ${referenceAnalysis.layout}\n`
        fullPrompt += `- 요약: ${referenceAnalysis.summary}\n`
        fullPrompt += `\n이 스타일을 참고하여 디자인해주세요.`
      }

      if (prompt.trim()) {
        fullPrompt += `\n\n[사용자 요청]\n${prompt}`
      }

      // AI API 호출하여 블록 생성
      const response = await fetch('/api/super-editor-v2/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: document.id,
          prompt: fullPrompt,
          action: 'generate',
          referenceAnalysis, // 분석 결과도 함께 전달
        }),
      })

      if (!response.ok) {
        throw new Error('AI 생성에 실패했습니다')
      }

      router.push(`/se2/${document.id}/edit`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '생성에 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }, [prompt, referenceAnalysis, router])

  // 예시 프롬프트 클릭
  const handleExampleClick = (example: string) => {
    setPrompt((prev) => (prev ? `${prev}\n${example}` : example))
  }

  return (
    <div className="min-h-screen bg-[var(--ivory-100)]">
      {/* 헤더 */}
      <header className="fixed top-0 z-50 w-full bg-[var(--ivory-100)]/95 backdrop-blur-sm border-b border-[var(--sand-100)]">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-[var(--sand-100)] transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-[var(--text-primary)]" />
            </Link>
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Maison de Letter" width={160} height={40} priority className="h-8 w-auto" />
            </Link>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-2xl mx-auto px-4 pt-28 pb-16">
        <div className="text-center mb-10">
          <h1
            className="text-2xl sm:text-3xl font-medium text-[var(--text-primary)] mb-3"
            style={{ fontFamily: 'Noto Serif KR, serif' }}
          >
            새 청첩장 만들기
          </h1>
          <p className="text-[var(--text-muted)]">
            원하는 스타일을 설명하거나, 참고 이미지를 첨부해주세요
          </p>
        </div>

        {/* Section 1: 프롬프트 입력 */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-[var(--text-primary)]">
              어떤 청첩장을 만들고 싶으세요? <span className="text-red-400">*</span>
            </h2>
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="flex items-center gap-1 text-xs text-[var(--sage-600)] hover:text-[var(--sage-700)]"
            >
              예시 보기
              {showExamples ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="예: 사진을 크게 보여주고, 어두운 배경에 골드 텍스트로..."
            disabled={isLoading}
            rows={4}
            className="
              w-full px-4 py-3 rounded-xl
              bg-white border border-[var(--sand-100)]
              text-[var(--text-primary)] placeholder:text-[var(--text-light)]
              focus:ring-2 focus:ring-[var(--sage-300)] focus:border-[var(--sage-400)] focus:outline-none
              disabled:opacity-50 disabled:cursor-not-allowed
              resize-none
            "
          />

          {/* 예시 프롬프트 (접기/펼치기) */}
          {showExamples && (
            <div className="mt-4 p-4 rounded-xl bg-white border border-[var(--sand-100)]">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-medium text-[var(--text-muted)] mb-2">레이아웃/구조</h4>
                  <div className="flex flex-wrap gap-2">
                    {PROMPT_EXAMPLES.layout.map((ex, i) => (
                      <button
                        key={i}
                        onClick={() => handleExampleClick(ex)}
                        className="px-2.5 py-1 text-xs bg-[var(--ivory-50)] hover:bg-[var(--sage-100)] border border-[var(--sand-100)] rounded-lg text-[var(--text-primary)] transition-colors"
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-[var(--text-muted)] mb-2">스타일/색상</h4>
                  <div className="flex flex-wrap gap-2">
                    {PROMPT_EXAMPLES.style.map((ex, i) => (
                      <button
                        key={i}
                        onClick={() => handleExampleClick(ex)}
                        className="px-2.5 py-1 text-xs bg-[var(--ivory-50)] hover:bg-[var(--sage-100)] border border-[var(--sand-100)] rounded-lg text-[var(--text-primary)] transition-colors"
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-[var(--text-muted)] mb-2">타이포그래피</h4>
                  <div className="flex flex-wrap gap-2">
                    {PROMPT_EXAMPLES.typography.map((ex, i) => (
                      <button
                        key={i}
                        onClick={() => handleExampleClick(ex)}
                        className="px-2.5 py-1 text-xs bg-[var(--ivory-50)] hover:bg-[var(--sage-100)] border border-[var(--sand-100)] rounded-lg text-[var(--text-primary)] transition-colors"
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-[var(--text-muted)] mb-2">애니메이션</h4>
                  <div className="flex flex-wrap gap-2">
                    {PROMPT_EXAMPLES.animation.map((ex, i) => (
                      <button
                        key={i}
                        onClick={() => handleExampleClick(ex)}
                        className="px-2.5 py-1 text-xs bg-[var(--ivory-50)] hover:bg-[var(--sage-100)] border border-[var(--sand-100)] rounded-lg text-[var(--text-primary)] transition-colors"
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Section 2: 레퍼런스 URL */}
        <section className="mb-8">
          <h2 className="text-sm font-medium text-[var(--text-primary)] mb-3">
            참고할 이미지나 청첩장 URL이 있나요? <span className="text-[var(--text-light)]">(선택)</span>
          </h2>
          <ReferenceInput
            onAnalysisComplete={setReferenceAnalysis}
          />
        </section>

        {/* 구분선 */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 border-t border-[var(--sand-100)]" />
        </div>

        {/* CTA 버튼들 */}
        <div className="space-y-3">
          <button
            onClick={handleCreateWithAI}
            disabled={isLoading || !hasValidInput}
            className="
              w-full py-3.5 rounded-xl font-medium
              bg-[var(--sage-500)] text-white
              hover:bg-[var(--sage-600)]
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors shadow-sm
              flex items-center justify-center gap-2
            "
          >
            {isLoading ? (
              <>
                <LoadingIcon className="w-5 h-5 animate-spin" />
                생성 중...
              </>
            ) : (
              <>
                <SparklesIcon className="w-5 h-5" />
                AI로 생성하기
              </>
            )}
          </button>

          <div className="flex items-center gap-4">
            <div className="flex-1 border-t border-[var(--sand-100)]" />
            <span className="text-sm text-[var(--text-light)]">또는</span>
            <div className="flex-1 border-t border-[var(--sand-100)]" />
          </div>

          <button
            onClick={handleCreateEmpty}
            disabled={isLoading}
            className="
              w-full py-3.5 rounded-xl font-medium
              bg-white border border-[var(--sand-100)]
              text-[var(--text-primary)]
              hover:bg-[var(--ivory-50)] hover:border-[var(--sand-200)]
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
            "
          >
            빈 문서로 시작하기
          </button>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* 경쟁 우위 안내 */}
        <div className="mt-10 p-5 rounded-xl bg-gradient-to-br from-[var(--sage-50)] to-[var(--ivory-50)] border border-[var(--sage-100)]">
          <p className="text-sm text-[var(--sage-700)] text-center">
            Pinterest나 Instagram에서 마음에 든 청첩장 이미지를 찾으셨나요?<br />
            <span className="font-medium">링크나 이미지를 첨부하면 AI가 비슷한 스타일로 만들어드립니다.</span>
          </p>
        </div>
      </main>
    </div>
  )
}

// Icons
function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  )
}

function LoadingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth={4} />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  )
}
