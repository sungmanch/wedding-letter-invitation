'use client'

/**
 * Contact Modal - 연락하기 팝업
 *
 * 신랑측/신부측 탭으로 구분된 연락처 목록
 * 문자 보내기, 전화하기 기능 제공
 */

import { useState, useCallback, useMemo } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from '@/components/ui/modal'
import type { WeddingData } from '../../schema/types'

// ============================================
// Types
// ============================================

export interface ContactModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: WeddingData
}

interface ContactInfo {
  name: string
  relation: string
  phone?: string
}

type TabType = 'groom' | 'bride'

// ============================================
// Component
// ============================================

export function ContactModal({ open, onOpenChange, data }: ContactModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('groom')

  // 신랑측 연락처 목록
  const groomContacts = useMemo<ContactInfo[]>(() => {
    const contacts: ContactInfo[] = []

    // 신랑 본인
    if (data.couple?.groom?.name) {
      contacts.push({
        name: data.couple.groom.name,
        relation: '신랑',
        phone: data.couple.groom.phone,
      })
    }

    // 신랑 아버지
    if (data.parents?.groom?.father?.name) {
      contacts.push({
        name: data.parents.groom.father.name,
        relation: '신랑 아버지',
        phone: data.parents.groom.father.phone,
      })
    }

    // 신랑 어머니
    if (data.parents?.groom?.mother?.name) {
      contacts.push({
        name: data.parents.groom.mother.name,
        relation: '신랑 어머니',
        phone: data.parents.groom.mother.phone,
      })
    }

    return contacts
  }, [data])

  // 신부측 연락처 목록
  const brideContacts = useMemo<ContactInfo[]>(() => {
    const contacts: ContactInfo[] = []

    // 신부 본인
    if (data.couple?.bride?.name) {
      contacts.push({
        name: data.couple.bride.name,
        relation: '신부',
        phone: data.couple.bride.phone,
      })
    }

    // 신부 아버지
    if (data.parents?.bride?.father?.name) {
      contacts.push({
        name: data.parents.bride.father.name,
        relation: '신부 아버지',
        phone: data.parents.bride.father.phone,
      })
    }

    // 신부 어머니
    if (data.parents?.bride?.mother?.name) {
      contacts.push({
        name: data.parents.bride.mother.name,
        relation: '신부 어머니',
        phone: data.parents.bride.mother.phone,
      })
    }

    return contacts
  }, [data])

  // 현재 탭의 연락처
  const currentContacts = activeTab === 'groom' ? groomContacts : brideContacts

  // 전화하기
  const handleCall = useCallback((phone: string) => {
    window.location.href = `tel:${phone.replace(/[^0-9]/g, '')}`
  }, [])

  // 문자 보내기
  const handleSms = useCallback((phone: string) => {
    window.location.href = `sms:${phone.replace(/[^0-9]/g, '')}`
  }, [])

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-sm">
        <ModalHeader className="text-center pb-2">
          <ModalTitle className="text-xl font-semibold">축하 연락하기</ModalTitle>
          <ModalDescription className="text-sm text-gray-500">
            직접 축하의 마음을 전해보세요
          </ModalDescription>
        </ModalHeader>

        {/* 탭 네비게이션 */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('groom')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'groom'
                ? 'border-b-2 border-gray-900 text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            신랑에게
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bride')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'bride'
                ? 'border-b-2 border-gray-900 text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            신부에게
          </button>
        </div>

        {/* 연락처 목록 */}
        <div className="space-y-3">
          {currentContacts.map((contact, index) => (
            <ContactCard
              key={index}
              name={contact.name}
              relation={contact.relation}
              phone={contact.phone}
              onCall={handleCall}
              onSms={handleSms}
            />
          ))}

          {currentContacts.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">
              연락처 정보가 없습니다
            </div>
          )}
        </div>
      </ModalContent>
    </Modal>
  )
}

// ============================================
// Contact Card
// ============================================

interface ContactCardProps {
  name: string
  relation: string
  phone?: string
  onCall: (phone: string) => void
  onSms: (phone: string) => void
}

function ContactCard({ name, relation, phone, onCall, onSms }: ContactCardProps) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex justify-between items-start mb-3">
        <span className="font-medium text-gray-900">{name}</span>
        <span className="text-sm text-gray-500">{relation}</span>
      </div>

      {phone ? (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onCall(phone)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            전화하기
          </button>
          <button
            type="button"
            onClick={() => onSms(phone)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            문자 보내기
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center py-2.5 text-gray-400 text-sm">
          전화번호가 등록되지 않았습니다
        </div>
      )}
    </div>
  )
}

// ============================================
// Exports
// ============================================

export { ContactModal as default }
