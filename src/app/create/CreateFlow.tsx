'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { TemplateGrid } from '@/components/invitation/TemplateGrid'
import { CustomThemeDialog } from '@/components/invitation/CustomThemeDialog'
import { GeneratingLoader } from '@/components/invitation/GeneratingLoader'
import { Button } from '@/components/ui/button'
import { getTemplatePreviews, type ThemePreview } from '@/lib/themes'
import { createDraftInvitation } from '@/lib/actions/wedding'
import type { DesignPreview } from '@/lib/actions/ai-design'

type CreateStep = 'themes' | 'creating'

export function CreateFlow() {
  const router = useRouter()
  const [step, setStep] = React.useState<CreateStep>('themes')
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string | null>(null)
  const [customDialogOpen, setCustomDialogOpen] = React.useState(false)
  const [customPreviews, setCustomPreviews] = React.useState<DesignPreview[] | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  // Get static templates
  const templates = React.useMemo(() => getTemplatePreviews(), [])

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
        undefined
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

  return (
    <div className="min-h-screen bg-[#0A0806]">
      {/* Header - 랜딩 페이지 스타일 */}
      <header className="fixed top-0 z-50 w-full bg-transparent">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 mt-2 sm:mt-3">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Maison de Letter"
              width={300}
              height={72}
              className="brightness-110 w-[180px] sm:w-[240px] lg:w-[300px] h-auto"
            />
          </Link>
          <StepIndicator currentStep={step} />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        {step === 'themes' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#F5E6D3] mb-2">
                테마를 선택하세요
              </h2>
              <p className="text-[#F5E6D3]/70">
                마음에 드는 테마를 선택하거나 직접 만들어보세요
              </p>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-900/30 text-red-300 rounded-lg text-center border border-red-500/30">
                {error}
              </div>
            )}

            <TemplateGrid
              templates={templates}
              selectedTemplateId={selectedTemplateId}
              onSelect={handleTemplateSelect}
              onCustomClick={() => setCustomDialogOpen(true)}
              className="mb-8"
            />

            <div className="sticky bottom-0 bg-[#0A0806]/95 backdrop-blur-sm py-4 border-t border-white/10">
              <div className="max-w-xl mx-auto">
                <Button
                  onClick={handleCreate}
                  disabled={!selectedTemplateId}
                  className="w-full bg-[#C9A962] hover:bg-[#B8A052] text-[#0A0806] h-12 disabled:opacity-50 font-semibold"
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
        onGenerated={handleCustomGenerated}
      />
    </div>
  )
}

// Step Indicator Component
function StepIndicator({ currentStep }: { currentStep: CreateStep }) {
  const steps = [
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
                ? 'bg-[#C9A962] text-[#0A0806]'
                : 'bg-white/10 text-[#F5E6D3]/50'
            }`}
          >
            {index + 1}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-8 h-0.5 ${
                index < currentIndex ? 'bg-[#C9A962]' : 'bg-white/10'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
