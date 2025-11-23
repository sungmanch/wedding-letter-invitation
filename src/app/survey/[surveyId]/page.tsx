'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Heart, Check } from 'lucide-react'
import {
  surveyResponseSchema,
  type SurveyResponseInput,
  type LetterInput,
  foodTypeOptions,
  atmosphereOptions,
  dietaryOptions,
  stickerOptions,
} from '@/lib/validations/survey'
import { submitSurvey, getEventBySurveyUrl } from '@/lib/actions/survey'
import {
  Button,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ProgressBar,
} from '@/components/ui'
import { cn } from '@/lib/utils'

type Step = 'info' | 'food' | 'atmosphere' | 'details' | 'letter' | 'complete'

export default function SurveyPage() {
  const params = useParams()
  const router = useRouter()
  const surveyUrl = params.surveyId as string

  const [eventId, setEventId] = useState<string | null>(null)
  const [groupName, setGroupName] = useState<string>('')
  const [isLoadingEvent, setIsLoadingEvent] = useState(true)
  const [step, setStep] = useState<Step>('info')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [letterContent, setLetterContent] = useState('')
  const [selectedStickers, setSelectedStickers] = useState<string[]>([])

  // Event 조회 (survey_url로 event_id 가져오기)
  useEffect(() => {
    const loadEvent = async () => {
      setIsLoadingEvent(true)
      const result = await getEventBySurveyUrl(surveyUrl)

      if (result.error || !result.data) {
        setError(result.error?.message || '청모장을 찾을 수 없습니다.')
        setIsLoadingEvent(false)
        return
      }

      setEventId(result.data.id)
      setGroupName(result.data.groupName)
      setIsLoadingEvent(false)
    }

    loadEvent()
  }, [surveyUrl])

  const form = useForm<SurveyResponseInput>({
    resolver: zodResolver(surveyResponseSchema),
    defaultValues: {
      guestName: '',
      foodTypes: [],
      atmospheres: [],
      dietaryRestriction: '',
      allergyInfo: '',
      dislikedFoods: '',
      preferredLocation: '',
    },
  })

  const stepProgress: Record<Step, number> = {
    info: 20,
    food: 40,
    atmosphere: 60,
    details: 80,
    letter: 90,
    complete: 100,
  }

  const toggleSelection = (
    field: 'foodTypes' | 'atmospheres',
    value: string
  ) => {
    const current = form.getValues(field)
    if (current.includes(value)) {
      form.setValue(field, current.filter((v) => v !== value))
    } else {
      form.setValue(field, [...current, value])
    }
  }

  const toggleSticker = (sticker: string) => {
    if (selectedStickers.includes(sticker)) {
      setSelectedStickers(selectedStickers.filter((s) => s !== sticker))
    } else if (selectedStickers.length < 5) {
      setSelectedStickers([...selectedStickers, sticker])
    }
  }

  const handleNext = () => {
    const steps: Step[] = ['info', 'food', 'atmosphere', 'details', 'letter']
    const currentIndex = steps.indexOf(step)
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1])
    }
  }

  const handleBack = () => {
    const steps: Step[] = ['info', 'food', 'atmosphere', 'details', 'letter']
    const currentIndex = steps.indexOf(step)
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1])
    }
  }

  const handleSubmit = async () => {
    if (!eventId) {
      setError('청모장 정보를 불러올 수 없습니다.')
      return
    }

    const values = form.getValues()
    const validation = surveyResponseSchema.safeParse(values)

    if (!validation.success) {
      setError(validation.error.issues[0]?.message || '입력값을 확인해주세요')
      return
    }

    setIsLoading(true)
    setError(null)

    const letterInput: LetterInput | undefined = letterContent
      ? { content: letterContent, stickers: selectedStickers }
      : undefined

    const result = await submitSurvey(eventId, values, letterInput)

    if (result.error) {
      setError(result.error.message)
      setIsLoading(false)
      return
    }

    setStep('complete')
    setIsLoading(false)
  }

  // Loading state
  if (isLoadingEvent) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blush-pink border-t-transparent" />
          <p className="text-charcoal/60">청모장 정보를 불러오는 중...</p>
        </div>
      </main>
    )
  }

  // Error state (event not found)
  if (!eventId && error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <span className="text-3xl">😢</span>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-charcoal">
          청모장을 찾을 수 없습니다
        </h1>
        <p className="mb-6 text-charcoal/60">{error}</p>
        <Button variant="outline" onClick={() => router.push('/')}>
          홈으로 돌아가기
        </Button>
      </main>
    )
  }

  if (step === 'complete') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <Check className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-charcoal">
          소중한 의견 감사합니다!
        </h1>
        <p className="mb-6 text-charcoal/60">
          응답이 성공적으로 제출되었어요
        </p>
        {letterContent && (
          <div className="mb-6 rounded-xl bg-blush-pink-50 p-4">
            <Heart className="mx-auto mb-2 h-6 w-6 text-blush-pink" />
            <p className="text-sm text-blush-pink">
              축하 편지도 함께 전달되었어요
            </p>
          </div>
        )}
        <Button variant="outline" onClick={() => router.push('/')}>
          홈으로 돌아가기
        </Button>
      </main>
    )
  }

  return (
    <main className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-cream bg-white/80 backdrop-blur-sm">
        <div className="flex h-14 items-center justify-center px-4">
          <h1 className="font-semibold text-charcoal">{groupName} 설문</h1>
        </div>
      </header>

      {/* Progress */}
      <div className="px-4 py-3">
        <ProgressBar value={stepProgress[step]} max={100} />
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {/* Step: Info */}
        {step === 'info' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-charcoal">
                안녕하세요!
              </h2>
              <p className="mt-1 text-sm text-charcoal/60">
                이름을 알려주세요
              </p>
            </div>
            <Input
              label="이름"
              placeholder="예: 김민지"
              error={form.formState.errors.guestName?.message}
              {...form.register('guestName')}
            />
          </div>
        )}

        {/* Step: Food Types */}
        {step === 'food' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-charcoal">
                어떤 음식을 좋아하세요?
              </h2>
              <p className="mt-1 text-sm text-charcoal/60">
                여러 개 선택할 수 있어요
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {foodTypeOptions.map((option) => {
                const isSelected = form.watch('foodTypes').includes(option.value)
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleSelection('foodTypes', option.value)}
                    className={cn(
                      'flex items-center gap-2 rounded-xl border-2 p-4 text-left transition-all',
                      isSelected
                        ? 'border-blush-pink bg-blush-pink-50'
                        : 'border-gray-200 hover:border-blush-pink-200'
                    )}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <span className="font-medium text-charcoal">
                      {option.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step: Atmosphere */}
        {step === 'atmosphere' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-charcoal">
                선호하는 분위기는?
              </h2>
              <p className="mt-1 text-sm text-charcoal/60">
                여러 개 선택할 수 있어요
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {atmosphereOptions.map((option) => {
                const isSelected = form.watch('atmospheres').includes(option.value)
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleSelection('atmospheres', option.value)}
                    className={cn(
                      'flex items-center gap-2 rounded-xl border-2 p-4 text-left transition-all',
                      isSelected
                        ? 'border-blush-pink bg-blush-pink-50'
                        : 'border-gray-200 hover:border-blush-pink-200'
                    )}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <span className="font-medium text-charcoal">
                      {option.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step: Details */}
        {step === 'details' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-charcoal">
                추가 정보
              </h2>
              <p className="mt-1 text-sm text-charcoal/60">
                선택 사항이에요
              </p>
            </div>

            <Select
              value={form.watch('dietaryRestriction')}
              onValueChange={(value) => form.setValue('dietaryRestriction', value)}
            >
              <SelectTrigger label="식이 제한">
                <SelectValue placeholder="선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                {dietaryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              label="알레르기 정보"
              placeholder="예: 갑각류, 견과류"
              {...form.register('allergyInfo')}
            />

            <Input
              label="못 먹는 음식"
              placeholder="예: 고수, 파"
              {...form.register('dislikedFoods')}
            />
          </div>
        )}

        {/* Step: Letter */}
        {step === 'letter' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-charcoal">
                축하 편지 (선택)
              </h2>
              <p className="mt-1 text-sm text-charcoal/60">
                신부님에게 전할 메시지를 남겨주세요
              </p>
            </div>

            <Textarea
              label="편지 내용"
              placeholder="결혼 축하해! 너무 행복해 보여서 나도 기뻐..."
              value={letterContent}
              onChange={(e) => setLetterContent(e.target.value)}
              maxLength={300}
              showCount
              className="min-h-[150px]"
            />

            <div>
              <p className="mb-2 text-sm font-medium text-charcoal">
                스티커 추가 (최대 5개)
              </p>
              <div className="flex flex-wrap gap-2">
                {stickerOptions.map((sticker) => {
                  const isSelected = selectedStickers.includes(sticker)
                  return (
                    <button
                      key={sticker}
                      type="button"
                      onClick={() => toggleSticker(sticker)}
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-all',
                        isSelected
                          ? 'bg-blush-pink-50 ring-2 ring-blush-pink'
                          : 'bg-cream hover:bg-cream/70'
                      )}
                    >
                      {sticker}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-cream bg-white p-4">
        <div className="mx-auto flex max-w-[480px] gap-3">
          {step !== 'info' && (
            <Button variant="outline" onClick={handleBack} className="flex-1">
              이전
            </Button>
          )}
          {step === 'letter' ? (
            <Button
              onClick={handleSubmit}
              isLoading={isLoading}
              className="flex-1"
            >
              제출하기
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={
                (step === 'info' && !form.watch('guestName')) ||
                (step === 'food' && form.watch('foodTypes').length === 0) ||
                (step === 'atmosphere' && form.watch('atmospheres').length === 0)
              }
              className="flex-1"
            >
              다음
            </Button>
          )}
        </div>
      </div>
    </main>
  )
}
