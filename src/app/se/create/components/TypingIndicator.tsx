'use client'

/**
 * TypingIndicator - Letty 타이핑 중 애니메이션
 * 카카오톡처럼 ... 점 3개가 순차적으로 bounce
 */

export function TypingIndicator() {
  return (
    <div className="flex gap-1.5 px-1">
      <span
        className="w-2 h-2 bg-[#F5E6D3]/50 rounded-full animate-bounce"
        style={{ animationDelay: '0ms', animationDuration: '600ms' }}
      />
      <span
        className="w-2 h-2 bg-[#F5E6D3]/50 rounded-full animate-bounce"
        style={{ animationDelay: '150ms', animationDuration: '600ms' }}
      />
      <span
        className="w-2 h-2 bg-[#F5E6D3]/50 rounded-full animate-bounce"
        style={{ animationDelay: '300ms', animationDuration: '600ms' }}
      />
    </div>
  )
}
