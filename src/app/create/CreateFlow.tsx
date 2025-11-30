'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { SimpleImageUploader } from '@/components/invitation/SimpleImageUploader'
import { TemplateGrid } from '@/components/invitation/TemplateGrid'
import { CustomThemeDialog } from '@/components/invitation/CustomThemeDialog'
import { GeneratingLoader } from '@/components/invitation/GeneratingLoader'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, SkipForward } from 'lucide-react'
import { getTemplatePreviews, type ThemePreview } from '@/lib/themes'
import { createDraftInvitation } from '@/lib/actions/wedding'
import type { DesignPreview } from '@/lib/actions/ai-design'

type CreateStep = 'upload' | 'themes' | 'creating'

interface ImageData {
  url: string
  base64: string
}

export function CreateFlow() {
  const router = useRouter()
  const [step, setStep] = React.useState<CreateStep>('upload')
  const [uploadedImage, setUploadedImage] = React.useState<ImageData | null>(null)
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string | null>(null)
  const [customDialogOpen, setCustomDialogOpen] = React.useState(false)
  const [customPreviews, setCustomPreviews] = React.useState<DesignPreview[] | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  // Get static templates
  const templates = React.useMemo(() => getTemplatePreviews(), [])

  const handleImageChange = (imageData: ImageData | null) => {
    setUploadedImage(imageData)
    setError(null)
  }

  const handleContinueToThemes = () => {
    setStep('themes')
  }

  const handleSkipImage = () => {
    setStep('themes')
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId)
    setCustomPreviews(null) // Clear custom previews when selecting static template
  }

  const handleCustomGenerated = (previews: DesignPreview[]) => {
    setCustomPreviews(previews)
    // Select first custom preview
    if (previews.length > 0) {
      setSelectedTemplateId(`custom-${previews[0].id}`)
    }
  }

  const handleCreate = async () => {
    if (!selectedTemplateId) {
      setError('테마를 선택해주세요')
      return
    }

    setStep('creating')
    setError(null)

    try {
      const result = await createDraftInvitation(
        selectedTemplateId,
        uploadedImage?.base64
      )

      if (result.success && result.data) {
        router.push(`/${result.data.invitationId}/edit`)
      } else {
        setError(result.error || '청첩장 생성에 실패했습니다')
        setStep('themes')
      }
    } catch (err) {
      setError('청첩장 생성 중 오류가 발생했습니다')
      setStep('themes')
    }
  }

  const handleBack = () => {
    if (step === 'themes') {
      setStep('upload')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              {step !== 'upload' && step !== 'creating' && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="p-2 -ml-2 rounded-full hover:bg-gray-100"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <h1 className="text-lg font-semibold text-gray-900">
                청첩장 만들기
              </h1>
            </div>
            <StepIndicator currentStep={step} />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === 'upload' && (
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                웨딩 사진을 업로드하세요
              </h2>
              <p className="text-gray-600">
                업로드한 사진을 바탕으로 어울리는 테마를 추천해드려요
              </p>
            </div>

            <SimpleImageUploader
              value={uploadedImage?.url || null}
              onChange={handleImageChange}
              className="mb-8"
            />

            <div className="flex flex-col gap-3">
              <Button
                onClick={handleContinueToThemes}
                className="w-full bg-[#D4768A] hover:bg-[#C4667A] text-white h-12"
              >
                테마 선택하러 가기
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="ghost"
                onClick={handleSkipImage}
                className="w-full text-gray-500"
              >
                <SkipForward className="w-4 h-4 mr-2" />
                사진 없이 진행하기
              </Button>
            </div>
          </div>
        )}

        {step === 'themes' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                테마를 선택하세요
              </h2>
              <p className="text-gray-600">
                {uploadedImage
                  ? '업로드한 사진에 어울리는 테마를 선택하거나 직접 만들어보세요'
                  : '마음에 드는 테마를 선택하거나 직접 만들어보세요'}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg text-center">
                {error}
              </div>
            )}

            <TemplateGrid
              templates={templates}
              selectedTemplateId={selectedTemplateId}
              onSelect={handleTemplateSelect}
              onCustomClick={() => setCustomDialogOpen(true)}
              userImageUrl={uploadedImage?.url}
              className="mb-8"
            />

            <div className="sticky bottom-0 bg-gray-50 py-4 border-t border-gray-200">
              <div className="max-w-xl mx-auto">
                <Button
                  onClick={handleCreate}
                  disabled={!selectedTemplateId}
                  className="w-full bg-[#D4768A] hover:bg-[#C4667A] text-white h-12 disabled:opacity-50"
                >
                  이 테마로 시작하기
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 'creating' && (
          <div className="max-w-xl mx-auto py-16">
            <GeneratingLoader prompt="청첩장을 만들고 있어요" />
          </div>
        )}
      </main>

      {/* Custom Theme Dialog */}
      <CustomThemeDialog
        open={customDialogOpen}
        onOpenChange={setCustomDialogOpen}
        imageBase64={uploadedImage?.base64}
        onGenerated={handleCustomGenerated}
      />
    </div>
  )
}

// Step Indicator Component
function StepIndicator({ currentStep }: { currentStep: CreateStep }) {
  const steps = [
    { id: 'upload', label: '사진' },
    { id: 'themes', label: '테마' },
    { id: 'creating', label: '완료' },
  ]

  const currentIndex = steps.findIndex((s) => s.id === currentStep)

  return (
    <div className="flex items-center gap-2">
      {steps.map((s, index) => (
        <React.Fragment key={s.id}>
          <div
            className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
              index <= currentIndex
                ? 'bg-[#D4768A] text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {index + 1}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-8 h-0.5 ${
                index < currentIndex ? 'bg-[#D4768A]' : 'bg-gray-200'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
