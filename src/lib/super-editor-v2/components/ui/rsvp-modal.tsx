'use client'

/**
 * RSVP Modal - 참석 의사 전달 팝업
 *
 * 이미지 디자인 기반:
 * - 신랑측/신부측 탭
 * - 성함 입력
 * - 핸드폰 번호 뒤 4자리
 * - 버스 탑승 여부
 * - 참석 의사
 * - 개인정보 동의
 */

import { useState, useCallback } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal'
import type { WeddingData, RsvpConfig } from '../../schema/types'

// ============================================
// Types
// ============================================

export interface RsvpModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invitationId: string
  data: WeddingData
  config?: RsvpConfig
  onSubmit?: (data: RsvpFormData) => Promise<void>
}

export interface RsvpFormData {
  side: 'groom' | 'bride'
  name: string
  phone: string
  guestCount: number
  busOption: 'yes' | 'no' | null
  mealOption: 'yes' | 'no' | null
  attendance: 'yes' | 'no'
  privacyAgreed: boolean
}

type TabType = 'groom' | 'bride'

// ============================================
// Component
// ============================================

export function RsvpModal({
  open,
  onOpenChange,
  invitationId,
  data,
  config,
  onSubmit,
}: RsvpModalProps) {
  // 폼 상태
  const [activeTab, setActiveTab] = useState<TabType>('groom')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [guestCount, setGuestCount] = useState(1)
  const [busOption, setBusOption] = useState<'yes' | 'no' | null>(null)
  const [mealOption, setMealOption] = useState<'yes' | 'no' | null>(null)
  const [attendance, setAttendance] = useState<'yes' | 'no' | null>(null)
  const [privacyAgreed, setPrivacyAgreed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 옵션 표시 여부 (기본값 설정)
  const showSide = config?.showSide ?? true
  const showPhone = config?.showPhone ?? true
  const showGuestCount = config?.showGuestCount ?? false
  const showBusOption = config?.showBusOption ?? false
  const showMeal = config?.showMeal ?? false

  // 참석 가능할 때만 추가 옵션 표시
  const isAttending = attendance === 'yes'

  // 폼 유효성 검사
  const isFormValid =
    name.trim().length > 0 &&
    attendance !== null &&
    privacyAgreed

  // 폼 초기화
  const resetForm = useCallback(() => {
    setActiveTab('groom')
    setName('')
    setPhone('')
    setGuestCount(1)
    setBusOption(null)
    setMealOption(null)
    setAttendance(null)
    setPrivacyAgreed(false)
    setError(null)
  }, [])

  // 모달 닫기
  const handleClose = useCallback(() => {
    resetForm()
    onOpenChange(false)
  }, [resetForm, onOpenChange])

  // 폼 제출
  const handleSubmit = useCallback(async () => {
    if (!isFormValid || attendance === null) return

    setIsSubmitting(true)
    setError(null)

    try {
      const formData: RsvpFormData = {
        side: showSide ? activeTab : 'groom',
        name: name.trim(),
        phone: showPhone ? phone.trim() : '',
        guestCount: (showGuestCount && isAttending) ? guestCount : 1,
        busOption: (showBusOption && isAttending) ? busOption : null,
        mealOption: (showMeal && isAttending) ? mealOption : null,
        attendance,
        privacyAgreed,
      }

      if (onSubmit) {
        // 커스텀 핸들러가 있으면 사용
        await onSubmit(formData)
      } else {
        // 기본 동작: API 호출
        const response = await fetch('/api/super-editor-v2/rsvp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentId: invitationId,
            side: formData.side,
            name: formData.name,
            phone: formData.phone || null,
            guestCount: formData.guestCount,
            busRequired: formData.busOption === 'yes' ? true : formData.busOption === 'no' ? false : null,
            mealOption: formData.mealOption === 'yes' ? '식사함' : formData.mealOption === 'no' ? '식사안함' : null,
            attendance: formData.attendance === 'yes',
            privacyAgreed: formData.privacyAgreed,
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || '제출에 실패했습니다.')
        }
      }

      // 성공 시 모달 닫기
      handleClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : '제출에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }, [isFormValid, activeTab, name, phone, guestCount, busOption, mealOption, attendance, privacyAgreed, showSide, showPhone, showGuestCount, showBusOption, showMeal, isAttending, invitationId, onSubmit, handleClose])

  // 개인정보 처리 텍스트
  const privacyText = config?.privacyPolicyText ||
    '참석여부 전달을 위한 개인정보 수집 및 이용에 동의해 주세요.\n항목: 성함 | 보유기간: 청첩장 이용 종료시까지'

  return (
    <Modal open={open} onOpenChange={handleClose}>
      <ModalContent className="max-w-md mx-4">
        <ModalHeader className="relative pb-4 border-b border-gray-100">
          <ModalTitle className="text-xl font-semibold text-center">
            참석 의사 전달하기
          </ModalTitle>
        </ModalHeader>

        <div className="p-4 space-y-6">
          {/* 신랑측/신부측 탭 */}
          {showSide && (
            <div className="flex rounded-full bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setActiveTab('groom')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-full transition-colors ${
                  activeTab === 'groom'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                신랑측
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('bride')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-full transition-colors ${
                  activeTab === 'bride'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                신부측
              </button>
            </div>
          )}

          {/* 참석 의사 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              참석 의사를 선택해 주세요.
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setAttendance('yes')}
                className={`flex-1 py-3 text-sm font-medium rounded-lg border transition-colors ${
                  attendance === 'yes'
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                }`}
              >
                참석 가능
              </button>
              <button
                type="button"
                onClick={() => setAttendance('no')}
                className={`flex-1 py-3 text-sm font-medium rounded-lg border transition-colors ${
                  attendance === 'no'
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                }`}
              >
                참석 불가
              </button>
            </div>
          </div>

          {/* 성함 입력 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              성함을 입력해 주세요.<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="성함"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors"
            />
          </div>

          {/* 연락처 입력 */}
          {showPhone && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                연락처를 입력해 주세요.<span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '')
                  setPhone(value)
                }}
                placeholder="연락처"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors"
              />
            </div>
          )}

          {/* 참석 가능일 때만 추가 옵션 표시 */}
          {isAttending && (
            <>
              {/* 동반 인원수 */}
              {showGuestCount && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    동반 인원수를 입력해 주세요.
                  </label>
                  <input
                    type="number"
                    value={guestCount}
                    onChange={(e) => {
                      const value = Math.max(1, parseInt(e.target.value) || 1)
                      setGuestCount(value)
                    }}
                    min={1}
                    placeholder="숫자"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors"
                  />
                </div>
              )}

              {/* 버스 탑승 여부 */}
              {showBusOption && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    버스 탑승 여부를 선택해 주세요.
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setBusOption('yes')}
                      className={`flex-1 py-3 text-sm font-medium rounded-lg border transition-colors ${
                        busOption === 'yes'
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      탑승함
                    </button>
                    <button
                      type="button"
                      onClick={() => setBusOption('no')}
                      className={`flex-1 py-3 text-sm font-medium rounded-lg border transition-colors ${
                        busOption === 'no'
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      탑승안함
                    </button>
                  </div>
                </div>
              )}

              {/* 식사 여부 */}
              {showMeal && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    식사 여부를 선택해 주세요.
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setMealOption('yes')}
                      className={`flex-1 py-3 text-sm font-medium rounded-lg border transition-colors ${
                        mealOption === 'yes'
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      식사함
                    </button>
                    <button
                      type="button"
                      onClick={() => setMealOption('no')}
                      className={`flex-1 py-3 text-sm font-medium rounded-lg border transition-colors ${
                        mealOption === 'no'
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      식사안함
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* 개인정보 동의 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={privacyAgreed}
                  onChange={(e) => setPrivacyAgreed(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-gray-900 peer-checked:border-gray-900 transition-colors">
                  {privacyAgreed && (
                    <svg
                      className="w-full h-full text-white p-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-900">
                  개인 정보 수집 및 이용 동의(필수)
                </span>
                <p className="text-xs text-gray-500 mt-1 whitespace-pre-line">
                  {privacyText}
                </p>
              </div>
            </label>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="text-sm text-red-600 text-center">
              {error}
            </div>
          )}

          {/* 제출 버튼 */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className={`w-full py-4 text-base font-medium rounded-lg transition-colors ${
              isFormValid && !isSubmitting
                ? 'bg-gray-900 text-white hover:bg-gray-800'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? '전달 중...' : '참석의사 전달하기'}
          </button>
        </div>
      </ModalContent>
    </Modal>
  )
}

// ============================================
// Exports
// ============================================

export { RsvpModal as default }
