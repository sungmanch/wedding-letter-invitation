'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Eye, Copy, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { InvitationViewer } from '@/components/invitation'
import { EditContextProvider, useEditContext } from './EditContext'
import { EditorForm } from './EditorForm'
import type { Invitation, InvitationDesign, InvitationPhoto } from '@/lib/db/invitation-schema'

interface EditClientProps {
  invitation: Invitation & { selectedDesign?: InvitationDesign | null; photos?: InvitationPhoto[] }
  design?: InvitationDesign | null
  photos: InvitationPhoto[]
  shareUrl: string
}

export function EditClient({ invitation, design, photos, shareUrl }: EditClientProps) {
  return (
    <EditContextProvider
      initialInvitation={invitation}
      initialDesign={design}
      initialPhotos={photos}
    >
      <EditLayout shareUrl={shareUrl} invitationId={invitation.id} />
    </EditContextProvider>
  )
}

interface EditLayoutProps {
  shareUrl: string
  invitationId: string
}

function EditLayout({ shareUrl, invitationId }: EditLayoutProps) {
  const router = useRouter()
  const { invitation, design, photos, isSaving, hasChanges } = useEditContext()
  const [copied, setCopied] = React.useState(false)

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Back button */}
            <div className="flex items-center gap-3">
              <Link href="/my/invitations" className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <h1 className="text-lg font-semibold text-gray-900">청첩장 편집</h1>
              {isSaving && (
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  저장 중...
                </span>
              )}
              {!isSaving && hasChanges && <span className="text-sm text-green-600">저장됨</span>}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/${invitationId}/preview`)}
                className="hidden sm:flex"
              >
                <Eye className="w-4 h-4 mr-2" />
                미리보기
              </Button>
              <Button
                size="sm"
                onClick={() => router.push(`/${invitationId}/preview`)}
                className="bg-[#D4768A] hover:bg-[#C4667A] text-white"
              >
                완료
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Share URL Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 shrink-0">공유 링크</span>
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
              <span className="text-sm text-gray-600 truncate">{shareUrl}</span>
              <button
                onClick={handleCopyUrl}
                className="shrink-0 p-1.5 rounded-md hover:bg-gray-200 transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 2 Panel Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Panel - Editor Form */}
          <div className="flex-1 lg:max-w-xl">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <EditorForm />
            </div>
          </div>

          {/* Right Panel - Preview (Desktop only) */}
          <div className="hidden lg:block lg:flex-1">
            <div className="sticky top-20">
              <PreviewFrame invitation={invitation} design={design} photos={photos} />
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Preview FAB */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <Button
          onClick={() => router.push(`/${invitationId}/preview`)}
          className="rounded-full w-14 h-14 bg-[#D4768A] hover:bg-[#C4667A] text-white shadow-lg"
        >
          <Eye className="w-6 h-6" />
        </Button>
      </div>
    </div>
  )
}

// Preview Frame Component
interface PreviewFrameProps {
  invitation: Invitation
  design?: InvitationDesign | null
  photos: InvitationPhoto[]
}

function PreviewFrame({ invitation, design, photos }: PreviewFrameProps) {
  // 프레임 내부 스크린 높이 계산: 667px - padding(24px) = 643px
  const screenHeight = 643

  return (
    <div className="flex flex-col items-center">
      <div className="text-sm text-gray-500 mb-4">미리보기</div>
      {/* Phone Frame */}
      <div className="relative">
        {/* Phone bezel */}
        <div className="w-[375px] h-[667px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
          {/* Screen */}
          <div className="w-full h-full bg-white rounded-[2.25rem] overflow-hidden">
            {/* Content - CSS variable for intro height */}
            <div
              className="w-full h-full overflow-y-auto scrollbar-mobile"
              style={{ '--preview-screen-height': `${screenHeight}px` } as React.CSSProperties}
            >
              <InvitationViewer
                invitation={invitation}
                design={design}
                photos={photos}
                isPreview={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
