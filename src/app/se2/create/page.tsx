'use client'

/**
 * Super Editor v2 - Create Page
 *
 * AI 프롬프트를 통해 새로운 청첩장 레이아웃 생성
 */

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createDocument } from '@/lib/super-editor-v2/actions/document'

export default function SE2CreatePage() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 빈 문서로 시작
  const handleCreateEmpty = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const document = await createDocument({
        title: '새 청첩장',
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
      setError('프롬프트를 입력해주세요')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // 먼저 빈 문서 생성
      const document = await createDocument({
        title: prompt.slice(0, 50),
      })

      // AI API 호출하여 블록 생성
      const response = await fetch('/api/super-editor-v2/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: document.id,
          prompt: `새 청첩장을 만들어주세요: ${prompt}`,
          action: 'generate',
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
  }, [prompt, router])

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#F5E6D3]">
      {/* 헤더 */}
      <header className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Super Editor v2</h1>
          <span className="text-xs px-2 py-1 bg-[#C9A962]/20 text-[#C9A962] rounded">
            TEST
          </span>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">새 청첩장 만들기</h2>
          <p className="text-[#F5E6D3]/60">
            AI에게 원하는 스타일을 설명하거나, 빈 문서로 시작하세요
          </p>
        </div>

        {/* 프롬프트 입력 */}
        <div className="space-y-4 mb-8">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="예: 봄 느낌의 핑크톤 청첩장, 사진을 크게 보여주고 심플하게"
            disabled={isLoading}
            rows={4}
            className="
              w-full px-4 py-3 rounded-xl
              bg-white/5 border border-white/10
              text-[#F5E6D3] placeholder:text-[#F5E6D3]/40
              focus:ring-2 focus:ring-[#C9A962]/50 focus:border-[#C9A962]/30 focus:outline-none
              disabled:opacity-50 disabled:cursor-not-allowed
              resize-none
            "
          />

          <button
            onClick={handleCreateWithAI}
            disabled={isLoading || !prompt.trim()}
            className="
              w-full py-3 rounded-xl font-medium
              bg-[#C9A962] text-[#1a1a1a]
              hover:bg-[#C9A962]/90
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
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
        </div>

        {/* 구분선 */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 border-t border-white/10" />
          <span className="text-sm text-[#F5E6D3]/40">또는</span>
          <div className="flex-1 border-t border-white/10" />
        </div>

        {/* 빈 문서로 시작 */}
        <button
          onClick={handleCreateEmpty}
          disabled={isLoading}
          className="
            w-full py-3 rounded-xl font-medium
            bg-white/5 border border-white/10
            text-[#F5E6D3]
            hover:bg-white/10
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
          "
        >
          빈 문서로 시작하기
        </button>

        {/* 에러 메시지 */}
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        {/* 안내 */}
        <div className="mt-12 p-6 rounded-xl bg-white/5 border border-white/10">
          <h3 className="font-medium mb-3">💡 프롬프트 팁</h3>
          <ul className="space-y-2 text-sm text-[#F5E6D3]/60">
            <li>• 원하는 분위기: "모던한", "클래식한", "화사한"</li>
            <li>• 색상 톤: "파스텔 핑크", "골드 포인트", "모노톤"</li>
            <li>• 레이아웃: "사진 중심", "텍스트 중심", "심플하게"</li>
            <li>• 특별한 섹션: "타임라인 포함", "갤러리 많이"</li>
          </ul>
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
