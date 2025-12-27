'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowRight, X, Loader2, Check, ImageIcon, Link2, Upload, AlertCircle, Sparkles } from 'lucide-react'
import { Typewriter } from './Typewriter'
import type { User } from '@supabase/supabase-js'

// --- Constants ---

const TYPEWRITER_PROMPTS = [
  '미니멀하고 우아한 흰색 배경 청첩장이 필요해요',
  '스튜디오에서 찍은 즐거운 포즈 사진으로 세로형 카드 레이아웃 청첩장을 만들고 싶어요',
  '전체 배경 이미지 위에 깔끔한 오버레이를 사용한 미니멀 청첩장을 원해요',
  '영화 같은 분위기의 다크톤 배경에 핑크 강조색이 있는 청첩장이 필요해요',
  '블루 컬러를 사용한 밝고 즐거운 느낌의 청첩장이 필요해요',
  '흑백 사진에 딥핑크 강조색으로 볼드하고 세련된 청첩장을 만들고 싶어요',
]

const TEMPLATE_IMAGES = [
  '/examples/unique1.png',
  '/examples/unique2.png',
  '/examples/unique3.png',
  '/examples/unique4.png',
  '/examples/unique5.png',
  '/examples/unique6.png',
]

const STORAGE_KEY_PROMPT = 'landing_prompt'
const STORAGE_KEY_REFERENCE = 'landing_reference'
const STORAGE_KEY_ANALYSIS = 'landing_analysis'

// --- Types ---

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

// --- Component ---

export function PromptHeroLanding({ user }: PromptHeroLandingProps) {
  const router = useRouter()
  
  // State
  const [prompt, setPrompt] = useState('')
  const [isInputMode, setIsInputMode] = useState(false)
  const [referenceImage, setReferenceImage] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  
  // Loading & Error
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reference Input Logic
  const [referenceInputMode, setReferenceInputMode] = useState<ReferenceInputMode>('url')
  const [urlInput, setUrlInput] = useState('')
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('idle')
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [showReferenceInput, setShowReferenceInput] = useState(false)

  // Refs
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const autoGenerateTriggeredRef = useRef(false)

  // --- Effects ---

  // Initialization
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
      setShowReferenceInput(true)
      setReferenceInputMode('upload')
      sessionStorage.removeItem(STORAGE_KEY_REFERENCE)
    }
    if (savedAnalysis) {
      try {
        setAnalysisResult(JSON.parse(savedAnalysis))
        setAnalysisStatus('success')
        setShowReferenceInput(true)
        sessionStorage.removeItem(STORAGE_KEY_ANALYSIS)
      } catch { }
    }

    if (user && savedPrompt && !autoGenerateTriggeredRef.current) {
      autoGenerateTriggeredRef.current = true
      handleGenerate()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  // --- Handlers ---

  const handleInputAreaClick = useCallback(() => {
    setIsInputMode(true)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }, [])

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
          if (!data.success) throw new Error(data.error || '분석에 실패했습니다')
  
          setAnalysisStatus('success')
          setAnalysisResult(data.analysis)
        } catch (err) {
          setAnalysisStatus('error')
          setAnalysisError(err instanceof Error ? err.message : '분석에 실패했습니다')
        }
      }
      reader.readAsDataURL(file)
  }, [])

  const analyzeUrl = useCallback(async (urlToAnalyze: string) => {
    if (!urlToAnalyze.trim()) {
        setAnalysisStatus('idle')
        setAnalysisResult(null)
        return
    }
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
        if (!data.success) throw new Error(data.error || '분석에 실패했습니다')
        setAnalysisStatus('success')
        setAnalysisResult(data.analysis)
    } catch (err) {
        setAnalysisStatus('error')
        setAnalysisError(err instanceof Error ? err.message : '분석에 실패했습니다')
    }
  }, [])

  const handleUrlChange = useCallback((value: string) => {
     setUrlInput(value)
     if (debounceRef.current) clearTimeout(debounceRef.current)
    
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

  const handleDrop = useCallback((e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file) {
        setReferenceInputMode('upload')
        handleImageUpload(file)
      }
  }, [handleImageUpload])

  const handleClearReference = useCallback(() => {
    setReferenceImage(null)
    setUrlInput('')
    setAnalysisResult(null)
    setAnalysisStatus('idle')
    setAnalysisError(null)
    setShowReferenceInput(false)
  }, [])

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('어떤 청첩장을 만들고 싶은지 설명해주세요')
      return
    }
    if (!user) {
      sessionStorage.setItem(STORAGE_KEY_PROMPT, prompt)
      if (referenceImage) sessionStorage.setItem(STORAGE_KEY_REFERENCE, referenceImage)
      if (analysisResult) sessionStorage.setItem(STORAGE_KEY_ANALYSIS, JSON.stringify(analysisResult))
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
      if (!data.success) throw new Error(data.error || '생성에 실패했습니다')
      router.push(`/se2/${data.documentId}/edit`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '생성에 실패했습니다')
      setIsGenerating(false)
    }
  }, [prompt, user, referenceImage, analysisResult, router])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleGenerate()
      }
  }, [handleGenerate])

  const handleCreateFromScratch = useCallback(async () => {
    if (!user) {
        router.push('/login?redirect=/')
        return
    }
    setIsGenerating(true)
    try {
        const response = await fetch('/api/landing/create-blank', { method: 'POST' })
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
    <section className="relative h-[800px] sm:h-[900px] flex items-center justify-center overflow-hidden bg-[#faf8f5]">
      {/* 
        Background: Multiple Marquee Rows 
        We use 3 rows moving at different speeds/directions to create a rich collage effect.
      */}
      <div className="absolute inset-0 z-0 overflow-hidden flex flex-col justify-center gap-6 opacity-60 grayscale-[30%]">
        {/* Row 1: Move Left */}
        <div className="flex gap-6 animate-marquee">
           {[...TEMPLATE_IMAGES, ...TEMPLATE_IMAGES].map((src, i) => (
              <div key={`r1-${i}`} className="relative w-[240px] aspect-[9/16] rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                  <Image src={src} alt="Template" fill className="object-cover" sizes="240px"/>
              </div>
           ))}
        </div>
        {/* Row 2: Move Right (slower) */}
        <div className="flex gap-6 animate-marquee-reverse">
            {[...TEMPLATE_IMAGES, ...TEMPLATE_IMAGES].reverse().map((src, i) => (
              <div key={`r2-${i}`} className="relative w-[240px] aspect-[9/16] rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                  <Image src={src} alt="Template" fill className="object-cover" sizes="240px"/>
              </div>
           ))}
        </div>
      </div>

       {/* Overlay Gradient for focus */}
       <div className="absolute inset-0 z-0 bg-white/70 backdrop-blur-[2px]" />
       <div className="absolute inset-0 z-0 bg-gradient-to-b from-white via-white/40 to-white/90" />

      {/* Main Glassmorphism Overlay */}
      <div className="relative z-10 w-full max-w-5xl px-4 flex flex-col items-center">
        {/* Title */}
        <div className="text-center mb-10 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-4 drop-shadow-sm font-['Pretendard']">
                결혼식의 설렘, <br className="sm:hidden"/> <span className="text-[var(--sage-600)]">상상하는 대로</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 font-medium font-['Pretendard'] max-w-3xl mx-auto break-keep">
                원하는 분위기를 말하면 AI가 세상에 단 하나뿐인 청첩장을 만들어드립니다
            </p>
        </div>

        {/* Input Card Container */}
        <div className="w-full bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-[0_30px_60px_-12px_rgba(0,0,0,0.12)] p-2 sm:p-4 overflow-hidden transition-all duration-300 transform hover:shadow-[0_35px_70px_-15px_rgba(0,0,0,0.15)] ring-1 ring-black/5">
            
            {/* 1. Prompt Input Area */}
            <div 
                className={`relative rounded-2xl bg-white border transition-all duration-200 ${isInputMode ? 'border-[var(--sage-400)] ring-4 ring-[var(--sage-100)]' : 'border-gray-100'}`}
                onClick={!isInputMode ? handleInputAreaClick : undefined}
            >
                {isInputMode ? (
                  <div className="p-4 sm:p-5">
                    <textarea
                      ref={inputRef}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="예: 5월의 따뜻한 햇살 같은 분위기에 핑크색 리본 장식이 있는 러블리한 청첩장 만들어줘"
                      rows={3}
                      className="w-full resize-none bg-transparent text-gray-800 placeholder:text-gray-400 focus:outline-none text-lg leading-relaxed font-['Pretendard']"
                      disabled={isGenerating}
                    />
                    
                    {/* Toolbar Row */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        {/* Reference Button */}
                        <button 
                            onClick={(e) => { e.stopPropagation(); setShowReferenceInput(!showReferenceInput); }}
                            className={`flex items-center gap-2 text-sm font-medium transition-all ${showReferenceInput ? 'text-[var(--sage-700)] bg-[var(--sage-100)] px-3 py-1.5 rounded-lg' : 'text-gray-500 hover:text-[var(--sage-600)] hover:bg-gray-50 px-2'}`}
                        >
                            {showReferenceInput ? <Check className="w-4 h-4"/> : <ImageIcon className="w-4 h-4"/>}
                            참고 이미지
                        </button>

                        <button
                            onClick={(e) => { e.stopPropagation(); handleGenerate(); }}
                            disabled={!hasValidInput || isGenerating}
                            className={`
                              flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all duration-200
                              ${hasValidInput && !isGenerating
                                ? 'bg-[var(--sage-600)] text-white shadow-lg hover:bg-[var(--sage-700)] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
                                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
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
                                <Sparkles className="w-4 h-4" />
                                무료로 생성하기
                              </>
                            )}
                        </button>
                    </div>
                  </div>
                ) : (
                    // Typewriter / Placeholder Mode
                    <div className="p-8 cursor-text min-h-[160px] flex flex-col justify-center items-center text-center gap-5">
                        <Typewriter
                            texts={TYPEWRITER_PROMPTS}
                            className="text-xl sm:text-2xl text-gray-400 font-medium font-['Pretendard']"
                            typingSpeed={40}
                            deletingSpeed={10}
                            pauseDuration={2000}
                            delayBetween={500}
                        />
                        <div className="animate-pulse">
                             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 text-xs font-semibold text-gray-400 border border-gray-100">
                                👆 여기를 눌러서 시작해보세요
                             </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 2. Reference Input Area (Expandable) */}
             <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${showReferenceInput ? 'max-h-[400px] opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'}`}
             >
                <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
                    {/* Existing reference logic */}
                    {analysisStatus === 'success' && analysisResult ? (
                        <div className="flex items-start gap-4 bg-white p-4 rounded-xl border border-[var(--sage-200)] shadow-sm">
                            {(referenceImage || urlInput) && (
                                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 shadow-inner">
                                    {referenceImage ? (
                                        <img src={referenceImage} className="w-full h-full object-cover" alt="ref" />
                                    ) : <div className="flex items-center justify-center h-full"><Link2 className="text-gray-400"/></div>}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-[var(--sage-700)] flex items-center gap-1.5 mb-1">
                                    <Check className="w-4 h-4 bg-[var(--sage-100)] rounded-full p-0.5"/> 스타일 분석 완료
                                </div>
                                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{analysisResult.summary}</p>
                                <div className="flex gap-2 mt-2">
                                    {analysisResult.keywords.slice(0,3).map((k,i)=>(
                                        <span key={i} className="px-2 py-0.5 bg-[var(--sage-50)] text-[var(--sage-600)] text-[10px] rounded-full border border-[var(--sage-100)]">#{k}</span>
                                    ))}
                                </div>
                            </div>
                            <button onClick={handleClearReference} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-4 h-4 text-gray-400"/>
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-6 text-center hover:border-[var(--sage-300)] hover:bg-[var(--sage-50)]/50 transition-all cursor-pointer group"
                             onDrop={handleDrop}
                             onDragOver={(e) => e.preventDefault()}
                        >
                            <div className="flex justify-center gap-3 mb-4">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setReferenceInputMode('url'); }}
                                    className={`text-sm font-medium px-4 py-1.5 rounded-full transition-all ${referenceInputMode === 'url' ? 'bg-[var(--sage-100)] text-[var(--sage-700)] shadow-sm' : 'text-gray-400 hover:bg-gray-100'}`}
                                >
                                    URL 링크
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setReferenceInputMode('upload'); }}
                                    className={`text-sm font-medium px-4 py-1.5 rounded-full transition-all ${referenceInputMode === 'upload' ? 'bg-[var(--sage-100)] text-[var(--sage-700)] shadow-sm' : 'text-gray-400 hover:bg-gray-100'}`}
                                >
                                    파일 업로드
                                </button>
                            </div>

                            {referenceInputMode === 'url' ? (
                                <div onClick={e => e.stopPropagation()} className="max-w-md mx-auto">
                                    <input
                                        type="url"
                                        value={urlInput}
                                        onChange={(e) => handleUrlChange(e.target.value)}
                                        placeholder="이미지 주소를 붙여넣어주세요"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[var(--sage-400)] focus:ring-2 focus:ring-[var(--sage-100)] transition-all bg-gray-50 focus:bg-white"
                                    />
                                </div>
                            ) : (
                                <div onClick={() => fileInputRef.current?.click()} className="py-2">
                                    <div className="w-12 h-12 bg-[var(--sage-50)] text-[var(--sage-400)] rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                        <Upload className="w-6 h-6"/>
                                    </div>
                                    <p className="text-sm font-medium text-gray-600">
                                        클릭하여 이미지 찾기
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">또는 파일을 여기로 드래그하세요</p>
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                                </div>
                            )}
                            
                            {analysisStatus === 'analyzing' && <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[var(--sage-600)] font-medium"><Loader2 className="w-4 h-4 animate-spin"/> 스타일 분석 중입니다...</div>}
                            {analysisStatus === 'error' && <p className="text-xs text-red-500 mt-3 bg-red-50 py-1 px-2 rounded-lg inline-block">{analysisError}</p>}
                        </div>
                    )}
                </div>
             </div>
        </div>

        {/* Error Display */}
        {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm text-center shadow-lg animate-fade-in-up">
                <AlertCircle className="w-4 h-4 inline mr-1"/> {error}
            </div>
        )}

        {/* Create from Scratch Button */}
        <div className="mt-8 text-center animate-fade-in-up delay-100">
           <button onClick={handleCreateFromScratch} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors px-4 py-2 hover:bg-white/50 rounded-full">
                <span>AI 도움 없이 직접 만들기</span> 
                <ArrowRight className="w-3.5 h-3.5" />
           </button>
        </div>
      </div>
      
       {/* Styles for Marquee Animation */}
       <style jsx global>{`
        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
        }
        .animate-marquee {
            animation: marquee 40s linear infinite;
        }
        .animate-marquee-reverse {
            animation: marquee-reverse 50s linear infinite;
        }
      `}</style>
      
       {/* Full Screen Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-[var(--sage-50)] rounded-full flex items-center justify-center mb-6 animate-bounce">
               <Sparkles className="w-10 h-10 text-[var(--sage-500)]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 font-['Pretendard']">청첩장을 디자인하고 있습니다</h2>
            <p className="text-gray-500">AI가 당신의 상상을 그리고 있어요...</p>
        </div>
      )}
    </section>
  )
}
