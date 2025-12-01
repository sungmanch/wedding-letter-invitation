'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  GripVertical,
  Eye,
  EyeOff,
  ChevronDown,
  Image,
  MessageSquare,
  Calendar,
  MapPin,
  Users,
  Phone,
  CreditCard,
  Heart,
  Video,
  MessageCircle,
  Clock,
  Timer,
  Quote,
  Car,
  Bell,
  Camera,
  Sparkles,
} from 'lucide-react'
import type { SectionSetting, ExtendedSectionType } from '@/lib/types/invitation-design'

interface SectionEditorProps {
  sections: SectionSetting[]
  onSectionsChange: (sections: SectionSetting[]) => void
}

// 섹션 타입별 아이콘 및 라벨
const SECTION_META: Record<ExtendedSectionType, { icon: React.ElementType; label: string; description?: string }> = {
  hero: { icon: Image, label: '메인 이미지', description: '신랑신부 이름과 D-Day' },
  greeting: { icon: MessageSquare, label: '인사말', description: '결혼 인사 문구' },
  calendar: { icon: Calendar, label: '달력', description: '예식 날짜와 시간' },
  gallery: { icon: Image, label: '갤러리', description: '웨딩 사진 모음' },
  location: { icon: MapPin, label: '오시는 길', description: '예식장 위치 안내' },
  parents: { icon: Users, label: '혼주 정보', description: '양가 부모님 소개' },
  contact: { icon: Phone, label: '연락처', description: '연락처 정보' },
  account: { icon: CreditCard, label: '축의금', description: '계좌 정보' },
  message: { icon: MessageCircle, label: '방명록', description: '축하 메시지' },
  rsvp: { icon: Bell, label: '참석 여부', description: 'RSVP 응답' },
  closing: { icon: Sparkles, label: '마무리', description: '청첩장 푸터' },
  // 확장 섹션
  loading: { icon: Clock, label: '로딩 화면' },
  quote: { icon: Quote, label: '글귀', description: '명언이나 문구' },
  profile: { icon: Users, label: '프로필', description: '신랑신부 소개' },
  'parents-contact': { icon: Phone, label: '혼주 연락처' },
  timeline: { icon: Heart, label: '타임라인', description: '우리의 이야기' },
  video: { icon: Video, label: '영상', description: '웨딩 영상' },
  interview: { icon: MessageCircle, label: '인터뷰', description: '신랑신부 Q&A' },
  transport: { icon: Car, label: '교통수단', description: '교통 안내' },
  notice: { icon: Bell, label: '안내사항' },
  announcement: { icon: Bell, label: '안내문' },
  'flower-gift': { icon: Sparkles, label: '화환 보내기' },
  'together-time': { icon: Clock, label: '함께한 시간' },
  dday: { icon: Timer, label: 'D-DAY', description: '카운트다운' },
  'guest-snap': { icon: Camera, label: '게스트스냅', description: '사진 공유' },
  ending: { icon: Sparkles, label: '엔딩', description: '엔딩 크레딧' },
}

export function SectionEditor({ sections, onSectionsChange }: SectionEditorProps) {
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null)
  const [expandedId, setExpandedId] = React.useState<string | null>(null)

  // 섹션 활성화/비활성화 토글
  const toggleSection = (sectionId: string) => {
    const updated = sections.map(section =>
      section.id === sectionId
        ? { ...section, enabled: !section.enabled }
        : section
    )
    onSectionsChange(updated)
  }

  // 드래그 시작
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', index.toString())
  }

  // 드래그 오버
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newSections = [...sections]
    const [removed] = newSections.splice(draggedIndex, 1)
    newSections.splice(index, 0, removed)

    // order 업데이트
    const reordered = newSections.map((section, i) => ({
      ...section,
      order: i,
    }))

    onSectionsChange(reordered)
    setDraggedIndex(index)
  }

  // 드래그 종료
  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  // 정렬된 섹션
  const sortedSections = [...sections].sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-2">
      {sortedSections.map((section, index) => {
        const meta = SECTION_META[section.type] || { icon: Sparkles, label: section.type }
        const Icon = meta.icon
        const isExpanded = expandedId === section.id

        return (
          <div
            key={section.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={cn(
              'bg-white rounded-xl border transition-all',
              section.enabled ? 'border-gray-200' : 'border-gray-100 opacity-60',
              draggedIndex === index && 'ring-2 ring-[#D4768A] ring-offset-2'
            )}
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-3">
              {/* Drag Handle */}
              <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                <GripVertical className="h-5 w-5" />
              </div>

              {/* Icon */}
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center',
                  section.enabled ? 'bg-[#D4768A]/10' : 'bg-gray-100'
                )}
              >
                <Icon className={cn('h-4 w-4', section.enabled ? 'text-[#D4768A]' : 'text-gray-400')} />
              </div>

              {/* Label */}
              <div className="flex-1">
                <p className={cn('font-medium text-sm', !section.enabled && 'text-gray-400')}>
                  {meta.label}
                </p>
                {meta.description && (
                  <p className="text-xs text-gray-400">{meta.description}</p>
                )}
              </div>

              {/* Toggle Button */}
              <button
                onClick={() => toggleSection(section.id)}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  section.enabled
                    ? 'bg-[#D4768A]/10 text-[#D4768A] hover:bg-[#D4768A]/20'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                )}
              >
                {section.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>

              {/* Expand Button (for settings) */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : section.id)}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <ChevronDown className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-180')} />
              </button>
            </div>

            {/* Expanded Settings */}
            {isExpanded && (
              <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                <SectionSettings section={section} onUpdate={(updated) => {
                  const newSections = sections.map(s => s.id === updated.id ? updated : s)
                  onSectionsChange(newSections)
                }} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// 섹션별 세부 설정
function SectionSettings({
  section,
  onUpdate,
}: {
  section: SectionSetting
  onUpdate: (section: SectionSetting) => void
}) {
  const settings = section.settings as Record<string, unknown>

  const updateSetting = (key: string, value: unknown) => {
    onUpdate({
      ...section,
      settings: { ...section.settings, [key]: value },
    })
  }

  // 섹션 타입별 설정 UI
  switch (section.type) {
    case 'gallery':
      return (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-2">표시 모드</label>
            <div className="flex gap-2">
              {(['carousel', 'grid', 'masonry', 'fullscreen'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => updateSetting('displayMode', mode)}
                  className={cn(
                    'px-3 py-1.5 text-xs rounded-lg border transition-colors',
                    settings.displayMode === mode
                      ? 'bg-[#D4768A] text-white border-[#D4768A]'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  {mode === 'carousel' && '슬라이드'}
                  {mode === 'grid' && '그리드'}
                  {mode === 'masonry' && '메이슨리'}
                  {mode === 'fullscreen' && '전체화면'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )

    case 'calendar':
      return (
        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={Boolean(settings.showDday ?? true)}
              onChange={(e) => updateSetting('showDday', e.target.checked)}
              className="rounded border-gray-300 text-[#D4768A] focus:ring-[#D4768A]"
            />
            <span className="text-sm text-gray-700">D-Day 표시</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={Boolean(settings.showLunarDate ?? false)}
              onChange={(e) => updateSetting('showLunarDate', e.target.checked)}
              className="rounded border-gray-300 text-[#D4768A] focus:ring-[#D4768A]"
            />
            <span className="text-sm text-gray-700">음력 날짜 표시</span>
          </label>
        </div>
      )

    case 'dday':
      return (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-2">스타일</label>
            <div className="flex gap-2 flex-wrap">
              {(['flip', 'digital', 'analog', 'text'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => updateSetting('style', style)}
                  className={cn(
                    'px-3 py-1.5 text-xs rounded-lg border transition-colors',
                    settings.style === style
                      ? 'bg-[#D4768A] text-white border-[#D4768A]'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  {style === 'flip' && '플립'}
                  {style === 'digital' && '디지털'}
                  {style === 'analog' && '아날로그'}
                  {style === 'text' && '텍스트'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(settings.showDays ?? true)}
                onChange={(e) => updateSetting('showDays', e.target.checked)}
                className="rounded border-gray-300 text-[#D4768A] focus:ring-[#D4768A]"
              />
              <span className="text-sm text-gray-700">일</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(settings.showHours ?? true)}
                onChange={(e) => updateSetting('showHours', e.target.checked)}
                className="rounded border-gray-300 text-[#D4768A] focus:ring-[#D4768A]"
              />
              <span className="text-sm text-gray-700">시간</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(settings.showMinutes ?? true)}
                onChange={(e) => updateSetting('showMinutes', e.target.checked)}
                className="rounded border-gray-300 text-[#D4768A] focus:ring-[#D4768A]"
              />
              <span className="text-sm text-gray-700">분</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(settings.showSeconds ?? false)}
                onChange={(e) => updateSetting('showSeconds', e.target.checked)}
                className="rounded border-gray-300 text-[#D4768A] focus:ring-[#D4768A]"
              />
              <span className="text-sm text-gray-700">초</span>
            </label>
          </div>
        </div>
      )

    case 'interview':
      return (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-2">표시 모드</label>
            <div className="flex gap-2 flex-wrap">
              {(['card', 'chat', 'accordion', 'timeline'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => updateSetting('displayMode', mode)}
                  className={cn(
                    'px-3 py-1.5 text-xs rounded-lg border transition-colors',
                    settings.displayMode === mode
                      ? 'bg-[#D4768A] text-white border-[#D4768A]'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  {mode === 'card' && '카드'}
                  {mode === 'chat' && '채팅'}
                  {mode === 'accordion' && '아코디언'}
                  {mode === 'timeline' && '타임라인'}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={Boolean(settings.showBothAnswers ?? true)}
              onChange={(e) => updateSetting('showBothAnswers', e.target.checked)}
              className="rounded border-gray-300 text-[#D4768A] focus:ring-[#D4768A]"
            />
            <span className="text-sm text-gray-700">신랑/신부 답변 모두 표시</span>
          </label>
        </div>
      )

    case 'timeline':
      return (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-2">레이아웃</label>
            <div className="flex gap-2 flex-wrap">
              {(['vertical', 'horizontal', 'cards'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => updateSetting('displayMode', mode)}
                  className={cn(
                    'px-3 py-1.5 text-xs rounded-lg border transition-colors',
                    settings.displayMode === mode
                      ? 'bg-[#D4768A] text-white border-[#D4768A]'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  {mode === 'vertical' && '세로'}
                  {mode === 'horizontal' && '가로'}
                  {mode === 'cards' && '카드'}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={Boolean(settings.showConnectors ?? true)}
              onChange={(e) => updateSetting('showConnectors', e.target.checked)}
              className="rounded border-gray-300 text-[#D4768A] focus:ring-[#D4768A]"
            />
            <span className="text-sm text-gray-700">연결선 표시</span>
          </label>
        </div>
      )

    case 'video':
      return (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-2">비율</label>
            <div className="flex gap-2">
              {(['16:9', '4:3', '1:1', '9:16'] as const).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => updateSetting('aspectRatio', ratio)}
                  className={cn(
                    'px-3 py-1.5 text-xs rounded-lg border transition-colors',
                    settings.aspectRatio === ratio
                      ? 'bg-[#D4768A] text-white border-[#D4768A]'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-4 flex-wrap">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(settings.autoPlay ?? false)}
                onChange={(e) => updateSetting('autoPlay', e.target.checked)}
                className="rounded border-gray-300 text-[#D4768A] focus:ring-[#D4768A]"
              />
              <span className="text-sm text-gray-700">자동재생</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(settings.muted ?? true)}
                onChange={(e) => updateSetting('muted', e.target.checked)}
                className="rounded border-gray-300 text-[#D4768A] focus:ring-[#D4768A]"
              />
              <span className="text-sm text-gray-700">음소거</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(settings.loop ?? false)}
                onChange={(e) => updateSetting('loop', e.target.checked)}
                className="rounded border-gray-300 text-[#D4768A] focus:ring-[#D4768A]"
              />
              <span className="text-sm text-gray-700">반복</span>
            </label>
          </div>
        </div>
      )

    default:
      return (
        <p className="text-sm text-gray-400">이 섹션에는 추가 설정이 없습니다.</p>
      )
  }
}
