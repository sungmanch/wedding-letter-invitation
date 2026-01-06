/**
 * Block Type Labels
 *
 * 블록 타입의 한글 레이블 매핑
 * EditClient, preset-sidebar, RequestPresetModal 등에서 공통 사용
 */

import type { BlockType } from '../schema/types'

/**
 * 블록 타입별 한글 레이블
 */
export const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  // 핵심 섹션
  hero: '대표사진',
  'greeting-parents': '인사말/혼주',
  profile: '프로필',
  interview: '인터뷰',
  calendar: '예식일시',
  gallery: '갤러리',
  rsvp: '참석 여부',
  location: '오시는길',
  notice: '공지사항',
  account: '축의금',
  message: '방명록',
  wreath: '화환 안내',
  ending: '엔딩',
  // 오버레이/모달
  contact: '연락처',
  // 기타 기능
  music: '음악',
  loading: '로딩',
  custom: '커스텀',
}

/**
 * 블록 타입 레이블 가져오기 (fallback 포함)
 */
export function getBlockTypeLabel(blockType: BlockType | string): string {
  return BLOCK_TYPE_LABELS[blockType as BlockType] || blockType
}
