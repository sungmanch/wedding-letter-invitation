'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Heart, Calendar } from 'lucide-react'
import type { ColorPalette, FontSet } from '@/lib/themes/schema'
import type { TimelineSettings, TimelineEvent } from '@/lib/types/invitation-design'

interface TimelineSectionProps {
  settings: TimelineSettings
  colors: ColorPalette
  fonts: FontSet
  className?: string
}

export function TimelineSection({
  settings,
  colors,
  fonts,
  className,
}: TimelineSectionProps) {
  const events = settings.events || []

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getConnectorStyle = () => {
    switch (settings.connectorStyle) {
      case 'dashed':
        return 'border-dashed'
      case 'dotted':
        return 'border-dotted'
      case 'line':
      default:
        return 'border-solid'
    }
  }

  const renderVerticalTimeline = () => (
    <div className="relative">
      {/* Timeline line */}
      {settings.showConnectors && (
        <div
          className={cn('absolute left-4 top-0 bottom-0 w-0.5 border-l-2', getConnectorStyle())}
          style={{ borderColor: `${colors.primary}40` }}
        />
      )}
      <div className="space-y-6">
        {events.map((event, index) => (
          <div key={event.id} className="relative pl-12">
            {/* Timeline dot */}
            <div
              className="absolute left-2 w-4 h-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <Heart className="h-2 w-2 text-white fill-white" />
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              {event.date && (
                <p
                  className="text-xs mb-2 flex items-center gap-1"
                  style={{ color: colors.primary }}
                >
                  <Calendar className="h-3 w-3" />
                  {formatDate(event.date)}
                </p>
              )}
              <h3
                className="font-medium mb-2"
                style={{ fontFamily: fonts.title.family, color: colors.text }}
              >
                {event.title}
              </h3>
              {event.description && (
                <p className="text-sm text-gray-600">{event.description}</p>
              )}
              {event.imageUrl && (
                <div className="relative w-full aspect-[4/3] mt-3 rounded-lg overflow-hidden">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderHorizontalTimeline = () => (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-4 px-2" style={{ width: 'max-content' }}>
        {events.map((event, index) => (
          <div key={event.id} className="relative w-64 flex-shrink-0">
            {/* Connector line */}
            {settings.showConnectors && index < events.length - 1 && (
              <div
                className={cn(
                  'absolute top-1/2 -right-2 w-4 border-t-2',
                  getConnectorStyle()
                )}
                style={{ borderColor: `${colors.primary}40` }}
              />
            )}
            <div className="bg-white rounded-xl p-4 shadow-sm h-full">
              {event.date && (
                <p
                  className="text-xs mb-2"
                  style={{ color: colors.primary }}
                >
                  {formatDate(event.date)}
                </p>
              )}
              {event.imageUrl && (
                <div className="relative w-full aspect-square mb-3 rounded-lg overflow-hidden">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <h3
                className="font-medium text-sm mb-1"
                style={{ fontFamily: fonts.title.family, color: colors.text }}
              >
                {event.title}
              </h3>
              {event.description && (
                <p className="text-xs text-gray-600 line-clamp-2">
                  {event.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderCardTimeline = () => (
    <div className="grid grid-cols-1 gap-4">
      {events.map((event, index) => (
        <div
          key={event.id}
          className="bg-white rounded-xl overflow-hidden shadow-sm"
        >
          {event.imageUrl && (
            <div className="relative w-full aspect-[16/9]">
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-cover"
              />
              {event.date && (
                <div
                  className="absolute bottom-2 left-2 px-2 py-1 rounded text-xs text-white"
                  style={{ backgroundColor: colors.primary }}
                >
                  {formatDate(event.date)}
                </div>
              )}
            </div>
          )}
          <div className="p-4">
            {!event.imageUrl && event.date && (
              <p
                className="text-xs mb-2"
                style={{ color: colors.primary }}
              >
                {formatDate(event.date)}
              </p>
            )}
            <h3
              className="font-medium mb-2"
              style={{ fontFamily: fonts.title.family, color: colors.text }}
            >
              {event.title}
            </h3>
            {event.description && (
              <p className="text-sm text-gray-600">{event.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )

  if (events.length === 0) return null

  return (
    <section
      className={cn('py-8 px-6', className)}
      style={{ backgroundColor: colors.background }}
    >
      <h2
        className="text-lg font-medium mb-6 text-center"
        style={{ fontFamily: fonts.title.family, color: colors.text }}
      >
        Our Story
      </h2>
      {settings.displayMode === 'vertical' && renderVerticalTimeline()}
      {settings.displayMode === 'horizontal' && renderHorizontalTimeline()}
      {settings.displayMode === 'cards' && renderCardTimeline()}
    </section>
  )
}
