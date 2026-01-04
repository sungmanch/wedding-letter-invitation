'use client'

/**
 * Paper Invitation Modal
 *
 * 종이 청첩장과 똑같이 만들기 서비스 신청 모달
 * 3단계 플로우:
 * 1. 이미지 업로드 (최대 10장)
 * 2. 메인 사진 선택
 * 3. 연락처 입력 및 신청 확인 (4일 소요 안내)
 */

import { useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Check,
  ImagePlus,
  Clock,
  ChevronLeft,
  ChevronRight,
  Star,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  Button,
  Input,
  ProgressBar,
} from '@/components/ui'
import { submitPaperInvitationRequest } from '@/lib/actions/paper-invitation'

// ============================================
// Types
// ============================================

interface UploadedImage {
  id: string
  file: File
  previewUrl: string
}

interface PaperInvitationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// ============================================
// Constants
// ============================================

const MAX_PAPER_IMAGES = 10
const MAX_MAIN_IMAGES = 1
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

/**
 * HEIC/HEIF 파일인지 확인
 */
function isHeicFile(file: File): boolean {
  return file.type === 'image/heic' || file.type === 'image/heif' ||
    file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')
}

const STEPS = [
  { id: 1, title: '종이 청첩장 사진', description: '종이 청첩장 사진을 업로드해주세요' },
  { id: 2, title: '메인 사진 업로드', description: '메인 이미지로 사용할 사진을 업로드해주세요' },
  { id: 3, title: '신청 완료', description: '연락처를 입력하고 신청을 완료해주세요' },
]

// ============================================
// Component
// ============================================

export function PaperInvitationModal({ open, onOpenChange }: PaperInvitationModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [paperImages, setPaperImages] = useState<UploadedImage[]>([]) // 종이 청첩장 사진 (최대 10장)
  const [mainImages, setMainImages] = useState<UploadedImage[]>([]) // 메인 이미지 사진 (1장)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isProcessingFiles, setIsProcessingFiles] = useState(false)

  const paperFileInputRef = useRef<HTMLInputElement>(null)
  const mainFileInputRef = useRef<HTMLInputElement>(null)

  // 종이 청첩장 사진 업로드 핸들러
  const handlePaperFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setIsProcessingFiles(true)
    const newImages: UploadedImage[] = []
    const rejectedHeicFiles: string[] = []

    for (const file of Array.from(files)) {
      // HEIC/HEIF 파일 반려
      if (isHeicFile(file)) {
        rejectedHeicFiles.push(file.name)
        continue
      }

      // 타입 검증
      if (!ALLOWED_TYPES.includes(file.type)) {
        continue
      }

      // 크기 검증
      if (file.size > MAX_FILE_SIZE) {
        continue
      }

      // 최대 개수 검증
      if (paperImages.length + newImages.length >= MAX_PAPER_IMAGES) {
        break
      }

      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
      const previewUrl = URL.createObjectURL(file)

      newImages.push({ id, file, previewUrl })
    }

    // HEIC 파일이 있었으면 alert 표시
    if (rejectedHeicFiles.length > 0) {
      alert(`HEIC/HEIF 형식은 지원하지 않습니다.\nJPEG, PNG, WebP 형식의 이미지만 업로드해주세요.\n\n반려된 파일: ${rejectedHeicFiles.join(', ')}`)
    }

    setPaperImages((prev) => [...prev, ...newImages])

    // input 초기화
    if (paperFileInputRef.current) {
      paperFileInputRef.current.value = ''
    }

    setIsProcessingFiles(false)
  }, [paperImages.length])

  // 메인 이미지 사진 업로드 핸들러
  const handleMainFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsProcessingFiles(true)
    const file = files[0]

    // HEIC/HEIF 파일 반려
    if (isHeicFile(file)) {
      alert(`HEIC/HEIF 형식은 지원하지 않습니다.\nJPEG, PNG, WebP 형식의 이미지만 업로드해주세요.`)
      setIsProcessingFiles(false)
      if (mainFileInputRef.current) {
        mainFileInputRef.current.value = ''
      }
      return
    }

    // 타입 검증
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert('지원하지 않는 파일 형식입니다.\nJPEG, PNG, WebP 형식의 이미지만 업로드해주세요.')
      setIsProcessingFiles(false)
      if (mainFileInputRef.current) {
        mainFileInputRef.current.value = ''
      }
      return
    }

    // 크기 검증
    if (file.size > MAX_FILE_SIZE) {
      alert('파일 크기가 너무 큽니다. 10MB 이하의 파일만 업로드해주세요.')
      setIsProcessingFiles(false)
      if (mainFileInputRef.current) {
        mainFileInputRef.current.value = ''
      }
      return
    }

    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const previewUrl = URL.createObjectURL(file)

    // 기존 메인 이미지의 previewUrl 해제
    mainImages.forEach(img => URL.revokeObjectURL(img.previewUrl))

    setMainImages([{ id, file, previewUrl }])

    // input 초기화
    if (mainFileInputRef.current) {
      mainFileInputRef.current.value = ''
    }

    setIsProcessingFiles(false)
  }, [mainImages])

  // 종이 청첩장 이미지 삭제
  const handleRemovePaperImage = useCallback((id: string) => {
    setPaperImages((prev) => prev.filter((img) => img.id !== id))
  }, [])

  // 메인 이미지 삭제
  const handleRemoveMainImage = useCallback(() => {
    mainImages.forEach(img => URL.revokeObjectURL(img.previewUrl))
    setMainImages([])
  }, [mainImages])

  // 종이 청첩장 드래그 앤 드롭
  const handlePaperDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (!files) return

    const fakeEvent = {
      target: { files },
    } as unknown as React.ChangeEvent<HTMLInputElement>

    handlePaperFileSelect(fakeEvent)
  }, [handlePaperFileSelect])

  // 메인 이미지 드래그 앤 드롭
  const handleMainDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (!files) return

    const fakeEvent = {
      target: { files },
    } as unknown as React.ChangeEvent<HTMLInputElement>

    handleMainFileSelect(fakeEvent)
  }, [handleMainFileSelect])

  // 다음 단계로
  const handleNext = useCallback(() => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }, [currentStep])

  // 이전 단계로
  const handlePrev = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }, [currentStep])

  // 제출
  const handleSubmit = useCallback(async () => {
    if (!phone || paperImages.length === 0 || mainImages.length === 0) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // FormData 생성
      const formData = new FormData()
      formData.append('phone', phone)
      if (email) formData.append('email', email)
      if (notes) formData.append('notes', notes)

      // 종이 청첩장 이미지 파일들 추가
      paperImages.forEach((img) => {
        formData.append('paperFiles', img.file)
      })

      // 메인 이미지 파일 추가
      if (mainImages[0]) {
        formData.append('mainFile', mainImages[0].file)
      }

      const result = await submitPaperInvitationRequest(formData)

      if (result.success) {
        setIsSuccess(true)
      } else {
        setSubmitError(result.error || '신청에 실패했습니다. 다시 시도해주세요.')
      }
    } catch {
      setSubmitError('신청에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }, [email, phone, notes, paperImages, mainImages])

  // 모달 닫기 시 초기화
  const handleClose = useCallback(() => {
    onOpenChange(false)
    // 약간의 딜레이 후 상태 초기화 (애니메이션 완료 후)
    setTimeout(() => {
      setCurrentStep(1)
      setPaperImages([])
      setMainImages([])
      setEmail('')
      setPhone('')
      setNotes('')
      setIsSubmitting(false)
      setSubmitError(null)
      setIsSuccess(false)
    }, 200)
  }, [onOpenChange])

  // 단계별 유효성 검사
  const canProceed = currentStep === 1
    ? paperImages.length > 0
    : currentStep === 2
      ? mainImages.length > 0
      : phone.length > 0

  return (
    <Modal open={open} onOpenChange={handleClose}>
      <ModalContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <ModalHeader className="flex-shrink-0">
          <ModalTitle className="flex items-center gap-2">
            종이 청첩장과 똑같이 만들기
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--sage-100)] text-[var(--sage-700)]">
              Beta
            </span>
          </ModalTitle>
          <ModalDescription>
            사진을 보내주시면 종이 청첩장과 똑같이 제작해드립니다
          </ModalDescription>
        </ModalHeader>

        {/* 진행 상태 */}
        <div className="px-6 py-4 border-b border-[var(--sand-100)] flex-shrink-0">
          <ProgressBar
            value={(currentStep / 3) * 100}
            className="h-1.5"
          />
          <div className="flex justify-between mt-2">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={`text-xs ${
                  step.id === currentStep
                    ? 'text-[var(--sage-600)] font-medium'
                    : step.id < currentStep
                      ? 'text-[var(--sage-500)]'
                      : 'text-[var(--text-light)]'
                }`}
              >
                {step.title}
              </div>
            ))}
          </div>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <SuccessView onClose={handleClose} />
            ) : (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {currentStep === 1 && (
                  <Step1PaperUpload
                    images={paperImages}
                    onFileSelect={handlePaperFileSelect}
                    onRemoveImage={handleRemovePaperImage}
                    onDrop={handlePaperDrop}
                    fileInputRef={paperFileInputRef}
                    isProcessing={isProcessingFiles}
                  />
                )}

                {currentStep === 2 && (
                  <Step2MainUpload
                    mainImage={mainImages[0] ?? null}
                    onFileSelect={handleMainFileSelect}
                    onRemoveImage={handleRemoveMainImage}
                    onDrop={handleMainDrop}
                    fileInputRef={mainFileInputRef}
                    isProcessing={isProcessingFiles}
                  />
                )}

                {currentStep === 3 && (
                  <Step3Contact
                    email={email}
                    phone={phone}
                    notes={notes}
                    onEmailChange={setEmail}
                    onPhoneChange={setPhone}
                    onNotesChange={setNotes}
                    error={submitError}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 하단 버튼 */}
        {!isSuccess && (
          <div className="flex-shrink-0 px-6 py-4 border-t border-[var(--sand-100)] flex justify-between">
            <Button
              variant="ghost-light"
              size="sm"
              onClick={currentStep === 1 ? handleClose : handlePrev}
            >
              {currentStep === 1 ? (
                '취소'
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  이전
                </>
              )}
            </Button>

            {currentStep === 3 ? (
              <Button
                variant="sage"
                size="sm"
                onClick={handleSubmit}
                disabled={!canProceed || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    신청 중...
                  </>
                ) : (
                  '신청하기'
                )}
              </Button>
            ) : (
              <Button
                variant="sage"
                size="sm"
                onClick={handleNext}
                disabled={!canProceed}
              >
                다음
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        )}
      </ModalContent>
    </Modal>
  )
}

// ============================================
// Step Components
// ============================================

interface Step1PaperProps {
  images: UploadedImage[]
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: (id: string) => void
  onDrop: (e: React.DragEvent) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  isProcessing: boolean
}

function Step1PaperUpload({ images, onFileSelect, onRemoveImage, onDrop, fileInputRef, isProcessing }: Step1PaperProps) {
  const [isDragging, setIsDragging] = useState(false)

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--text-muted)]">
        종이 청첩장 사진을 업로드해주세요. 최대 {MAX_PAPER_IMAGES}장까지 가능합니다.
      </p>

      {/* 드래그 앤 드롭 영역 */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          if (!isProcessing) setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          setIsDragging(false)
          if (!isProcessing) onDrop(e)
        }}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-8
          flex flex-col items-center justify-center gap-3
          cursor-pointer transition-all
          ${isDragging
            ? 'border-[var(--sage-400)] bg-[var(--sage-50)]'
            : 'border-[var(--sand-200)] hover:border-[var(--sage-300)] hover:bg-[var(--sage-50)]'
          }
          ${images.length >= MAX_PAPER_IMAGES || isProcessing ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-8 h-8 text-[var(--sage-600)] animate-spin" />
            <p className="text-sm text-[var(--text-muted)]">
              사진 처리 중...
            </p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-[var(--sage-100)] flex items-center justify-center">
              <ImagePlus className="w-6 h-6 text-[var(--sage-600)]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-[var(--text-body)]">
                사진을 드래그하거나 클릭하여 업로드
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                JPG, PNG, WebP · 최대 10MB
              </p>
            </div>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_TYPES.join(',')}
          multiple
          onChange={onFileSelect}
          className="hidden"
          disabled={isProcessing}
        />
      </div>

      {/* 업로드된 이미지 그리드 */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img) => (
            <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden group">
              <Image
                src={img.previewUrl}
                alt="업로드된 사진"
                fill
                className="object-cover"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onRemoveImage(img.id)
                }}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-[var(--text-light)] text-center">
        {images.length} / {MAX_PAPER_IMAGES}장 업로드됨
      </p>
    </div>
  )
}

interface Step2MainProps {
  mainImage: UploadedImage | null
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: () => void
  onDrop: (e: React.DragEvent) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  isProcessing: boolean
}

function Step2MainUpload({ mainImage, onFileSelect, onRemoveImage, onDrop, fileInputRef, isProcessing }: Step2MainProps) {
  const [isDragging, setIsDragging] = useState(false)

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--text-muted)]">
        메인 화면에 들어갈 대표 이미지를 업로드해주세요. 1장만 업로드 가능합니다.
      </p>

      {mainImage ? (
        // 이미 업로드된 메인 이미지 표시
        <div className="relative aspect-[3/4] max-w-[200px] mx-auto rounded-lg overflow-hidden ring-2 ring-[var(--sage-500)] ring-offset-2">
          <Image
            src={mainImage.previewUrl}
            alt="메인 이미지"
            fill
            className="object-cover"
          />
          <button
            onClick={onRemoveImage}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[var(--sage-500)] text-white text-xs font-medium">
            메인 이미지
          </div>
        </div>
      ) : (
        // 드래그 앤 드롭 영역
        <div
          onDragOver={(e) => {
            e.preventDefault()
            if (!isProcessing) setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            setIsDragging(false)
            if (!isProcessing) onDrop(e)
          }}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-xl p-8
            flex flex-col items-center justify-center gap-3
            cursor-pointer transition-all
            ${isDragging
              ? 'border-[var(--sage-400)] bg-[var(--sage-50)]'
              : 'border-[var(--sand-200)] hover:border-[var(--sage-300)] hover:bg-[var(--sage-50)]'
            }
            ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
          `}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-8 h-8 text-[var(--sage-600)] animate-spin" />
              <p className="text-sm text-[var(--text-muted)]">
                사진 처리 중...
              </p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-[var(--sage-100)] flex items-center justify-center">
                <Star className="w-6 h-6 text-[var(--sage-600)]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-[var(--text-body)]">
                  메인 이미지를 드래그하거나 클릭하여 업로드
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  JPG, PNG, WebP · 최대 10MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_TYPES.join(',')}
        onChange={onFileSelect}
        className="hidden"
        disabled={isProcessing}
      />
    </div>
  )
}

interface Step3Props {
  email: string
  phone: string
  notes: string
  onEmailChange: (value: string) => void
  onPhoneChange: (value: string) => void
  onNotesChange: (value: string) => void
  error: string | null
}

function Step3Contact({
  email,
  phone,
  notes,
  onEmailChange,
  onPhoneChange,
  onNotesChange,
  error,
}: Step3Props) {
  return (
    <div className="space-y-4">
      {/* 소요 시간 안내 */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-[var(--sage-50)] border border-[var(--sage-100)]">
        <Clock className="w-5 h-5 text-[var(--sage-600)] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-[var(--sage-700)]">
            제작 소요 시간 안내
          </p>
          <p className="text-xs text-[var(--sage-600)] mt-1">
            신청 후 <strong>최소 4일</strong>이 소요됩니다.
            제작이 완료되면 입력하신 연락처로 안내드립니다.
          </p>
        </div>
      </div>

      {/* 연락처 입력 */}
      <div className="space-y-3">
        <Input
          variant="light"
          label="연락처 (필수)"
          type="tel"
          placeholder="010-0000-0000"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
        />

        <Input
          variant="light"
          label="이메일 (선택)"
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--text-body)]">
            요청사항 (선택)
          </label>
          <textarea
            placeholder="특별히 요청하실 사항이 있으시면 적어주세요"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            className="w-full h-20 rounded-lg border border-[var(--sand-200)] px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--sage-400)] focus:border-transparent"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  )
}

// ============================================
// Success View
// ============================================

function SuccessView({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-8 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-[var(--sage-100)] flex items-center justify-center mb-4">
        <Check className="w-8 h-8 text-[var(--sage-600)]" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
        신청이 완료되었습니다!
      </h3>
      <p className="text-sm text-[var(--text-muted)] mb-6">
        제작이 완료되면 입력하신 이메일로 안내드립니다.
        <br />
        최소 4일 정도 소요됩니다.
      </p>
      <Button variant="sage" size="sm" onClick={onClose}>
        확인
      </Button>
    </motion.div>
  )
}
