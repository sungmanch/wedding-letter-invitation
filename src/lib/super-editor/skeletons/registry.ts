/**
 * Super Editor - Skeleton Registry
 * 모든 섹션 스켈레톤 등록 및 조회
 */

import type { SectionSkeleton, SectionType, SkeletonVariant } from './types'
import {
  introSkeleton,
  greetingSkeleton,
  contactSkeleton,
  venueSkeleton,
  dateSkeleton,
  gallerySkeleton,
  parentsSkeleton,
  accountsSkeleton,
  guestbookSkeleton,
  musicSkeleton,
  photoboothSkeleton,
  invitationSkeleton,
  rsvpSkeleton,
  noticeSkeleton,
} from './sections'

// ============================================
// Registry
// ============================================

const skeletonRegistry: Record<SectionType, SectionSkeleton> = {
  intro: introSkeleton,
  greeting: greetingSkeleton,
  contact: contactSkeleton,
  venue: venueSkeleton,
  date: dateSkeleton,
  gallery: gallerySkeleton,
  parents: parentsSkeleton,
  accounts: accountsSkeleton,
  guestbook: guestbookSkeleton,
  music: musicSkeleton,
  photobooth: photoboothSkeleton,
  invitation: invitationSkeleton,
  rsvp: rsvpSkeleton,
  notice: noticeSkeleton,
}

// ============================================
// Registry Functions
// ============================================

/**
 * 섹션 타입으로 스켈레톤 조회
 */
export function getSkeleton(sectionType: SectionType): SectionSkeleton | undefined {
  return skeletonRegistry[sectionType]
}

/**
 * 모든 스켈레톤 목록
 */
export function getAllSkeletons(): SectionSkeleton[] {
  return Object.values(skeletonRegistry)
}

/**
 * 특정 섹션의 variant 조회
 */
export function getVariant(sectionType: SectionType, variantId: string): SkeletonVariant | undefined {
  const skeleton = skeletonRegistry[sectionType]
  if (!skeleton) return undefined
  return skeleton.variants.find((v) => v.id === variantId)
}

/**
 * 특정 섹션의 기본 variant 조회
 */
export function getDefaultVariant(sectionType: SectionType): SkeletonVariant | undefined {
  const skeleton = skeletonRegistry[sectionType]
  if (!skeleton) return undefined
  return skeleton.variants.find((v) => v.id === skeleton.defaultVariant)
}

/**
 * 태그로 variant 필터링
 */
export function getVariantsByTag(sectionType: SectionType, tag: string): SkeletonVariant[] {
  const skeleton = skeletonRegistry[sectionType]
  if (!skeleton) return []
  return skeleton.variants.filter((v) => v.tags.includes(tag))
}

/**
 * 모든 섹션 타입 목록
 */
export function getAllSectionTypes(): SectionType[] {
  return Object.keys(skeletonRegistry) as SectionType[]
}

/**
 * 섹션 순서 (intro 제외, 기본 순서)
 */
export const DEFAULT_SECTION_ORDER: SectionType[] = [
  'greeting',
  'contact',
  'venue',
  'date',
  'gallery',
  'parents',
  'accounts',
  'guestbook',
  'invitation',
  'rsvp',
  'notice',
]

/**
 * 기본 섹션 활성화 상태
 */
export const DEFAULT_SECTION_ENABLED: Record<SectionType, boolean> = {
  intro: true, // 항상 활성화
  greeting: true,
  contact: true,
  venue: true,
  date: true,
  gallery: true,
  parents: true,
  accounts: true,
  guestbook: true,
  music: true,
  photobooth: false, // 포토부스는 기본 비활성화
  invitation: true, // RSVP 활성화
  rsvp: false,
  notice: false,
}

// ============================================
// Statistics
// ============================================

export const skeletonStats = {
  totalSections: Object.keys(skeletonRegistry).length,
  totalVariants: Object.values(skeletonRegistry).reduce((sum, s) => sum + s.variants.length, 0),
  sectionsWithMultipleVariants: Object.values(skeletonRegistry).filter((s) => s.variants.length > 1).length,
}

// 14개 섹션 확인 (intro, greeting, contact, venue, date, gallery, parents, accounts, guestbook, music, photobooth, invitation, rsvp, notice)
console.assert(skeletonStats.totalSections === 14, `Expected 14 sections, got ${skeletonStats.totalSections}`)
