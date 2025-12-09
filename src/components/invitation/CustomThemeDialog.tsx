'use client'

import * as React from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { GeneratingLoader } from './GeneratingLoader'
import { generateDesignPreviews, type DesignPreview } from '@/lib/actions/ai-design'

interface CustomThemeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  imageBase64?: string
  onGenerated: (previews: DesignPreview[]) => void
}

const EXAMPLE_PROMPTS = [
  '영화같은 감성',
  '봄꽃 가득한',
  '모던하고 세련된',
  '따뜻하고 로맨틱한',
  '미니멀한 스타일',
]

export function CustomThemeDialog({
  open,
  onOpenChange,
  imageBase64,
  onGenerated,
}: CustomThemeDialogProps) {
  const [prompt, setPrompt] = React.useState('')
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('스타일을 설명해주세요')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const result = await generateDesignPreviews(prompt, imageBase64)

      if (result.success && result.data) {
        onGenerated(result.data)
        onOpenChange(false)
        setPrompt('')
      } else {
        setError(result.error || '테마 생성에 실패했습니다')
      }
    } catch {
      setError('테마 생성 중 오류가 발생했습니다')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExampleClick = (example: string) => {
    setPrompt((prev) => {
      if (prev.includes(example)) return prev
      return prev ? `${prev}, ${example}` : example
    })
  }

  const handleClose = () => {
    if (!isGenerating) {
      onOpenChange(false)
      setPrompt('')
      setError(null)
    }
  }

  return (
    <Modal open={open} onOpenChange={handleClose}>
      <ModalContent className="sm:max-w-lg">
        {isGenerating ? (
          <GeneratingLoader prompt={prompt} className="py-8" />
        ) : (
          <>
            <ModalHeader>
              <ModalTitle>커스텀 테마 생성</ModalTitle>
              <ModalDescription>
                원하는 청첩장 스타일을 자유롭게 설명해주세요. AI가 맞춤 테마를 만들어드립니다.
              </ModalDescription>
            </ModalHeader>

            <div className="space-y-4">
              {/* Prompt Input */}
              <div>
                <Textarea
                  placeholder="예: 영화 같은 분위기의 청첩장을 만들어줘. 레트로한 느낌으로..."
                  value={prompt}
                  onChange={(e) => {
                    setPrompt(e.target.value)
                    setError(null)
                  }}
                  rows={4}
                  className="resize-none"
                />
                {error && (
                  <p className="mt-1 text-sm text-red-500">{error}</p>
                )}
              </div>

              {/* Example Chips */}
              <div>
                <p className="text-sm text-gray-500 mb-2">예시 키워드</p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_PROMPTS.map((example) => (
                    <button
                      key={example}
                      type="button"
                      onClick={() => handleExampleClick(example)}
                      className="px-3 py-1.5 text-sm rounded-full border border-gray-200 hover:border-[#D4768A] hover:bg-pink-50 transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <ModalFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                취소
              </Button>
              <Button
                type="button"
                onClick={handleGenerate}
                disabled={!prompt.trim()}
                className="bg-[#D4768A] hover:bg-[#C4667A] text-white"
              >
                테마 생성하기
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
