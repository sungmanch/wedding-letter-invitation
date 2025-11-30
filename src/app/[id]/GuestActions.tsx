'use client'

import * as React from 'react'
import { Button } from '@/components/ui'
import { MessageForm } from '@/components/invitation'
import { createMessage } from '@/lib/actions/message'
import { X, MessageCircle, Check } from 'lucide-react'

interface GuestActionsProps {
  invitationId: string
}

export function GuestActions({ invitationId }: GuestActionsProps) {
  const [showMessageForm, setShowMessageForm] = React.useState(false)
  const [hasSubmitted, setHasSubmitted] = React.useState(false)
  const [showThankYou, setShowThankYou] = React.useState(false)

  // Check if user has already submitted a message
  React.useEffect(() => {
    const submitted = localStorage.getItem(`wedding_message_${invitationId}`)
    if (submitted) {
      setHasSubmitted(true)
    }
  }, [invitationId])

  const handleSubmitMessage = async (guestName: string, content: string) => {
    const result = await createMessage(invitationId, guestName, content)

    if (result.success) {
      // Mark as submitted in localStorage
      localStorage.setItem(`wedding_message_${invitationId}`, 'true')
      setHasSubmitted(true)
      setShowMessageForm(false)
      setShowThankYou(true)

      // Hide thank you message after 3 seconds
      setTimeout(() => setShowThankYou(false), 3000)
    }
  }

  return (
    <>
      {/* Floating Action Button */}
      {!showMessageForm && !hasSubmitted && (
        <div className="fixed bottom-6 right-6 z-30">
          <Button
            onClick={() => setShowMessageForm(true)}
            className="rounded-full w-14 h-14 p-0 bg-[#D4768A] hover:bg-[#c4657a] text-white shadow-lg"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Message Form Modal */}
      {showMessageForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
          <div className="w-full max-w-lg bg-white rounded-t-3xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-charcoal">
                축하 메시지 남기기
              </h2>
              <button
                onClick={() => setShowMessageForm(false)}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <MessageForm
              onSubmit={handleSubmitMessage}
              disabled={hasSubmitted}
            />
          </div>
        </div>
      )}

      {/* Thank You Toast */}
      {showThankYou && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-charcoal text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-fade-in">
          <Check className="h-5 w-5" />
          축하 메시지가 전달되었습니다 💌
        </div>
      )}

      {/* Already Submitted Indicator */}
      {hasSubmitted && !showThankYou && (
        <div className="fixed bottom-6 right-6 z-30">
          <div className="bg-gray-100 text-gray-500 px-4 py-2 rounded-full text-sm flex items-center gap-2">
            <Check className="h-4 w-4" />
            메시지 전송 완료
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
