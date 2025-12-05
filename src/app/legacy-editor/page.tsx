'use client'

import dynamic from 'next/dynamic'

// 클라이언트 사이드 렌더링 - SSR 비활성화
const LegacyEditorClient = dynamic(
  () => import('./LegacyEditorClient'),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Loading editor...</div>
      </div>
    )
  }
)

export default function LegacyEditorPage() {
  return <LegacyEditorClient />
}
