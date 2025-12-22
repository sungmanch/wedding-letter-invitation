'use client'

import { useState, useCallback, useRef } from 'react'
import { Link2, Upload, X, Loader2, Check, AlertCircle } from 'lucide-react'

// ============================================
// Types
// ============================================

export interface AnalysisResult {
  mood: string[]
  colors: string[]
  typography: string
  layout: string
  keywords: string[]
  summary: string
}

export interface ReferenceInputProps {
  onAnalysisComplete: (result: AnalysisResult | null) => void
  className?: string
}

type InputMode = 'url' | 'upload'
type AnalysisStatus = 'idle' | 'analyzing' | 'success' | 'error'

// ============================================
// Component
// ============================================

export function ReferenceInput({ onAnalysisComplete, className = '' }: ReferenceInputProps) {
  const [inputMode, setInputMode] = useState<InputMode>('url')
  const [url, setUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [status, setStatus] = useState<AnalysisStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // URL 분석 (debounced)
  const analyzeUrl = useCallback(async (urlToAnalyze: string) => {
    if (!urlToAnalyze.trim()) {
      setStatus('idle')
      setAnalysis(null)
      onAnalysisComplete(null)
      return
    }

    // URL 유효성 검사
    try {
      new URL(urlToAnalyze)
    } catch {
      setStatus('error')
      setError('올바른 URL 형식이 아닙니다')
      return
    }

    setStatus('analyzing')
    setError(null)

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

      setStatus('success')
      setAnalysis(data.analysis)
      onAnalysisComplete(data.analysis)
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : '분석에 실패했습니다')
      onAnalysisComplete(null)
    }
  }, [onAnalysisComplete])

  // URL 입력 핸들러 (debounce)
  const handleUrlChange = useCallback((value: string) => {
    setUrl(value)

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (!value.trim()) {
      setStatus('idle')
      setAnalysis(null)
      onAnalysisComplete(null)
      return
    }

    debounceRef.current = setTimeout(() => {
      analyzeUrl(value)
    }, 800)
  }, [analyzeUrl, onAnalysisComplete])

  // 이미지 업로드 핸들러
  const handleImageUpload = useCallback(async (file: File) => {
    // 이미지 타입 검증
    if (!file.type.startsWith('image/')) {
      setStatus('error')
      setError('이미지 파일만 업로드 가능합니다')
      return
    }

    // 파일 크기 제한 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setStatus('error')
      setError('파일 크기는 10MB 이하여야 합니다')
      return
    }

    setImageFile(file)
    setStatus('analyzing')
    setError(null)

    // 미리보기 생성
    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = e.target?.result as string
      setImagePreview(base64)

      // API 호출
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

        setStatus('success')
        setAnalysis(data.analysis)
        onAnalysisComplete(data.analysis)
      } catch (err) {
        setStatus('error')
        setError(err instanceof Error ? err.message : '분석에 실패했습니다')
        onAnalysisComplete(null)
      }
    }
    reader.readAsDataURL(file)
  }, [onAnalysisComplete])

  // 드래그 앤 드롭 핸들러
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      setInputMode('upload')
      handleImageUpload(file)
    }
  }, [handleImageUpload])

  // 초기화
  const handleClear = useCallback(() => {
    setUrl('')
    setImageFile(null)
    setImagePreview(null)
    setStatus('idle')
    setError(null)
    setAnalysis(null)
    onAnalysisComplete(null)
  }, [onAnalysisComplete])

  // 분석 성공 시 결과 표시
  if (status === 'success' && analysis) {
    return (
      <div className={`${className}`}>
        <div className="bg-sage-50 border border-sage-200 rounded-xl p-4">
          <div className="flex items-start gap-4">
            {/* 썸네일 */}
            {(imagePreview || url) && (
              <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Reference"
                    className="w-full h-full object-cover"
                  />
                ) : url ? (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Link2 size={24} />
                  </div>
                ) : null}
              </div>
            )}

            {/* 분석 결과 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Check size={16} className="text-sage-600" />
                <span className="text-sm font-medium text-sage-700">분석 완료</span>
              </div>

              {/* 키워드 태그 */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {analysis.keywords.slice(0, 5).map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-xs bg-white border border-sage-200 rounded-full text-sage-700"
                  >
                    #{keyword}
                  </span>
                ))}
              </div>

              {/* 요약 */}
              <p className="text-sm text-gray-600 line-clamp-2">
                {analysis.summary}
              </p>
            </div>

            {/* 삭제 버튼 */}
            <button
              onClick={handleClear}
              className="flex-shrink-0 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      {/* 모드 탭 */}
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setInputMode('url')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors ${
            inputMode === 'url'
              ? 'bg-sage-100 text-sage-700'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <Link2 size={14} />
          URL
        </button>
        <button
          type="button"
          onClick={() => setInputMode('upload')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors ${
            inputMode === 'upload'
              ? 'bg-sage-100 text-sage-700'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <Upload size={14} />
          이미지 업로드
        </button>
      </div>

      {/* URL 입력 */}
      {inputMode === 'url' && (
        <div className="relative">
          <input
            type="url"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="Pinterest, Instagram, 또는 이미지 URL을 붙여넣으세요"
            className={`w-full px-4 py-3 pr-10 border rounded-xl text-sm transition-colors
              ${status === 'error' ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-sage-200'}
              focus:outline-none focus:ring-2`}
          />
          {status === 'analyzing' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 size={18} className="animate-spin text-sage-500" />
            </div>
          )}
        </div>
      )}

      {/* 이미지 업로드 */}
      {inputMode === 'upload' && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer
            ${status === 'analyzing' ? 'border-sage-300 bg-sage-50' : 'border-gray-200 hover:border-sage-300 hover:bg-sage-50/50'}`}
          onClick={() => fileInputRef.current?.click()}
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
          />

          {status === 'analyzing' ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={24} className="animate-spin text-sage-500" />
              <span className="text-sm text-sage-600">이미지 분석 중...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload size={24} className="text-gray-400" />
              <span className="text-sm text-gray-500">
                클릭하거나 이미지를 드래그하세요
              </span>
              <span className="text-xs text-gray-400">
                JPG, PNG, WebP (최대 10MB)
              </span>
            </div>
          )}
        </div>
      )}

      {/* 에러 메시지 */}
      {status === 'error' && error && (
        <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
