'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link2, ChevronRight } from 'lucide-react'
import {
  createEventSchema,
  type CreateEventInput,
  expectedMembersOptions,
  budgetRangeOptions,
  locationOptions,
} from '@/lib/validations/event'
import { createEvent } from '@/lib/actions/event'
import { Button, Input, Badge, Card } from '@/components/ui'
import { cn } from '@/lib/utils'

export function EventForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      groupName: '',
      expectedMembers: '',
      preferredLocation: '',
      budgetRange: '',
      invitationLink: '',
    },
  })

  const onSubmit = async (data: CreateEventInput) => {
    setIsLoading(true)
    setError(null)

    const result = await createEvent(data)

    if (result.error) {
      setError(result.error.message)
      setIsLoading(false)
      return
    }

    router.push(`/${result.data.id}/share`)
  }

  const selectedMembers = form.watch('expectedMembers')
  const selectedLocation = form.watch('preferredLocation')
  const selectedBudget = form.watch('budgetRange')

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* 그룹 이름 (필수) */}
      <Card className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-lg">💜</span>
          <span className="font-semibold text-charcoal">그룹 이름</span>
          <Badge variant="default" className="bg-blush-pink text-white text-xs">필수</Badge>
        </div>
        <p className="mb-3 text-sm text-charcoal/60">
          친구들이 알아볼 수 있는 그룹 이름을 지어주세요
        </p>
        <Input
          placeholder="예: 민지의 대학 친구들 청모"
          error={form.formState.errors.groupName?.message}
          {...form.register('groupName')}
        />
        <p className="mt-2 text-xs text-charcoal/50">
          💡 "OO의 △△ 청모" 형태로 지으면 더 친근해요!
        </p>
      </Card>

      {/* 예상 인원 (선택) - 카드형 */}
      <Card className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-lg">👥</span>
          <span className="font-semibold text-charcoal">예상 인원</span>
          <Badge variant="outline" className="text-xs">선택</Badge>
        </div>
        <p className="mb-4 text-sm text-charcoal/60">
          대략 몇 명 정도 참석할 예정인가요?
        </p>
        <div className="grid grid-cols-2 gap-3">
          {expectedMembersOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => form.setValue('expectedMembers', option.value)}
              className={cn(
                'flex flex-col items-center justify-center rounded-xl border-2 p-4 transition-all',
                selectedMembers === option.value
                  ? 'border-blush-pink bg-blush-pink/5'
                  : 'border-gray-200 hover:border-blush-pink/50'
              )}
            >
              <span className="mb-1 text-2xl">{option.icon}</span>
              <span className={cn(
                'text-sm font-medium',
                selectedMembers === option.value ? 'text-blush-pink' : 'text-charcoal'
              )}>
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </Card>

      {/* 선호 지역 (필수) - 리스트형 */}
      <Card className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-lg">📍</span>
          <span className="font-semibold text-charcoal">선호 지역</span>
          <Badge variant="default" className="bg-blush-pink text-white text-xs">필수</Badge>
        </div>
        <p className="mb-4 text-sm text-charcoal/60">
          어느 지역에서 모임을 갖고 싶으신가요?
        </p>
        <div className="space-y-2">
          {locationOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => form.setValue('preferredLocation', option.value)}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-all',
                selectedLocation === option.value
                  ? 'border-blush-pink bg-blush-pink/5'
                  : 'border-gray-200 hover:border-blush-pink/50'
              )}
            >
              <span className="text-xl">{option.icon}</span>
              <div className="flex-1">
                <p className={cn(
                  'font-medium',
                  selectedLocation === option.value ? 'text-blush-pink' : 'text-charcoal'
                )}>
                  {option.label}
                </p>
                <p className="text-xs text-charcoal/50">{option.description}</p>
              </div>
              {selectedLocation === option.value && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blush-pink text-white">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* 예산 범위 (선택) - 리스트형 */}
      <Card className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-lg">💰</span>
          <span className="font-semibold text-charcoal">예산 범위</span>
          <Badge variant="outline" className="text-xs">선택</Badge>
        </div>
        <p className="mb-4 text-sm text-charcoal/60">
          1인당 예상 예산은 어느 정도인가요?
        </p>
        <div className="space-y-2">
          {budgetRangeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => form.setValue('budgetRange', option.value)}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-all',
                selectedBudget === option.value
                  ? 'border-blush-pink bg-blush-pink/5'
                  : 'border-gray-200 hover:border-blush-pink/50'
              )}
            >
              <span className="text-xl">{option.icon}</span>
              <div className="flex-1">
                <p className={cn(
                  'font-medium',
                  selectedBudget === option.value ? 'text-blush-pink' : 'text-charcoal'
                )}>
                  {option.label}
                </p>
                <p className="text-xs text-charcoal/50">{option.description}</p>
              </div>
              {selectedBudget === option.value && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blush-pink text-white">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* 모청 링크 (선택) */}
      <Card className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-lg">🔗</span>
          <span className="font-semibold text-charcoal">모청 링크</span>
          <Badge variant="outline" className="text-xs">선택</Badge>
        </div>
        <p className="mb-3 text-sm text-charcoal/60">
          모임 참석자들이 볼 수 있는 모청 링크가 있나요?
        </p>
        <Input
          placeholder="https://..."
          {...form.register('invitationLink')}
        />
        <div className="mt-3 rounded-lg bg-blue-50 p-3">
          <p className="text-xs font-medium text-blue-600">
            💡 왜 모청 링크가 필요한가요?
          </p>
          <p className="mt-1 text-xs text-blue-600/80">
            모청을 통해 참석자들의 취향을 더 정확하게 파악하고, 모두가 만족하는 맞춤 추천을 받을 수 있어요!
          </p>
        </div>
      </Card>

      {/* 에러 메시지 */}
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* 제출 버튼 */}
      <div className="pb-4">
        <Button
          type="submit"
          size="lg"
          fullWidth
          isLoading={isLoading}
          disabled={!form.watch('groupName')}
          className="bg-blush-pink hover:bg-blush-pink/90"
        >
          다음 단계로
          <ChevronRight className="ml-1 h-5 w-5" />
        </Button>
        <p className="mt-3 text-center text-xs text-charcoal/50">
          3분이면 완성! 친구들의 취향을 알아볼게요!
        </p>
      </div>
    </form>
  )
}
