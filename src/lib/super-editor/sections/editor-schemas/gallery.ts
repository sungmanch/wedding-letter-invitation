/**
 * Gallery Section - EditorSchema Fields
 * 웨딩 사진 갤러리
 */

import type { EditorSection } from '../../schema/editor'

export const galleryEditorSection: EditorSection = {
  id: 'gallery',
  title: '갤러리',
  description: '웨딩 사진 갤러리',
  icon: 'images',
  order: 3,
  fields: [
    {
      id: 'gallery-photos',
      type: 'imageList',
      label: '갤러리 사진',
      description: '최대 30장까지 업로드 가능합니다',
      dataPath: 'photos.gallery',
      maxItems: 30,
      minItems: 1,
      sortable: true,
      required: true,
      order: 0,
    },
  ],
}
