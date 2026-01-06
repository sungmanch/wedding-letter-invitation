'use client'

/**
 * Request Preset Modal
 *
 * 프리셋 요청 입력 폼 모달
 * - 섹션 타입 (자동 표시)
 * - 설명 (필수)
 * - 참고 이미지 (선택, 최대 3장)
 * - 이메일 (로그인 시 자동 입력)
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ImagePlus,
  Check,
  Loader2,
  Clock,
} from 'lucide-react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  Button,
  Input,
  Textarea,
} from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import { submitPresetRequest } from '@/lib/actions/preset-request'
import { getBlockTypeLabel } from '@/lib/super-editor-v2/config/block-labels'

// ============================================
// Types
// ============================================

interface UploadedImage {
  id: string
  file: File
  previewUrl: string
}

interface RequestPresetModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 섹션/블록 타입 (SelectableSectionType 또는 BlockType 모두 지원) */
  sectionType: string | null
}

// ============================================
// Constants
// ============================================

const MAX_IMAGES = 3
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// ============================================
// Component
// ============================================

export function RequestPresetModal({
  open,
  onOpenChange,
  sectionType,
}: RequestPresetModalProps) {
  // 상태
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [images, setImages] = useState<UploadedImage[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // 로그인 상태 및 이메일 확인
  useEffect(() => {
    async function checkUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setIsLoggedIn(true)
        setEmail(user.email || '')
      } else {
        setIsLoggedIn(false)
        setEmail('')
      }
    }
    if (open) {
      checkUser()
    }
  }, [open])

  // 모달 닫힐 때 초기화 및 Object URL 정리
  useEffect(() => {
    if (!open) {
      // 약간의 지연 후 초기화 (애니메이션 완료 후)
      const timer = setTimeout(() => {
        // Object URL 메모리 해제
        images.forEach(img => URL.revokeObjectURL(img.previewUrl))
        setDescription('')
        setImages([])
        setError(null)
        setIsSuccess(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [open, images])

  // 이미지 업로드 핸들러
  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files) return

      const newImages: UploadedImage[] = []

      for (const file of Array.from(files)) {
        // 최대 개수 검증
        if (images.length + newImages.length >= MAX_IMAGES) {
          break
        }

        // 타입 검증
        if (!ALLOWED_TYPES.includes(file.type)) {
          continue
        }

        // 크기 검증
        if (file.size > MAX_FILE_SIZE) {
          continue
        }

        const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
        const previewUrl = URL.createObjectURL(file)

        newImages.push({ id, file, previewUrl })
      }

      setImages((prev) => [...prev, ...newImages])

      // input 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
    [images.length]
  )

  // 이미지 삭제
  const handleRemoveImage = useCallback((id: string) => {
    setImages((prev) => {
      const image = prev.find((img) => img.id === id)
      if (image) {
        URL.revokeObjectURL(image.previewUrl)
      }
      return prev.filter((img) => img.id !== id)
    })
  }, [])

  // 제출 핸들러
  const handleSubmit = useCallback(async () => {
    if (!sectionType) return

    // 유효성 검사
    if (!description || description.trim().length < 10) {
      setError('설명을 10자 이상 입력해주세요')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      setError('유효한 이메일을 입력해주세요')
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('sectionType', sectionType)
      formData.append('description', description)
      formData.append('email', email)

      // 이미지 추가
      for (const image of images) {
        formData.append('images', image.file)
      }

      const result = await submitPresetRequest(formData)

      if (result.success) {
        setIsSuccess(true)
      } else {
        setError(result.error || '요청에 실패했습니다')
      }
    } catch {
      setError('요청에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }, [sectionType, description, email, images])

  // 로그인 페이지로 이동
  const handleLogin = useCallback(() => {
    // 현재 페이지 URL을 저장하고 로그인 페이지로 이동
    window.location.href = '/auth/login?redirect=' + encodeURIComponent(window.location.pathname)
  }, [])

  if (!sectionType) return null

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-md">
        <ModalHeader>
          <ModalTitle className="flex items-center gap-2">
            원하는 프리셋 요청
          </ModalTitle>
        </ModalHeader>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            // 성공 화면
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-8 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--sage-100)] flex items-center justify-center">
                <Check className="w-8 h-8 text-[var(--sage-600)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                요청이 접수되었습니다!
              </h3>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                2~3일 안에 작업해서
                <br />
                결과를 알려드릴게요
              </p>
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-[var(--sage-500)] hover:bg-[var(--sage-600)] text-white"
              >
                확인
              </Button>
            </motion.div>
          ) : !isLoggedIn ? (
            // 비로그인 상태
            <motion.div
              key="login-required"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-8 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--sand-100)] flex items-center justify-center">
                <Clock className="w-8 h-8 text-[var(--text-muted)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                로그인이 필요합니다
              </h3>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                프리셋 요청을 위해
                <br />
                먼저 로그인해주세요
              </p>
              <Button
                onClick={handleLogin}
                className="bg-[var(--sage-500)] hover:bg-[var(--sage-600)] text-white"
              >
                로그인하기
              </Button>
            </motion.div>
          ) : (
            // 입력 폼
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* 섹션 정보 */}
              <div className="flex items-center gap-2 px-3 py-2 bg-[var(--sand-50)] rounded-lg">
                <span className="text-xs text-[var(--text-muted)]">섹션:</span>
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {getBlockTypeLabel(sectionType)}
                </span>
              </div>

              {/* 설명 */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--text-primary)]">
                  어떤 디자인을 원하시나요? <span className="text-red-500">*</span>
                </label>
                <Textarea
                  placeholder="예: 손글씨 느낌의 따뜻한 인사말, 세로로 긴 레이아웃..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px] resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-[var(--text-muted)] text-right">
                  {description.length}/500
                </p>
              </div>

              {/* 참고 이미지 */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--text-primary)]">
                  참고 이미지 <span className="text-[var(--text-muted)]">(선택, 최대 3장)</span>
                </label>
                <div className="flex gap-2 flex-wrap">
                  {/* 업로드된 이미지들 */}
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="relative w-20 h-20 rounded-lg overflow-hidden border border-[var(--sand-200)]"
                    >
                      <Image
                        src={image.previewUrl}
                        alt="참고 이미지"
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={() => handleRemoveImage(image.id)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}

                  {/* 업로드 버튼 */}
                  {images.length < MAX_IMAGES && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-20 h-20 rounded-lg border-2 border-dashed border-[var(--sand-300)] hover:border-[var(--sage-400)] hover:bg-[var(--sage-50)] transition-all flex flex-col items-center justify-center gap-1"
                    >
                      <ImagePlus className="w-5 h-5 text-[var(--text-muted)]" />
                      <span className="text-[10px] text-[var(--text-muted)]">추가</span>
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>

              {/* 이메일 */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--text-primary)]">
                  이메일 <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-xs text-[var(--text-muted)]">
                  결과를 알려드릴 이메일 주소입니다
                </p>
              </div>

              {/* 안내 문구 */}
              <div className="flex items-center gap-2 px-3 py-2 bg-[var(--sage-50)] rounded-lg">
                <Clock className="w-4 h-4 text-[var(--sage-600)] flex-shrink-0" />
                <span className="text-xs text-[var(--sage-700)]">
                  2~3일 안에 작업해서 결과를 알려드릴게요
                </span>
              </div>

              {/* 에러 메시지 */}
              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              {/* 제출 버튼 */}
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-[var(--sage-500)] hover:bg-[var(--sage-600)] text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    요청 중...
                  </>
                ) : (
                  '요청하기'
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </ModalContent>
    </Modal>
  )
}
