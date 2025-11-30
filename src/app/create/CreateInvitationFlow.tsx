'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  ChatBubble,
  ChatInput,
  TimePicker,
  GeneratingLoader,
  DesignPreviewCard,
  DesignPreviewCardSkeleton,
} from '@/components/invitation'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui'
import { ArrowLeft, ChevronRight, Upload } from 'lucide-react'
import { createInvitation, saveScreenStructure } from '@/lib/actions/wedding'
import {
  generateDesignPreviews,
  generateScreenStructure,
  type DesignPreview,
  type ScreenStructure,
} from '@/lib/actions/ai-design'
import type { Invitation } from '@/lib/db/invitation-schema'

// Step definitions
type Step =
  | 'intro'
  | 'groom_name'
  | 'bride_name'
  | 'wedding_date'
  | 'wedding_time'
  | 'venue_name'
  | 'venue_address'
  | 'groom_parents'
  | 'bride_parents'
  | 'groom_phone'
  | 'bride_phone'
  | 'groom_account'
  | 'bride_account'
  | 'photo_upload'
  | 'style_prompt'
  | 'generating'
  | 'select_design'
  | 'complete'

interface Message {
  id: string
  variant: 'ai' | 'user'
  content: string
  isTyping?: boolean
}

interface FormData {
  groomName: string
  brideName: string
  weddingDate: string
  weddingTime: string
  venueName: string
  venueAddress: string
  venueDetail: string
  groomFatherName: string
  groomMotherName: string
  brideFatherName: string
  brideMotherName: string
  groomPhone: string
  bridePhone: string
  groomBank: string
  groomAccount: string
  groomAccountHolder: string
  brideBank: string
  brideAccount: string
  brideAccountHolder: string
  stylePrompt: string
}

const INITIAL_FORM_DATA: FormData = {
  groomName: '',
  brideName: '',
  weddingDate: '',
  weddingTime: '12:00',
  venueName: '',
  venueAddress: '',
  venueDetail: '',
  groomFatherName: '',
  groomMotherName: '',
  brideFatherName: '',
  brideMotherName: '',
  groomPhone: '',
  bridePhone: '',
  groomBank: '',
  groomAccount: '',
  groomAccountHolder: '',
  brideBank: '',
  brideAccount: '',
  brideAccountHolder: '',
  stylePrompt: '',
}

const BANKS = [
  '신한은행', '국민은행', '우리은행', '하나은행', 'SC제일은행',
  '농협은행', '기업은행', '카카오뱅크', '토스뱅크', '케이뱅크',
]

export function CreateInvitationFlow() {
  const router = useRouter()
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const initializedRef = React.useRef(false)
  const processingRef = React.useRef(false)

  const [step, setStep] = React.useState<Step>('intro')
  const [messages, setMessages] = React.useState<Message[]>([])
  const [formData, setFormData] = React.useState<FormData>(INITIAL_FORM_DATA)
  const [inputValue, setInputValue] = React.useState('')
  const [invitationId, setInvitationId] = React.useState<string | null>(null)
  const [previews, setPreviews] = React.useState<DesignPreview[]>([])
  const [selectedPreviewId, setSelectedPreviewId] = React.useState<string | null>(null)
  const [uploadedImage, setUploadedImage] = React.useState<string | null>(null)
  const [showCalendar, setShowCalendar] = React.useState(false)
  const [showTimePicker, setShowTimePicker] = React.useState(false)
  const [showBankSelect, setShowBankSelect] = React.useState(false)
  const [currentBankSide, setCurrentBankSide] = React.useState<'groom' | 'bride'>('groom')
  const [isLoading, setIsLoading] = React.useState(false)

  // Scroll to bottom when messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initialize with intro message (runs once)
  React.useEffect(() => {
    if (!initializedRef.current && step === 'intro') {
      initializedRef.current = true
      addAIMessage('안녕하세요! 특별한 청첩장을 만들어 드릴게요 ✨\n\n먼저, 신랑님 성함을 알려주세요!')
      setStep('groom_name')
    }
  }, [])

  const addAIMessage = (content: string, isTyping = false) => {
    const id = `ai-${Date.now()}`
    setMessages((prev) => [...prev, { id, variant: 'ai', content, isTyping }])
  }

  const addUserMessage = (content: string) => {
    const id = `user-${Date.now()}`
    setMessages((prev) => [...prev, { id, variant: 'user', content }])
  }

  const handleTextSubmit = async () => {
    if (!inputValue.trim() || processingRef.current) return
    processingRef.current = true
    const value = inputValue.trim()
    setInputValue('')

    switch (step) {
      case 'groom_name':
        addUserMessage(value)
        setFormData((prev) => ({ ...prev, groomName: value }))
        setTimeout(() => {
          addAIMessage(`${value}님, 반가워요! 💐\n신부님 성함도 알려주세요`)
          setStep('bride_name')
          processingRef.current = false
        }, 500)
        break

      case 'bride_name':
        addUserMessage(value)
        setFormData((prev) => ({ ...prev, brideName: value }))
        setTimeout(() => {
          addAIMessage(`${formData.groomName}님 💑 ${value}님, 축하드려요!\n\n결혼식 날짜를 선택해주세요 📅`)
          setShowCalendar(true)
          setStep('wedding_date')
          processingRef.current = false
        }, 500)
        break

      case 'venue_name':
        addUserMessage(value)
        setFormData((prev) => ({ ...prev, venueName: value }))
        setTimeout(() => {
          addAIMessage('좋은 곳이네요! 🎊\n주소를 알려주시면 하객분들이 찾기 쉬워요')
          setStep('venue_address')
          processingRef.current = false
        }, 500)
        break

      case 'venue_address':
        addUserMessage(value)
        setFormData((prev) => ({ ...prev, venueAddress: value }))
        setTimeout(() => {
          addAIMessage('이제 혼주분들 성함을 입력해볼까요?\n\n신랑측 혼주님 성함을 알려주세요\n(예: 아버지 김철수 / 어머니 박영희)\n\n건너뛰시려면 "건너뛰기"를 입력해주세요')
          setStep('groom_parents')
          processingRef.current = false
        }, 500)
        break

      case 'groom_parents':
        addUserMessage(value)
        if (value !== '건너뛰기') {
          // Simple parsing - expecting format like "아버지 김철수 / 어머니 박영희"
          const parts = value.split('/').map(s => s.trim())
          const fatherPart = parts.find(p => p.includes('아버지'))
          const motherPart = parts.find(p => p.includes('어머니'))
          setFormData((prev) => ({
            ...prev,
            groomFatherName: fatherPart?.replace('아버지', '').trim() || '',
            groomMotherName: motherPart?.replace('어머니', '').trim() || '',
          }))
        }
        setTimeout(() => {
          addAIMessage('신부측 혼주님 성함도 알려주세요\n(예: 아버지 이영호 / 어머니 최수진)\n\n건너뛰시려면 "건너뛰기"를 입력해주세요')
          setStep('bride_parents')
          processingRef.current = false
        }, 500)
        break

      case 'bride_parents':
        addUserMessage(value)
        if (value !== '건너뛰기') {
          const parts = value.split('/').map(s => s.trim())
          const fatherPart = parts.find(p => p.includes('아버지'))
          const motherPart = parts.find(p => p.includes('어머니'))
          setFormData((prev) => ({
            ...prev,
            brideFatherName: fatherPart?.replace('아버지', '').trim() || '',
            brideMotherName: motherPart?.replace('어머니', '').trim() || '',
          }))
        }
        setTimeout(() => {
          addAIMessage('연락처를 추가하시겠어요? 📱\n\n신랑님 연락처를 입력해주세요\n(예: 010-1234-5678)\n\n건너뛰시려면 "건너뛰기"를 입력해주세요')
          setStep('groom_phone')
          processingRef.current = false
        }, 500)
        break

      case 'groom_phone':
        addUserMessage(value)
        if (value !== '건너뛰기') {
          setFormData((prev) => ({ ...prev, groomPhone: value.replace(/-/g, '') }))
        }
        setTimeout(() => {
          addAIMessage('신부님 연락처도 입력해주세요\n\n건너뛰시려면 "건너뛰기"를 입력해주세요')
          setStep('bride_phone')
          processingRef.current = false
        }, 500)
        break

      case 'bride_phone':
        addUserMessage(value)
        if (value !== '건너뛰기') {
          setFormData((prev) => ({ ...prev, bridePhone: value.replace(/-/g, '') }))
        }
        setTimeout(() => {
          addAIMessage('축의금 계좌를 추가하시겠어요? 💰\n\n신랑측 계좌 정보를 입력해주세요\n\n아래에서 은행을 선택해주세요')
          setCurrentBankSide('groom')
          setShowBankSelect(true)
          setStep('groom_account')
          processingRef.current = false
        }, 500)
        break

      case 'groom_account':
        if (!showBankSelect) {
          addUserMessage(value)
          if (value !== '건너뛰기') {
            // Parse account number and holder
            setFormData((prev) => ({
              ...prev,
              groomAccount: value.split(' ')[0] || value,
              groomAccountHolder: value.split(' ')[1] || formData.groomName,
            }))
          }
          setTimeout(() => {
            addAIMessage('신부측 계좌 정보도 입력해주세요\n\n아래에서 은행을 선택해주세요')
            setCurrentBankSide('bride')
            setShowBankSelect(true)
            setStep('bride_account')
            processingRef.current = false
          }, 500)
        } else {
          processingRef.current = false
        }
        break

      case 'bride_account':
        if (!showBankSelect) {
          addUserMessage(value)
          if (value !== '건너뛰기') {
            setFormData((prev) => ({
              ...prev,
              brideAccount: value.split(' ')[0] || value,
              brideAccountHolder: value.split(' ')[1] || formData.brideName,
            }))
          }
          setTimeout(() => {
            addAIMessage('거의 다 됐어요! 📸\n\n청첩장에 넣을 사진을 업로드해주세요.\n사진이 없으시면 "건너뛰기"를 입력해주세요')
            setStep('photo_upload')
            processingRef.current = false
          }, 500)
        } else {
          processingRef.current = false
        }
        break

      case 'photo_upload':
        if (value === '건너뛰기') {
          addUserMessage(value)
          setTimeout(() => {
            addAIMessage('알겠어요! 🎨\n\n마지막으로, 원하시는 청첩장 스타일을 자유롭게 설명해주세요!\n\n예: "봄꽃이 가득한 로맨틱한 분위기", "심플하고 모던한 스타일", "전통적이고 고급스러운 느낌"')
            setStep('style_prompt')
            processingRef.current = false
          }, 500)
        } else {
          processingRef.current = false
        }
        break

      case 'style_prompt':
        addUserMessage(value)
        setFormData((prev) => ({ ...prev, stylePrompt: value }))
        await handleGenerateDesigns(value)
        processingRef.current = false
        break
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return
    const dateStr = date.toISOString().split('T')[0]
    const formattedDate = date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    addUserMessage(formattedDate)
    setFormData((prev) => ({ ...prev, weddingDate: dateStr }))
    setShowCalendar(false)

    setTimeout(() => {
      addAIMessage('좋은 날이네요! ⏰\n예식 시간을 선택해주세요')
      setShowTimePicker(true)
      setStep('wedding_time')
    }, 500)
  }

  const handleTimeSelect = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    const period = hours < 12 ? '오전' : '오후'
    const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
    const formattedTime = `${period} ${displayHour}시 ${minutes > 0 ? `${minutes}분` : ''}`

    addUserMessage(formattedTime)
    setFormData((prev) => ({ ...prev, weddingTime: time }))
    setShowTimePicker(false)

    setTimeout(() => {
      addAIMessage('예식장 이름을 알려주세요 🏛️')
      setStep('venue_name')
    }, 500)
  }

  const handleBankSelect = (bank: string) => {
    setShowBankSelect(false)

    if (bank === '건너뛰기') {
      addUserMessage('건너뛰기')
      if (currentBankSide === 'groom') {
        setTimeout(() => {
          addAIMessage('신부측 계좌 정보도 입력해주세요\n\n아래에서 은행을 선택해주세요')
          setCurrentBankSide('bride')
          setShowBankSelect(true)
          setStep('bride_account')
        }, 500)
      } else {
        setTimeout(() => {
          addAIMessage('거의 다 됐어요! 📸\n\n청첩장에 넣을 사진을 업로드해주세요.\n사진이 없으시면 "건너뛰기"를 입력해주세요')
          setStep('photo_upload')
        }, 500)
      }
    } else {
      addUserMessage(bank)
      if (currentBankSide === 'groom') {
        setFormData((prev) => ({ ...prev, groomBank: bank }))
      } else {
        setFormData((prev) => ({ ...prev, brideBank: bank }))
      }

      setTimeout(() => {
        addAIMessage(`${bank} 선택하셨네요!\n계좌번호와 예금주를 입력해주세요\n(예: 1234567890 홍길동)`)
      }, 300)
    }
  }

  const handleGenerateDesigns = async (stylePrompt: string) => {
    setStep('generating')
    setIsLoading(true)

    try {
      // First create the invitation
      const createResult = await createInvitation({
        groomName: formData.groomName,
        brideName: formData.brideName,
        weddingDate: formData.weddingDate,
        weddingTime: formData.weddingTime,
        venueName: formData.venueName,
        venueAddress: formData.venueAddress,
        venueDetail: formData.venueDetail,
        groomFatherName: formData.groomFatherName || null,
        groomMotherName: formData.groomMotherName || null,
        brideFatherName: formData.brideFatherName || null,
        brideMotherName: formData.brideMotherName || null,
        groomPhone: formData.groomPhone || null,
        bridePhone: formData.bridePhone || null,
        groomBank: formData.groomBank || null,
        groomAccount: formData.groomAccount || null,
        groomAccountHolder: formData.groomAccountHolder || null,
        brideBank: formData.brideBank || null,
        brideAccount: formData.brideAccount || null,
        brideAccountHolder: formData.brideAccountHolder || null,
        stylePrompt,
      })

      if (!createResult.success || !createResult.data) {
        throw new Error(createResult.error || '청첩장 생성에 실패했습니다')
      }

      setInvitationId(createResult.data.id)

      // Stage 1: Generate design previews
      const previewResult = await generateDesignPreviews(stylePrompt, uploadedImage || undefined)

      if (!previewResult.success || !previewResult.data) {
        throw new Error(previewResult.error || '디자인 생성에 실패했습니다')
      }

      setPreviews(previewResult.data)
      setStep('select_design')
      addAIMessage('5가지 디자인을 준비했어요! 🎨\n마음에 드는 디자인을 선택해주세요')
    } catch (error) {
      console.error('Failed to generate designs:', error)
      addAIMessage('죄송해요, 디자인 생성 중 문제가 발생했어요. 다시 시도해주세요.')
      setStep('style_prompt')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreviewSelect = (previewId: string) => {
    setSelectedPreviewId(previewId)
  }

  const handleContinueWithDesign = async () => {
    if (!selectedPreviewId || !invitationId) return

    setIsLoading(true)
    try {
      const selectedPreview = previews.find((p) => p.id === selectedPreviewId)
      if (!selectedPreview) {
        throw new Error('선택된 디자인을 찾을 수 없습니다')
      }

      // Stage 2: Generate screen structure
      const structureResult = await generateScreenStructure(selectedPreview, uploadedImage || undefined)

      if (!structureResult.success || !structureResult.data) {
        throw new Error(structureResult.error || '화면 구조 생성에 실패했습니다')
      }

      // Save the screen structure to the invitation designs table
      const saveResult = await saveScreenStructure(invitationId, structureResult.data)
      if (!saveResult.success) {
        throw new Error(saveResult.error || '디자인 저장에 실패했습니다')
      }

      router.push(`/${invitationId}/photos`)
    } catch (error) {
      console.error('Failed to continue:', error)
      addAIMessage('죄송해요, 디자인 적용 중 문제가 발생했어요. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      setUploadedImage(base64)
      addUserMessage('📷 사진 업로드 완료')
      setTimeout(() => {
        addAIMessage('사진이 업로드되었어요! 📸\n이 사진과 어울리는 청첩장을 만들어드릴게요\n\n원하시는 청첩장 스타일을 자유롭게 설명해주세요!\n\n예: "봄꽃이 가득한 로맨틱한 분위기", "심플하고 모던한 스타일", "전통적이고 고급스러운 느낌"')
        setStep('style_prompt')
      }, 500)
    }
    reader.readAsDataURL(file)
  }

  const handleBack = () => {
    if (messages.length > 2) {
      // Remove last two messages (user input and AI response)
      setMessages((prev) => prev.slice(0, -2))
    }
    router.back()
  }

  return (
    <div className="flex flex-col h-screen bg-white lg:max-w-2xl lg:mx-auto lg:shadow-xl">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white">
        <div className="flex h-14 items-center px-4">
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-charcoal" />
          </button>
          <span className="ml-2 font-medium text-charcoal">청첩장 만들기</span>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            variant={message.variant}
            isTyping={message.isTyping}
          >
            {message.content}
          </ChatBubble>
        ))}

        {/* Generating Loader */}
        {step === 'generating' && (
          <GeneratingLoader
            prompt={formData.stylePrompt}
            className="my-8"
          />
        )}

        {/* Design Selection */}
        {step === 'select_design' && previews.length > 0 && (
          <div className="py-4">
            <div className="grid grid-cols-2 gap-3 pb-4">
              {previews.map((preview) => (
                <DesignPreviewCard
                  key={preview.id}
                  preview={preview}
                  isSelected={selectedPreviewId === preview.id}
                  onSelect={() => handlePreviewSelect(preview.id)}
                />
              ))}
            </div>
            {selectedPreviewId && (
              <div className="mt-4 flex justify-center">
                <Button
                  onClick={handleContinueWithDesign}
                  disabled={isLoading}
                  className="bg-[#D4768A] hover:bg-[#c4657a] text-white"
                >
                  {isLoading ? '디자인 생성 중...' : '이 디자인으로 계속하기'}
                  {!isLoading && <ChevronRight className="ml-1 h-4 w-4" />}
                </Button>
              </div>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {step !== 'generating' && step !== 'select_design' && step !== 'complete' && (
        <div className="border-t border-gray-100 p-4 space-y-3 bg-white">
          {/* Calendar */}
          {showCalendar && (
            <div className="flex justify-center mb-4">
              <Calendar
                mode="single"
                selected={formData.weddingDate ? new Date(formData.weddingDate) : undefined}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date()}
                className="rounded-xl border border-gray-200"
              />
            </div>
          )}

          {/* Time Picker */}
          {showTimePicker && (
            <div className="bg-gray-50 rounded-xl mb-4">
              <TimePicker
                value={formData.weddingTime}
                onChange={handleTimeSelect}
              />
            </div>
          )}

          {/* Bank Selection */}
          {showBankSelect && (
            <div className="mb-4">
              <div className="grid grid-cols-3 gap-2">
                {BANKS.map((bank) => (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => handleBankSelect(bank)}
                    className="py-2 px-3 text-sm rounded-xl bg-gray-100 text-charcoal hover:bg-gray-200 transition-colors"
                  >
                    {bank}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleBankSelect('건너뛰기')}
                  className="py-2 px-3 text-sm rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors col-span-3"
                >
                  건너뛰기
                </button>
              </div>
            </div>
          )}

          {/* Photo Upload */}
          {step === 'photo_upload' && (
            <div className="mb-4 space-y-3">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">사진을 업로드해주세요</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP (최대 10MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                />
              </label>
              {uploadedImage && (
                <div className="relative">
                  <img
                    src={uploadedImage}
                    alt="Uploaded preview"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setUploadedImage(null)}
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                  >
                    ✕
                  </button>
                </div>
              )}
              <ChatInput
                value={inputValue}
                onChange={setInputValue}
                onSubmit={handleTextSubmit}
                placeholder="건너뛰기"
                disabled={isLoading}
              />
            </div>
          )}

          {/* Text Input */}
          {!showCalendar && !showTimePicker && !showBankSelect && step !== 'photo_upload' && (
            <ChatInput
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleTextSubmit}
              placeholder={getPlaceholderForStep(step)}
              disabled={isLoading}
            />
          )}
        </div>
      )}
    </div>
  )
}

function getPlaceholderForStep(step: Step): string {
  switch (step) {
    case 'groom_name':
      return '신랑님 성함을 입력해주세요'
    case 'bride_name':
      return '신부님 성함을 입력해주세요'
    case 'venue_name':
      return '예식장 이름을 입력해주세요'
    case 'venue_address':
      return '예식장 주소를 입력해주세요'
    case 'groom_parents':
    case 'bride_parents':
      return '예: 아버지 홍길동 / 어머니 김영희'
    case 'groom_phone':
    case 'bride_phone':
      return '예: 010-1234-5678'
    case 'groom_account':
    case 'bride_account':
      return '예: 1234567890 홍길동'
    case 'photo_upload':
      return '건너뛰기'
    case 'style_prompt':
      return '원하는 스타일을 자유롭게 설명해주세요'
    default:
      return '메시지를 입력해주세요'
  }
}
