'use client'

export type MobileView = 'edit' | 'preview' | 'preset'

interface MobileBottomNavProps {
  /** 현재 활성 뷰 */
  activeView: MobileView
  /** 뷰 변경 콜백 */
  onViewChange: (view: MobileView) => void
  /** 저장되지 않은 변경사항 있음 (편집 탭에 표시) */
  isDirty?: boolean
  className?: string
}

export function MobileBottomNav({
  activeView,
  onViewChange,
  isDirty = false,
  className = '',
}: MobileBottomNavProps) {
  const tabs: { id: MobileView; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'edit', label: '편집', icon: EditIcon },
    { id: 'preview', label: '미리보기', icon: PhoneIcon },
    { id: 'preset', label: '프리셋', icon: LayoutIcon },
  ]

  return (
    <nav
      className={`
        fixed bottom-0 left-0 right-0 z-50 md:hidden
        bg-white border-t border-[var(--warm-100)]
        ${className}
      `}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex h-14">
        {tabs.map((tab) => {
          const isActive = activeView === tab.id
          const Icon = tab.icon

          return (
            <button
              key={tab.id}
              onClick={() => onViewChange(tab.id)}
              className={`
                relative flex-1 flex flex-col items-center justify-center gap-0.5
                transition-colors
                ${isActive
                  ? 'text-[var(--blush-500)]'
                  : 'text-[var(--text-muted)] active:bg-[var(--warm-50)]'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>

              {/* 저장되지 않은 변경사항 표시 (편집 탭) */}
              {tab.id === 'edit' && isDirty && (
                <span className="absolute top-2 right-1/4 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

// Icons
function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  )
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    </svg>
  )
}

function LayoutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
      />
    </svg>
  )
}
