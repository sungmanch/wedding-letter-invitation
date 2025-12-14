'use client'

/**
 * Super Editor v2 - Context Menu
 *
 * 요소 우클릭 컨텍스트 메뉴
 * - 복사, 붙여넣기, 삭제
 * - 순서 변경 (앞으로, 뒤로)
 * - 정렬 옵션
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

// ============================================
// Types
// ============================================

export interface MenuItem {
  id: string
  label: string
  icon?: ReactNode
  shortcut?: string
  disabled?: boolean
  danger?: boolean
  divider?: boolean
  onClick?: () => void
  children?: MenuItem[]
}

export interface ContextMenuProps {
  /** 메뉴 아이템 */
  items: MenuItem[]
  /** 열림 상태 */
  isOpen: boolean
  /** 위치 */
  position: { x: number; y: number }
  /** 닫기 콜백 */
  onClose: () => void
  /** 추가 className */
  className?: string
}

// ============================================
// Component
// ============================================

export function ContextMenu({
  items,
  isOpen,
  position,
  onClose,
  className = '',
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [adjustedPosition, setAdjustedPosition] = useState(position)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)

  // 위치 조정 (화면 밖으로 나가지 않도록)
  useEffect(() => {
    if (!isOpen || !menuRef.current) return

    const menu = menuRef.current
    const rect = menu.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let x = position.x
    let y = position.y

    // 오른쪽 경계
    if (x + rect.width > viewportWidth) {
      x = viewportWidth - rect.width - 8
    }

    // 아래쪽 경계
    if (y + rect.height > viewportHeight) {
      y = viewportHeight - rect.height - 8
    }

    // 왼쪽/위쪽 최소값
    x = Math.max(8, x)
    y = Math.max(8, y)

    setAdjustedPosition({ x, y })
  }, [isOpen, position])

  // 외부 클릭 감지
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  // 아이템 클릭
  const handleItemClick = useCallback((item: MenuItem) => {
    if (item.disabled) return

    if (item.children) {
      setActiveSubmenu(activeSubmenu === item.id ? null : item.id)
      return
    }

    item.onClick?.()
    onClose()
  }, [activeSubmenu, onClose])

  if (!isOpen) return null

  const menuContent = (
    <div
      ref={menuRef}
      className={`
        fixed z-[9999] min-w-[180px] py-1 rounded-lg shadow-xl
        bg-[#2a2a2a] border border-white/10
        ${className}
      `}
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
      }}
    >
      {items.map((item, index) => {
        if (item.divider) {
          return (
            <div
              key={`divider-${index}`}
              className="my-1 border-t border-white/10"
            />
          )
        }

        const hasSubmenu = item.children && item.children.length > 0

        return (
          <div key={item.id} className="relative">
            <button
              type="button"
              onClick={() => handleItemClick(item)}
              onMouseEnter={() => hasSubmenu && setActiveSubmenu(item.id)}
              disabled={item.disabled}
              className={`
                w-full flex items-center gap-3 px-3 py-2 text-left text-sm
                transition-colors
                ${item.disabled
                  ? 'text-[#F5E6D3]/30 cursor-not-allowed'
                  : item.danger
                    ? 'text-red-400 hover:bg-red-500/20'
                    : 'text-[#F5E6D3] hover:bg-white/10'
                }
              `}
            >
              {/* 아이콘 */}
              {item.icon && (
                <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>
              )}

              {/* 라벨 */}
              <span className="flex-1">{item.label}</span>

              {/* 단축키 */}
              {item.shortcut && (
                <span className="text-xs text-[#F5E6D3]/40">{item.shortcut}</span>
              )}

              {/* 서브메뉴 화살표 */}
              {hasSubmenu && (
                <ChevronRightIcon className="w-4 h-4 text-[#F5E6D3]/40" />
              )}
            </button>

            {/* 서브메뉴 */}
            {hasSubmenu && activeSubmenu === item.id && (
              <div
                className="
                  absolute left-full top-0 ml-1 min-w-[160px] py-1 rounded-lg shadow-xl
                  bg-[#2a2a2a] border border-white/10
                "
              >
                {item.children!.map((child) => (
                  <button
                    key={child.id}
                    type="button"
                    onClick={() => handleItemClick(child)}
                    disabled={child.disabled}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 text-left text-sm
                      transition-colors
                      ${child.disabled
                        ? 'text-[#F5E6D3]/30 cursor-not-allowed'
                        : 'text-[#F5E6D3] hover:bg-white/10'
                      }
                    `}
                  >
                    {child.icon && (
                      <span className="w-4 h-4 flex-shrink-0">{child.icon}</span>
                    )}
                    <span className="flex-1">{child.label}</span>
                    {child.shortcut && (
                      <span className="text-xs text-[#F5E6D3]/40">{child.shortcut}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )

  // Portal로 body에 렌더링
  if (typeof document !== 'undefined') {
    return createPortal(menuContent, document.body)
  }

  return null
}

// ============================================
// Hook: useContextMenu
// ============================================

export function useContextMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const open = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setPosition({ x: e.clientX, y: e.clientY })
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  return {
    isOpen,
    position,
    open,
    close,
  }
}

// ============================================
// Preset Menu Items
// ============================================

export function createElementMenuItems(handlers: {
  onCopy?: () => void
  onCut?: () => void
  onPaste?: () => void
  onDuplicate?: () => void
  onDelete?: () => void
  onBringToFront?: () => void
  onBringForward?: () => void
  onSendBackward?: () => void
  onSendToBack?: () => void
  onLock?: () => void
  onUnlock?: () => void
  isLocked?: boolean
  canPaste?: boolean
}): MenuItem[] {
  return [
    {
      id: 'copy',
      label: '복사',
      shortcut: '⌘C',
      icon: <CopyIcon className="w-4 h-4" />,
      onClick: handlers.onCopy,
    },
    {
      id: 'cut',
      label: '잘라내기',
      shortcut: '⌘X',
      icon: <ScissorsIcon className="w-4 h-4" />,
      onClick: handlers.onCut,
    },
    {
      id: 'paste',
      label: '붙여넣기',
      shortcut: '⌘V',
      icon: <ClipboardIcon className="w-4 h-4" />,
      disabled: !handlers.canPaste,
      onClick: handlers.onPaste,
    },
    {
      id: 'duplicate',
      label: '복제',
      shortcut: '⌘D',
      icon: <DuplicateIcon className="w-4 h-4" />,
      onClick: handlers.onDuplicate,
    },
    { id: 'divider-1', label: '', divider: true },
    {
      id: 'order',
      label: '순서',
      icon: <LayersIcon className="w-4 h-4" />,
      children: [
        {
          id: 'bring-to-front',
          label: '맨 앞으로',
          shortcut: '⌘⇧]',
          onClick: handlers.onBringToFront,
        },
        {
          id: 'bring-forward',
          label: '앞으로',
          shortcut: '⌘]',
          onClick: handlers.onBringForward,
        },
        {
          id: 'send-backward',
          label: '뒤로',
          shortcut: '⌘[',
          onClick: handlers.onSendBackward,
        },
        {
          id: 'send-to-back',
          label: '맨 뒤로',
          shortcut: '⌘⇧[',
          onClick: handlers.onSendToBack,
        },
      ],
    },
    { id: 'divider-2', label: '', divider: true },
    {
      id: 'lock',
      label: handlers.isLocked ? '잠금 해제' : '잠금',
      icon: handlers.isLocked ? <UnlockIcon className="w-4 h-4" /> : <LockIcon className="w-4 h-4" />,
      onClick: handlers.isLocked ? handlers.onUnlock : handlers.onLock,
    },
    { id: 'divider-3', label: '', divider: true },
    {
      id: 'delete',
      label: '삭제',
      shortcut: '⌫',
      icon: <TrashIcon className="w-4 h-4" />,
      danger: true,
      onClick: handlers.onDelete,
    },
  ]
}

// ============================================
// Icons
// ============================================

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  )
}

function ScissorsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
    </svg>
  )
}

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  )
}

function DuplicateIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
    </svg>
  )
}

function LayersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  )
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  )
}

function UnlockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
    </svg>
  )
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
}
