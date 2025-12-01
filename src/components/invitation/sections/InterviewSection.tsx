'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, MessageCircle } from 'lucide-react'
import type { ColorPalette, FontSet } from '@/lib/themes/schema'
import type { InterviewSettings, InterviewQuestion } from '@/lib/types/invitation-design'

interface InterviewSectionProps {
  settings: InterviewSettings
  groomName: string
  brideName: string
  colors: ColorPalette
  fonts: FontSet
  className?: string
}

export function InterviewSection({
  settings,
  groomName,
  brideName,
  colors,
  fonts,
  className,
}: InterviewSectionProps) {
  const [expandedId, setExpandedId] = React.useState<string | null>(null)

  const enabledQuestions = settings.questions.filter(q => q.enabled)

  const renderCardMode = () => (
    <div className="space-y-4">
      {enabledQuestions.map((question) => (
        <div
          key={question.id}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <p
            className="font-medium text-center mb-4"
            style={{ color: colors.primary }}
          >
            Q. {question.question}
          </p>
          {settings.showBothAnswers ? (
            <div className="grid grid-cols-2 gap-4">
              {question.groomAnswer && (
                <div className="text-center">
                  <p className="text-xs text-gray-400 mb-2">{groomName}</p>
                  <p className="text-sm" style={{ color: colors.text }}>
                    {question.groomAnswer}
                  </p>
                </div>
              )}
              {question.brideAnswer && (
                <div className="text-center">
                  <p className="text-xs text-gray-400 mb-2">{brideName}</p>
                  <p className="text-sm" style={{ color: colors.text }}>
                    {question.brideAnswer}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-center" style={{ color: colors.text }}>
              {question.groomAnswer || question.brideAnswer}
            </p>
          )}
        </div>
      ))}
    </div>
  )

  const renderChatMode = () => (
    <div className="space-y-4">
      {enabledQuestions.map((question) => (
        <div key={question.id} className="space-y-3">
          {/* Question bubble */}
          <div className="flex justify-center">
            <div
              className="px-4 py-2 rounded-full text-sm font-medium"
              style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
            >
              {question.question}
            </div>
          </div>
          {/* Answers */}
          <div className="space-y-2">
            {question.groomAnswer && (
              <div className="flex justify-start">
                <div className="max-w-[80%]">
                  <p className="text-xs text-gray-400 mb-1">{groomName}</p>
                  <div
                    className="px-4 py-3 rounded-2xl rounded-bl-none text-sm"
                    style={{ backgroundColor: colors.surface || '#f3f4f6', color: colors.text }}
                  >
                    {question.groomAnswer}
                  </div>
                </div>
              </div>
            )}
            {question.brideAnswer && (
              <div className="flex justify-end">
                <div className="max-w-[80%] text-right">
                  <p className="text-xs text-gray-400 mb-1">{brideName}</p>
                  <div
                    className="px-4 py-3 rounded-2xl rounded-br-none text-sm"
                    style={{ backgroundColor: `${colors.primary}15`, color: colors.text }}
                  >
                    {question.brideAnswer}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )

  const renderAccordionMode = () => (
    <div className="space-y-2">
      {enabledQuestions.map((question) => (
        <div
          key={question.id}
          className="bg-white rounded-xl overflow-hidden shadow-sm"
        >
          <button
            className="w-full px-4 py-4 flex items-center justify-between text-left"
            onClick={() => setExpandedId(expandedId === question.id ? null : question.id)}
          >
            <span className="font-medium text-sm" style={{ color: colors.text }}>
              Q. {question.question}
            </span>
            <ChevronDown
              className={cn(
                'h-5 w-5 transition-transform',
                expandedId === question.id && 'rotate-180'
              )}
              style={{ color: colors.primary }}
            />
          </button>
          {expandedId === question.id && (
            <div className="px-4 pb-4 space-y-3">
              {question.groomAnswer && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">{groomName}</p>
                  <p className="text-sm" style={{ color: colors.text }}>
                    {question.groomAnswer}
                  </p>
                </div>
              )}
              {question.brideAnswer && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">{brideName}</p>
                  <p className="text-sm" style={{ color: colors.text }}>
                    {question.brideAnswer}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )

  const renderTimelineMode = () => (
    <div className="relative">
      {/* Timeline line */}
      <div
        className="absolute left-4 top-0 bottom-0 w-0.5"
        style={{ backgroundColor: `${colors.primary}30` }}
      />
      <div className="space-y-6">
        {enabledQuestions.map((question, index) => (
          <div key={question.id} className="relative pl-10">
            {/* Timeline dot */}
            <div
              className="absolute left-2.5 w-3 h-3 rounded-full"
              style={{ backgroundColor: colors.primary }}
            />
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p
                className="font-medium text-sm mb-3"
                style={{ color: colors.primary }}
              >
                {question.question}
              </p>
              {settings.showBothAnswers ? (
                <div className="space-y-2">
                  {question.groomAnswer && (
                    <p className="text-sm" style={{ color: colors.text }}>
                      <span className="text-gray-400">{groomName}:</span> {question.groomAnswer}
                    </p>
                  )}
                  {question.brideAnswer && (
                    <p className="text-sm" style={{ color: colors.text }}>
                      <span className="text-gray-400">{brideName}:</span> {question.brideAnswer}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm" style={{ color: colors.text }}>
                  {question.groomAnswer || question.brideAnswer}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  if (enabledQuestions.length === 0) return null

  return (
    <section
      className={cn('py-8 px-6', className)}
      style={{ backgroundColor: colors.background }}
    >
      <div className="flex items-center justify-center gap-2 mb-6">
        <MessageCircle className="h-5 w-5" style={{ color: colors.primary }} />
        <h2
          className="text-lg font-medium"
          style={{ fontFamily: fonts.title.family, color: colors.text }}
        >
          Wedding Interview
        </h2>
      </div>
      {settings.displayMode === 'card' && renderCardMode()}
      {settings.displayMode === 'chat' && renderChatMode()}
      {settings.displayMode === 'accordion' && renderAccordionMode()}
      {settings.displayMode === 'timeline' && renderTimelineMode()}
    </section>
  )
}
