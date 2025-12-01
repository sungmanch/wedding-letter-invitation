'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { useEditContext } from './EditContext'
import { SectionEditor } from './components/SectionEditor'
import { StyleEditor } from './components/StyleEditor'
import {
  User,
  Calendar,
  MapPin,
  Users,
  Phone,
  CreditCard,
  Palette,
  Layers,
} from 'lucide-react'

export function EditorForm() {
  return (
    <div className="divide-y divide-gray-100">
      <BasicInfoSection />
      <WeddingInfoSection />
      <VenueSection />
      <ParentsSection />
      <ContactSection />
      <AccountSection />
      <StyleSettingsSection />
      <SectionManagementSection />
    </div>
  )
}

// Section Header Component
function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon className="w-5 h-5 text-[#D4768A]" />
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    </div>
  )
}

// Basic Info Section (신랑/신부 이름)
function BasicInfoSection() {
  const { invitation, updateField } = useEditContext()

  return (
    <section className="p-6">
      <SectionHeader icon={User} title="기본 정보" />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="신랑 이름"
          value={invitation.groomName}
          onChange={(e) => updateField('groomName', e.target.value)}
          placeholder="신랑 이름"
        />
        <Input
          label="신부 이름"
          value={invitation.brideName}
          onChange={(e) => updateField('brideName', e.target.value)}
          placeholder="신부 이름"
        />
      </div>
    </section>
  )
}

// Wedding Info Section (날짜, 시간)
function WeddingInfoSection() {
  const { invitation, updateField } = useEditContext()

  return (
    <section className="p-6">
      <SectionHeader icon={Calendar} title="예식 일시" />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="예식 날짜"
          type="date"
          value={invitation.weddingDate}
          onChange={(e) => updateField('weddingDate', e.target.value)}
        />
        <Input
          label="예식 시간"
          type="time"
          value={invitation.weddingTime}
          onChange={(e) => updateField('weddingTime', e.target.value)}
        />
      </div>
    </section>
  )
}

// Venue Section (장소)
function VenueSection() {
  const { invitation, updateField } = useEditContext()

  return (
    <section className="p-6">
      <SectionHeader icon={MapPin} title="예식 장소" />
      <div className="space-y-4">
        <Input
          label="예식장 이름"
          value={invitation.venueName}
          onChange={(e) => updateField('venueName', e.target.value)}
          placeholder="예: 더채플앳청담"
        />
        <Input
          label="예식장 주소"
          value={invitation.venueAddress}
          onChange={(e) => updateField('venueAddress', e.target.value)}
          placeholder="예: 서울시 강남구 청담동 123-45"
        />
        <Input
          label="상세 위치 (선택)"
          value={invitation.venueDetail || ''}
          onChange={(e) => updateField('venueDetail', e.target.value)}
          placeholder="예: 3층 그랜드볼룸"
        />
      </div>
    </section>
  )
}

// Parents Section (혼주 정보)
function ParentsSection() {
  const { invitation, updateField } = useEditContext()

  return (
    <section className="p-6">
      <SectionHeader icon={Users} title="혼주 정보" />
      <div className="space-y-6">
        {/* Groom Side */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">신랑측</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="아버지 성함"
              value={invitation.groomFatherName || ''}
              onChange={(e) => updateField('groomFatherName', e.target.value)}
              placeholder="성함"
            />
            <Input
              label="어머니 성함"
              value={invitation.groomMotherName || ''}
              onChange={(e) => updateField('groomMotherName', e.target.value)}
              placeholder="성함"
            />
          </div>
        </div>

        {/* Bride Side */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">신부측</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="아버지 성함"
              value={invitation.brideFatherName || ''}
              onChange={(e) => updateField('brideFatherName', e.target.value)}
              placeholder="성함"
            />
            <Input
              label="어머니 성함"
              value={invitation.brideMotherName || ''}
              onChange={(e) => updateField('brideMotherName', e.target.value)}
              placeholder="성함"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

// Contact Section (연락처)
function ContactSection() {
  const { invitation, updateField } = useEditContext()

  return (
    <section className="p-6">
      <SectionHeader icon={Phone} title="연락처" />
      <div className="space-y-6">
        {/* Groom Side */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">신랑측</h3>
          <div className="space-y-4">
            <Input
              label="신랑 연락처"
              type="tel"
              value={invitation.groomPhone || ''}
              onChange={(e) => updateField('groomPhone', e.target.value)}
              placeholder="010-0000-0000"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="아버지 연락처"
                type="tel"
                value={invitation.groomFatherPhone || ''}
                onChange={(e) => updateField('groomFatherPhone', e.target.value)}
                placeholder="010-0000-0000"
              />
              <Input
                label="어머니 연락처"
                type="tel"
                value={invitation.groomMotherPhone || ''}
                onChange={(e) => updateField('groomMotherPhone', e.target.value)}
                placeholder="010-0000-0000"
              />
            </div>
          </div>
        </div>

        {/* Bride Side */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">신부측</h3>
          <div className="space-y-4">
            <Input
              label="신부 연락처"
              type="tel"
              value={invitation.bridePhone || ''}
              onChange={(e) => updateField('bridePhone', e.target.value)}
              placeholder="010-0000-0000"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="아버지 연락처"
                type="tel"
                value={invitation.brideFatherPhone || ''}
                onChange={(e) => updateField('brideFatherPhone', e.target.value)}
                placeholder="010-0000-0000"
              />
              <Input
                label="어머니 연락처"
                type="tel"
                value={invitation.brideMotherPhone || ''}
                onChange={(e) => updateField('brideMotherPhone', e.target.value)}
                placeholder="010-0000-0000"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Account Section (계좌 정보)
function AccountSection() {
  const { invitation, updateField } = useEditContext()

  return (
    <section className="p-6">
      <SectionHeader icon={CreditCard} title="축의금 계좌" />
      <div className="space-y-6">
        {/* Groom Side */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">신랑측</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="은행명"
                value={invitation.groomBank || ''}
                onChange={(e) => updateField('groomBank', e.target.value)}
                placeholder="예: 신한은행"
              />
              <Input
                label="예금주"
                value={invitation.groomAccountHolder || ''}
                onChange={(e) => updateField('groomAccountHolder', e.target.value)}
                placeholder="예금주명"
              />
            </div>
            <Input
              label="계좌번호"
              value={invitation.groomAccount || ''}
              onChange={(e) => updateField('groomAccount', e.target.value)}
              placeholder="계좌번호 (-없이 입력)"
            />
          </div>
        </div>

        {/* Bride Side */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">신부측</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="은행명"
                value={invitation.brideBank || ''}
                onChange={(e) => updateField('brideBank', e.target.value)}
                placeholder="예: 신한은행"
              />
              <Input
                label="예금주"
                value={invitation.brideAccountHolder || ''}
                onChange={(e) => updateField('brideAccountHolder', e.target.value)}
                placeholder="예금주명"
              />
            </div>
            <Input
              label="계좌번호"
              value={invitation.brideAccount || ''}
              onChange={(e) => updateField('brideAccount', e.target.value)}
              placeholder="계좌번호 (-없이 입력)"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

// Style Settings Section (스타일 설정)
function StyleSettingsSection() {
  const { colors, fonts, updateColors, updateFonts } = useEditContext()

  return (
    <section className="p-6">
      <SectionHeader icon={Palette} title="스타일 설정" />
      <p className="text-sm text-gray-500 mb-4">
        청첩장의 색상과 폰트를 설정합니다.
      </p>
      <StyleEditor
        colors={colors}
        fonts={fonts}
        onColorsChange={updateColors}
        onFontsChange={updateFonts}
      />
    </section>
  )
}

// Section Management Section (섹션 관리)
function SectionManagementSection() {
  const { sections, updateSections } = useEditContext()

  return (
    <section className="p-6">
      <SectionHeader icon={Layers} title="섹션 관리" />
      <p className="text-sm text-gray-500 mb-4">
        드래그하여 순서를 변경하고, 토글로 표시/숨기기를 설정할 수 있습니다.
      </p>
      <SectionEditor sections={sections} onSectionsChange={updateSections} />
    </section>
  )
}
