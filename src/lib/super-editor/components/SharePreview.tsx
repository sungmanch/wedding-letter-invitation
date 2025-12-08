'use client'

import { cn } from '@/lib/utils'

interface SharePreviewProps {
  ogTitle: string
  ogDescription: string
  ogImageUrl: string | null
  className?: string
}

/**
 * 카카오톡/문자에서 링크 공유 시 보이는 미리보기 시뮬레이션
 */
export function SharePreview({
  ogTitle,
  ogDescription,
  ogImageUrl,
  className,
}: SharePreviewProps) {
  return (
    <div className={cn('flex flex-col items-center py-8 px-4', className)}>
      {/* 카카오톡 채팅방 시뮬레이션 */}
      <div className="w-full max-w-[400px]">
        <h3 className="text-sm font-medium text-gray-500 mb-4 text-center">
          카카오톡에서 공유 시 미리보기
        </h3>

        {/* 카카오톡 채팅방 UI */}
        <div className="bg-[#B2C7D9] rounded-2xl p-4 shadow-lg">
          {/* 채팅방 헤더 */}
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/30">
            <div className="w-8 h-8 rounded-full bg-gray-400" />
            <span className="text-sm font-medium text-gray-800">친구</span>
          </div>

          {/* 내가 보낸 메시지 */}
          <div className="flex justify-end mb-3">
            <div className="bg-[#FEE500] rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%]">
              <p className="text-sm text-gray-900">우리 결혼해요! 청첩장 보내드려요 💕</p>
            </div>
          </div>

          {/* OG 링크 카드 */}
          <div className="flex justify-end">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm max-w-[280px]">
              {/* OG 이미지 */}
              <div className="aspect-[1200/630] bg-gray-100 relative">
                {ogImageUrl ? (
                  <img
                    src={ogImageUrl}
                    alt="OG Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    이미지가 없습니다
                  </div>
                )}
              </div>

              {/* OG 정보 */}
              <div className="p-3">
                <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                  {ogTitle || '제목이 표시됩니다'}
                </h4>
                <p className="text-xs text-gray-500 line-clamp-2 mb-1">
                  {ogDescription || '설명이 표시됩니다'}
                </p>
                <p className="text-xs text-gray-400">maisondeletter.com</p>
              </div>
            </div>
          </div>

          {/* 시간 표시 */}
          <div className="flex justify-end mt-1">
            <span className="text-[10px] text-gray-600">오후 2:30</span>
          </div>
        </div>

        {/* 문자 메시지 시뮬레이션 */}
        <h3 className="text-sm font-medium text-gray-500 mt-8 mb-4 text-center">
          문자 메시지에서 미리보기
        </h3>

        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200">
          {/* 문자 헤더 */}
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <span className="text-white text-sm font-medium">홍</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-900">홍길동</span>
              <p className="text-xs text-gray-500">010-1234-5678</p>
            </div>
          </div>

          {/* 문자 내용 */}
          <div className="space-y-3">
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%]">
              <p className="text-sm text-gray-900">
                안녕하세요~ 저희 결혼식에 초대합니다!
              </p>
            </div>

            {/* 링크 프리뷰 (MMS 스타일) */}
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm overflow-hidden max-w-[85%]">
              {ogImageUrl ? (
                <img
                  src={ogImageUrl}
                  alt="Preview"
                  className="w-full aspect-[1200/630] object-cover"
                />
              ) : (
                <div className="w-full aspect-[1200/630] bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                  이미지 없음
                </div>
              )}
              <div className="px-3 py-2 bg-gray-100">
                <p className="text-sm font-medium text-gray-900 line-clamp-1">
                  {ogTitle || '제목'}
                </p>
                <p className="text-xs text-blue-600 mt-0.5">maisondeletter.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
