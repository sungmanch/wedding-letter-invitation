'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, X, Loader2, Check, ImageIcon, Link2, Upload, AlertCircle } from 'lucide-react'
import { Typewriter } from './Typewriter'
import type { User } from '@supabase/supabase-js'

// Typewriter example prompts (일반인 언어)
const TYPEWRITER_PROMPTS = [
  '럭셔리하고 고급스럽게 만들어줘',
  '사진이 예뻐서 사진 중심으로',
  '심플하게, 정보만 깔끔하게',
  '따뜻하고 감성적인 분위기로',
  '시네마틱하고 영화 같은 느낌으로',
]

// Storage keys for persisting data across login
const STORAGE_KEY_PROMPT = 'landing_prompt'
const STORAGE_KEY_REFERENCE = 'landing_reference'
const STORAGE_KEY_ANALYSIS = 'landing_analysis'

interface AnalysisResult {
  mood: string[]
  colors: string[]
  typography: string
  layout: string
  keywords: string[]
  summary: string
}

interface PromptHeroLandingProps {
  user: User | null
}

type ReferenceInputMode = 'url' | 'upload'
type AnalysisStatus = 'idle' | 'analyzing' | 'success' | 'error'

export function PromptHeroLanding({ user }: PromptHeroLandingProps) {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [isInputMode, setIsInputMode] = useState(false)
  const [referenceImage, setReferenceImage] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reference input states (se2/create 패턴)
  const [referenceInputMode, setReferenceInputMode] = useState<ReferenceInputMode>('url')
  const [urlInput, setUrlInput] = useState('')
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('idle')
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Restore from sessionStorage on mount (after login redirect)
  useEffect(() => {
    const savedPrompt = sessionStorage.getItem(STORAGE_KEY_PROMPT)
    const savedReference = sessionStorage.getItem(STORAGE_KEY_REFERENCE)
    const savedAnalysis = sessionStorage.getItem(STORAGE_KEY_ANALYSIS)

    if (savedPrompt) {
      setPrompt(savedPrompt)
      setIsInputMode(true)
      sessionStorage.removeItem(STORAGE_KEY_PROMPT)
    }
    if (savedReference) {
      setReferenceImage(savedReference)
      setReferenceInputMode('upload') // 이미지가 있으면 업로드 탭으로
      sessionStorage.removeItem(STORAGE_KEY_REFERENCE)
    }
    if (savedAnalysis) {
      try {
        setAnalysisResult(JSON.parse(savedAnalysis))
        setAnalysisStatus('success')
        sessionStorage.removeItem(STORAGE_KEY_ANALYSIS)
      } catch {
        // Ignore parse errors
      }
    }

    // Auto-generate if user is logged in and has saved data
    if (user && savedPrompt) {
      handleGenerate()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  // Handle input area click
  const handleInputAreaClick = useCallback(() => {
    setIsInputMode(true)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }, [])

  // Handle image upload
  const handleImageUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setAnalysisStatus('error')
      setAnalysisError('이미지 파일만 업로드 가능합니다')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setAnalysisStatus('error')
      setAnalysisError('파일 크기는 10MB 이하여야 합니다')
      return
    }

    setAnalysisStatus('analyzing')
    setAnalysisError(null)

    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = e.target?.result as string
      setReferenceImage(base64)

      try {
        const response = await fetch('/api/super-editor-v2/analyze-reference', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageData: base64 }),
        })

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || '분석에 실패했습니다')
        }

        setAnalysisStatus('success')
        setAnalysisResult(data.analysis)
      } catch (err) {
        setAnalysisStatus('error')
        setAnalysisError(err instanceof Error ? err.message : '분석에 실패했습니다')
        // Keep the image even if analysis fails
      }
    }
    reader.readAsDataURL(file)
  }, [])

  // URL 분석 함수
  const analyzeUrl = useCallback(async (urlToAnalyze: string) => {
    if (!urlToAnalyze.trim()) {
      setAnalysisStatus('idle')
      setAnalysisResult(null)
      return
    }

    // URL 유효성 검사
    try {
      new URL(urlToAnalyze)
    } catch {
      setAnalysisStatus('error')
      setAnalysisError('올바른 URL 형식이 아닙니다')
      return
    }

    setAnalysisStatus('analyzing')
    setAnalysisError(null)

    try {
      const response = await fetch('/api/super-editor-v2/analyze-reference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToAnalyze }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || '분석에 실패했습니다')
      }

      setAnalysisStatus('success')
      setAnalysisResult(data.analysis)
    } catch (err) {
      setAnalysisStatus('error')
      setAnalysisError(err instanceof Error ? err.message : '분석에 실패했습니다')
    }
  }, [])

  // URL 입력 핸들러 (debounce)
  const handleUrlChange = useCallback((value: string) => {
    setUrlInput(value)

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (!value.trim()) {
      setAnalysisStatus('idle')
      setAnalysisResult(null)
      setAnalysisError(null)
      return
    }

    debounceRef.current = setTimeout(() => {
      analyzeUrl(value)
    }, 800)
  }, [analyzeUrl])

  // Handle drag and drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file) {
        setReferenceInputMode('upload')
        handleImageUpload(file)
      }
    },
    [handleImageUpload]
  )

  // Clear reference
  const handleClearReference = useCallback(() => {
    setReferenceImage(null)
    setUrlInput('')
    setAnalysisResult(null)
    setAnalysisStatus('idle')
    setAnalysisError(null)
  }, [])

  // Generate invitation
  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('어떤 청첩장을 만들고 싶은지 설명해주세요')
      return
    }

    // If not logged in, save to storage and redirect to login
    if (!user) {
      sessionStorage.setItem(STORAGE_KEY_PROMPT, prompt)
      if (referenceImage) {
        sessionStorage.setItem(STORAGE_KEY_REFERENCE, referenceImage)
      }
      if (analysisResult) {
        sessionStorage.setItem(STORAGE_KEY_ANALYSIS, JSON.stringify(analysisResult))
      }
      router.push('/login?redirect=/')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/landing/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          referenceAnalysis: analysisResult,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || '생성에 실패했습니다')
      }

      // Redirect to edit page
      router.push(`/se2/${data.documentId}/edit`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '생성에 실패했습니다')
      setIsGenerating(false)
    }
  }, [prompt, user, referenceImage, analysisResult, router])

  // Handle Enter key
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleGenerate()
      }
    },
    [handleGenerate]
  )

  // Create from scratch (no AI)
  const handleCreateFromScratch = useCallback(async () => {
    if (!user) {
      router.push('/login?redirect=/')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/landing/create-blank', {
        method: 'POST',
      })
      const data = await response.json()

      if (data.success) {
        router.push(`/se2/${data.documentId}/edit`)
      } else {
        setError(data.error || '문서 생성에 실패했습니다')
        setIsGenerating(false)
      }
    } catch {
      setError('문서 생성에 실패했습니다')
      setIsGenerating(false)
    }
  }, [user, router])

  const hasValidInput = prompt.trim().length > 0

  return (
    <section className="relative bg-[var(--ivory-100)] overflow-hidden pt-16">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,var(--sage-100)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,var(--sand-100)_0%,transparent_50%)]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-4">
        {/* Hero Text */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight mb-3"
            style={{ fontFamily: 'Noto Serif KR, serif' }}
          >
            <span className="text-[var(--sage-600)] font-medium">원하는 느낌만</span>
            <span className="text-[var(--text-primary)] font-light"> 말하세요</span>
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-muted)]">AI가 바로 만들어드립니다</p>
        </div>

        {/* Prompt Input Area */}
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Main Input */}
          <div
            className={`
              relative bg-white rounded-2xl border-2 transition-all duration-200
              ${isInputMode ? 'border-[var(--sage-400)] shadow-lg ring-2 ring-[var(--sage-200)]' : 'border-[var(--sand-200)] shadow-md hover:border-[var(--sage-300)] hover:shadow-lg cursor-text'}
            `}
            onClick={!isInputMode ? handleInputAreaClick : undefined}
          >
            {isInputMode ? (
              // Input Mode
              <div className="p-4">
                <textarea
                  ref={inputRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="원하는 느낌을 자유롭게 적어주세요"
                  rows={2}
                  className="w-full resize-none bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-light)] focus:outline-none text-lg"
                  style={{ fontFamily: 'Noto Serif KR, serif' }}
                  disabled={isGenerating}
                />
                <div className="flex items-center justify-end mt-2">
                  <button
                    onClick={handleGenerate}
                    disabled={!hasValidInput || isGenerating}
                    className={`
                      flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200
                      ${
                        hasValidInput && !isGenerating
                          ? 'bg-[var(--sage-500)] text-white hover:bg-[var(--sage-600)] shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        생성 중...
                      </>
                    ) : (
                      <>
                        만들기
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              // Typewriter Mode
              <div className="p-5 flex items-center justify-between">
                <div className="flex-1">
                  <span className="text-[var(--sage-400)]">&ldquo;</span>
                  <Typewriter
                    texts={TYPEWRITER_PROMPTS}
                    className="text-lg sm:text-xl text-[var(--sage-700)]"
                    typingSpeed={80}
                    deletingSpeed={40}
                    pauseDuration={2000}
                    delayBetween={500}
                  />
                  <span className="text-[var(--sage-400)]">&rdquo;</span>
                </div>
                <button className="flex-shrink-0 p-3 rounded-xl bg-[var(--sage-500)] text-white hover:bg-[var(--sage-600)] transition-colors shadow-sm">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Reference Input Section - 항상 표시 */}
          <div className="bg-white/80 rounded-2xl border border-[var(--sand-200)] overflow-hidden">
            {/* Header with label */}
            <div className="px-4 pt-3 pb-2">
              <span className="text-sm text-[var(--text-primary)]">
                참고할 이미지나 URL이 있나요? <span className="text-[var(--text-light)]">(선택)</span>
              </span>
            </div>

            {/* Analysis Success - 분석 완료 시 결과 표시 */}
            {analysisStatus === 'success' && analysisResult ? (
              <div className="px-4 pb-4">
                <div className="bg-[var(--sage-50)] border border-[var(--sage-200)] rounded-xl p-3">
                  <div className="flex items-start gap-3">
                    {/* 썸네일 */}
                    {(referenceImage || urlInput) && (
                      <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-gray-100">
                        {referenceImage ? (
                          <img
                            src={referenceImage}
                            alt="Reference"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Link2 className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    )}

                    {/* 분석 결과 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Check className="w-3.5 h-3.5 text-[var(--sage-600)]" />
                        <span className="text-xs font-medium text-[var(--sage-700)]">분석 완료</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-1.5">
                        {analysisResult.keywords.slice(0, 4).map((keyword, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 text-xs bg-white border border-[var(--sage-200)] rounded-full text-[var(--sage-700)]"
                          >
                            #{keyword}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-[var(--text-muted)] line-clamp-1">
                        {analysisResult.summary}
                      </p>
                    </div>

                    {/* 삭제 버튼 */}
                    <button
                      onClick={handleClearReference}
                      className="flex-shrink-0 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-4 pb-4">
                {/* Mode Tabs - URL / 이미지 업로드 */}
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setReferenceInputMode('url')}
                    disabled={isGenerating}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      referenceInputMode === 'url'
                        ? 'bg-[var(--sage-100)] text-[var(--sage-700)]'
                        : 'text-[var(--text-muted)] hover:bg-gray-100'
                    }`}
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setReferenceInputMode('upload')}
                    disabled={isGenerating}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      referenceInputMode === 'upload'
                        ? 'bg-[var(--sage-100)] text-[var(--sage-700)]'
                        : 'text-[var(--text-muted)] hover:bg-gray-100'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    이미지 업로드
                  </button>
                </div>

                {/* URL Input */}
                {referenceInputMode === 'url' && (
                  <div className="relative">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      placeholder="Pinterest, Instagram, 또는 이미지 URL을 붙여넣으세요"
                      disabled={isGenerating}
                      className={`w-full px-4 py-3 pr-10 border rounded-xl text-sm transition-colors
                        ${analysisStatus === 'error' ? 'border-red-300 focus:ring-red-200' : 'border-[var(--sand-200)] focus:ring-[var(--sage-200)]'}
                        focus:outline-none focus:ring-2 focus:border-[var(--sage-400)]
                        disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                    {analysisStatus === 'analyzing' && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="w-4 h-4 animate-spin text-[var(--sage-500)]" />
                      </div>
                    )}
                  </div>
                )}

                {/* Image Upload */}
                {referenceInputMode === 'upload' && (
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => !isGenerating && fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-colors ${
                      isGenerating
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        : analysisStatus === 'analyzing'
                        ? 'border-[var(--sage-300)] bg-[var(--sage-50)]'
                        : 'border-[var(--sand-200)] hover:border-[var(--sage-300)] hover:bg-[var(--sage-50)]/50 cursor-pointer'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file)
                      }}
                      className="hidden"
                      disabled={isGenerating}
                    />

                    {analysisStatus === 'analyzing' ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-[var(--sage-500)]" />
                        <span className="text-sm text-[var(--sage-600)]">이미지 분석 중...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <ImageIcon className="w-6 h-6 text-[var(--text-light)]" />
                        <span className="text-sm text-[var(--text-muted)]">
                          클릭하거나 이미지를 드래그하세요
                        </span>
                        <span className="text-xs text-[var(--text-light)]">
                          JPG, PNG, WebP (최대 10MB)
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Error Message for Analysis */}
                {analysisStatus === 'error' && analysisError && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{analysisError}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-6 text-sm text-[var(--text-light)] pt-1">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              카드 등록 없이 무료 체험
            </span>
          </div>

          {/* Create from scratch option */}
          <div className="text-center pt-3">
            <span className="text-[var(--text-light)] text-sm">또는</span>
            <button
              onClick={handleCreateFromScratch}
              disabled={isGenerating}
              className="ml-2 text-sm text-[var(--sage-600)] hover:text-[var(--sage-700)] underline underline-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              처음부터 내가 만들기 →
            </button>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-[var(--ivory-100)]/95 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--sage-100)] flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--sage-600)]" />
            </div>
            <h2 className="text-xl font-medium text-[var(--text-primary)] mb-2" style={{ fontFamily: 'Noto Serif KR, serif' }}>
              청첩장 만드는 중...
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              &ldquo;{prompt.slice(0, 30)}{prompt.length > 30 ? '...' : ''}&rdquo;를 반영하고 있습니다
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
