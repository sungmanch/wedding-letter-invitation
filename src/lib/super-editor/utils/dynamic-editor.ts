/**
 * 동적 에디터 필드 생성
 * skeleton의 slots를 기반으로 EditorSection을 자동 생성
 */

import type { EditorSection, EditorField } from '../schema/editor'
import type { SectionType, DataSlot } from '../skeletons/types'
import { getSkeleton, getDefaultVariant } from '../skeletons/registry'

// 데이터 경로별 그룹 정의
const DATA_PATH_GROUPS: Record<string, { sectionId: string; sectionTitle: string; order: number }> = {
  'couple.groom': { sectionId: 'couple', sectionTitle: '신랑/신부 정보', order: 1 },
  'couple.bride': { sectionId: 'couple', sectionTitle: '신랑/신부 정보', order: 1 },
  'wedding': { sectionId: 'wedding', sectionTitle: '예식 정보', order: 2 },
  'venue': { sectionId: 'venue', sectionTitle: '예식장 정보', order: 3 },
  'photos': { sectionId: 'photos', sectionTitle: '사진', order: 4 },
  'greeting': { sectionId: 'greeting', sectionTitle: '인사말', order: 5 },
  'parents': { sectionId: 'parents', sectionTitle: '혼주 정보', order: 6 },
  'accounts': { sectionId: 'accounts', sectionTitle: '축의금 계좌', order: 7 },
}

// slot type → EditorField type 매핑
const SLOT_TYPE_TO_FIELD_TYPE: Record<string, EditorField['type']> = {
  'text': 'text',
  'image': 'image',
  'date': 'date',
  'time': 'time',
  'textarea': 'textarea',
  'phone': 'phone',
  'url': 'url',
  'number': 'number',
  'location': 'location',
  'imageList': 'imageList',
  'personList': 'personList',
  'accountList': 'repeater',
}

/**
 * 데이터 경로에서 그룹 정보 찾기
 */
function getGroupForPath(path: string): { sectionId: string; sectionTitle: string; order: number } {
  // 정확한 매칭 먼저
  for (const [prefix, group] of Object.entries(DATA_PATH_GROUPS)) {
    if (path.startsWith(prefix)) {
      return group
    }
  }
  // 기본값
  return { sectionId: 'other', sectionTitle: '기타', order: 99 }
}

/**
 * DataSlot을 EditorField로 변환
 */
function slotToField(slot: DataSlot, sectionType: SectionType, fieldOrder: number): EditorField {
  const fieldType = SLOT_TYPE_TO_FIELD_TYPE[slot.type] || 'text'

  const baseField = {
    id: `${sectionType}-${slot.id}`,
    type: fieldType,
    label: slot.description,
    dataPath: slot.path,
    required: slot.required || false,
    order: fieldOrder,
  }

  // 타입별 추가 속성
  switch (fieldType) {
    case 'textarea':
      return { ...baseField, type: 'textarea', rows: 4 } as EditorField
    case 'image':
      return { ...baseField, type: 'image', aspectRatio: '3:4' } as EditorField
    case 'imageList':
      return { ...baseField, type: 'imageList', maxItems: 20 } as EditorField
    default:
      return baseField as EditorField
  }
}

/**
 * 활성화된 섹션들의 slots를 수집하고 중복 제거하여 EditorSection 배열 생성
 */
export function generateEditorSections(
  enabledSections: SectionType[],
  variantSelections?: Record<SectionType, string>
): EditorSection[] {
  // 1. 모든 활성화된 섹션의 slots 수집
  const allSlots: Array<{ slot: DataSlot; sectionType: SectionType }> = []

  for (const sectionType of enabledSections) {
    const variantId = variantSelections?.[sectionType]
    let variant = variantId ? getSkeleton(sectionType)?.variants.find(v => v.id === variantId) : undefined
    if (!variant) {
      variant = getDefaultVariant(sectionType)
    }

    if (variant?.slots) {
      for (const slot of variant.slots) {
        allSlots.push({ slot, sectionType })
      }
    }
  }

  // 2. path 기준으로 중복 제거 (첫 번째 것만 유지)
  const uniqueSlots = new Map<string, { slot: DataSlot; sectionType: SectionType }>()
  for (const item of allSlots) {
    if (!uniqueSlots.has(item.slot.path)) {
      uniqueSlots.set(item.slot.path, item)
    }
  }

  // 3. 그룹별로 분류
  const groupedSlots = new Map<string, Array<{ slot: DataSlot; sectionType: SectionType }>>()

  for (const [, item] of uniqueSlots) {
    const group = getGroupForPath(item.slot.path)
    if (!groupedSlots.has(group.sectionId)) {
      groupedSlots.set(group.sectionId, [])
    }
    groupedSlots.get(group.sectionId)!.push(item)
  }

  // 4. EditorSection 배열 생성
  const sections: EditorSection[] = []

  for (const [sectionId, items] of groupedSlots) {
    const group = getGroupForPath(items[0].slot.path)

    const fields: EditorField[] = items.map((item, index) =>
      slotToField(item.slot, item.sectionType, index)
    )

    sections.push({
      id: sectionId,
      title: group.sectionTitle,
      order: group.order,
      fields,
    })
  }

  // 5. order 기준 정렬
  sections.sort((a, b) => a.order - b.order)

  return sections
}

/**
 * 기본 에디터 섹션 생성 (모든 섹션 활성화 기준)
 */
export function getDefaultEditorSections(): EditorSection[] {
  const allSections: SectionType[] = ['intro', 'venue', 'date', 'gallery', 'parents', 'accounts', 'guestbook']
  return generateEditorSections(allSections)
}
