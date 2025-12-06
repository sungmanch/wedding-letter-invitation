/**
 * Intro Section - EditorSchema Fields
 * AI가 동적으로 생성하므로 기본 필드만 정의
 */

import type { EditorSection } from '../../schema/editor'

export const introEditorSection: EditorSection = {
  id: 'intro',
  title: '인트로',
  description: '청첩장 첫 화면 설정',
  icon: 'sparkles',
  order: 0,
  fields: [
    {
      id: 'groom-name',
      type: 'text',
      label: '신랑 이름',
      dataPath: 'couple.groom.name',
      placeholder: '신랑 이름을 입력하세요',
      required: true,
      order: 0,
    },
    {
      id: 'bride-name',
      type: 'text',
      label: '신부 이름',
      dataPath: 'couple.bride.name',
      placeholder: '신부 이름을 입력하세요',
      required: true,
      order: 1,
    },
    {
      id: 'main-photo',
      type: 'image',
      label: '메인 사진',
      dataPath: 'photos.main',
      required: true,
      aspectRatio: '3:4',
      crop: true,
      order: 2,
    },
    {
      id: 'intro-photo',
      type: 'image',
      label: '인트로 배경 사진',
      description: '인트로 섹션 배경 이미지 (선택)',
      dataPath: 'photos.intro',
      aspectRatio: '9:16',
      crop: true,
      order: 3,
    },
    {
      id: 'intro-video',
      type: 'url',
      label: '인트로 영상 URL',
      description: '인트로 섹션에 영상 사용 시 (선택)',
      dataPath: 'video.intro',
      placeholder: 'https://...',
      order: 4,
    },
  ],
}
