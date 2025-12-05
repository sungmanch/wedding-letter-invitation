'use client'

/**
 * Super Editor - Create Page
 * 새 청첩장 생성 (토큰/스켈레톤 시스템 사용)
 */

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { generateQuickTemplate } from '@/lib/super-editor/services'
import { TokenStyleProvider } from '@/lib/super-editor/context'
import { InvitationRenderer } from '@/lib/super-editor/renderers'
import type { GenerationResult } from '@/lib/super-editor/services'
import { createDefaultStyle, DEFAULT_USER_DATA } from './default-style'

// 예시 프롬프트
const EXAMPLE_PROMPTS = [
  '모던하고 미니멀한',
  '따뜻하고 로맨틱한',
  '우아하고 클래식한',
  '봄꽃이 가득한',
  '영화같은 감성',
]

// 분위기 태그
const MOOD_TAGS = [
  { id: 'romantic', label: '로맨틱', emoji: '💕' },
  { id: 'elegant', label: '우아한', emoji: '✨' },
  { id: 'minimal', label: '미니멀', emoji: '⬜' },
  { id: 'modern', label: '모던', emoji: '🔷' },
  { id: 'warm', label: '따뜻한', emoji: '🧡' },
  { id: 'playful', label: '발랄한', emoji: '🎈' },
]

type GenerationStatus = 'idle' | 'generating' | 'success' | 'error'

export default function SuperEditorCreatePage() {
  const router = useRouter()

  // 입력 상태
  const [prompt, setPrompt] = useState('')
  const [selectedMoods, setSelectedMoods] = useState<string[]>([])

  // 생성 상태
  const [status, setStatus] = useState<GenerationStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<GenerationResult | null>(null)

  // 분위기 태그 토글
  const toggleMood = (moodId: string) => {
    setSelectedMoods(prev =>
      prev.includes(moodId)
        ? prev.filter(m => m !== moodId)
        : [...prev, moodId]
    )
  }

  // 예시 프롬프트 클릭
  const handleExampleClick = (example: string) => {
    setPrompt(prev => prev ? `${prev}, ${example}` : example)
  }

  // 빠른 생성 (AI 없이)
  const handleQuickGenerate = useCallback(() => {
    setStatus('generating')
    setError(null)

    try {
      const defaultStyle = createDefaultStyle()
      const generatedResult = generateQuickTemplate(defaultStyle)
      setResult(generatedResult)
      setStatus('success')
    } catch (err) {
      console.error('Quick generation failed:', err)
      setError('생성에 실패했습니다')
      setStatus('error')
    }
  }, [])

  // AI 생성 (TODO: AIProvider 연동)
  const handleAIGenerate = useCallback(async () => {
    if (!prompt.trim() && selectedMoods.length === 0) {
      setError('스타일을 설명하거나 분위기를 선택해주세요')
      return
    }

    setStatus('generating')
    setError(null)

    try {
      // 분위기에 따른 색상 선택
      const primaryColor = selectedMoods.includes('romantic') ? '#E91E63'
        : selectedMoods.includes('modern') ? '#3B82F6'
        : selectedMoods.includes('warm') ? '#F59E0B'
        : selectedMoods.includes('elegant') ? '#8B5CF6'
        : '#E91E63'

      const headingFont = selectedMoods.includes('elegant') || selectedMoods.includes('romantic')
        ? '"Noto Serif KR", serif'
        : '"Pretendard", sans-serif'

      const customStyle = createDefaultStyle({
        name: prompt || selectedMoods.join(', '),
        primaryColor,
        headingFont,
        mood: selectedMoods,
      })

      const generatedResult = generateQuickTemplate(customStyle)
      setResult(generatedResult)
      setStatus('success')
    } catch (err) {
      console.error('AI generation failed:', err)
      setError('AI 생성에 실패했습니다')
      setStatus('error')
    }
  }, [prompt, selectedMoods])

  // 다시 생성
  const handleRegenerate = () => {
    setResult(null)
    setStatus('idle')
  }

  // 저장 및 편집으로 이동
  const handleSaveAndEdit = async () => {
    if (!result) return

    // TODO: DB에 저장 후 편집 페이지로 이동
    // 현재는 콘솔에 출력
    console.log('Generated result:', result)
    alert('저장 기능은 준비 중입니다.\n\n콘솔에서 생성 결과를 확인하세요.')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">새 청첩장 만들기</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            취소
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 왼쪽: 입력 패널 */}
          <div className="space-y-6">
            {/* 프롬프트 입력 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                어떤 스타일의 청첩장을 만들까요?
              </h2>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="원하는 분위기를 자유롭게 설명해주세요..."
                className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                disabled={status === 'generating'}
              />

              {/* 예시 프롬프트 */}
              <div className="mt-3 flex flex-wrap gap-2">
                {EXAMPLE_PROMPTS.map((example) => (
                  <button
                    key={example}
                    onClick={() => handleExampleClick(example)}
                    className="px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                    disabled={status === 'generating'}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {/* 분위기 선택 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                분위기 선택
              </h2>

              <div className="grid grid-cols-3 gap-3">
                {MOOD_TAGS.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => toggleMood(mood.id)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      selectedMoods.includes(mood.id)
                        ? 'border-rose-500 bg-rose-50 text-rose-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                    disabled={status === 'generating'}
                  >
                    <span>{mood.emoji}</span>
                    <span className="font-medium">{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            )}

            {/* 버튼 */}
            <div className="flex gap-3">
              <button
                onClick={handleQuickGenerate}
                disabled={status === 'generating'}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 transition-colors"
              >
                빠른 생성
              </button>
              <button
                onClick={handleAIGenerate}
                disabled={status === 'generating'}
                className="flex-1 px-6 py-3 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 disabled:opacity-50 transition-colors"
              >
                {status === 'generating' ? '생성 중...' : 'AI로 생성'}
              </button>
            </div>
          </div>

          {/* 오른쪽: 프리뷰 패널 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">미리보기</h2>
              {result && (
                <div className="flex gap-2">
                  <button
                    onClick={handleRegenerate}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                  >
                    다시 생성
                  </button>
                  <button
                    onClick={handleSaveAndEdit}
                    className="px-4 py-1.5 text-sm bg-rose-500 text-white rounded-lg hover:bg-rose-600"
                  >
                    이 디자인으로 시작
                  </button>
                </div>
              )}
            </div>

            {/* 프리뷰 영역 */}
            <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4 min-h-[600px]">
              {status === 'generating' ? (
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">청첩장을 생성하고 있습니다...</p>
                  <p className="text-sm text-gray-400 mt-2">잠시만 기다려주세요</p>
                </div>
              ) : result ? (
                <div className="relative bg-black rounded-[2.5rem] p-2 shadow-xl">
                  {/* 노치 */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-xl z-10" />
                  {/* 스크린 */}
                  <div
                    className="bg-white rounded-[2rem] overflow-hidden overflow-y-auto"
                    style={{ width: 320, height: 580 }}
                  >
                    <TokenStyleProvider style={result.style}>
                      <InvitationRenderer
                        layout={result.layout}
                        style={result.style}
                        userData={DEFAULT_USER_DATA}
                        mode="preview"
                      />
                    </TokenStyleProvider>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="font-medium">스타일을 선택하고</p>
                  <p className="font-medium">생성 버튼을 눌러주세요</p>
                </div>
              )}
            </div>

            {/* 생성 정보 */}
            {result && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>섹션 수</span>
                  <span>{result.screens.length}개</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>CSS Variables</span>
                  <span>{result.cssVariables.split('\n').length}개</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
