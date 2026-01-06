import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        // Primary CTA - Blush Pink (새 브랜드 컬러)
        default:
          'bg-[var(--blush-400)] text-white hover:bg-[var(--blush-500)] active:bg-[var(--blush-600)] focus-visible:ring-[var(--blush-300)]',
        // Secondary - Purple (레거시 유지)
        secondary:
          'bg-primary-purple text-white hover:opacity-90 focus-visible:ring-primary-purple',
        // Outline - Blush
        outline:
          'border border-[var(--blush-300)] text-[var(--blush-500)] bg-transparent hover:bg-[var(--blush-50)] focus-visible:ring-[var(--blush-300)]',
        // Ghost - 투명 배경
        ghost:
          'text-[var(--text-body)] hover:bg-[var(--warm-100)] focus-visible:ring-[var(--blush-300)]',
        // Link
        link: 'text-[var(--blush-500)] underline-offset-4 hover:underline',
        // Destructive
        destructive:
          'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500',
        // Gold (레거시)
        gold:
          'bg-[#C9A962] text-[#0A0806] hover:bg-[#B8A052] focus-visible:ring-[#C9A962]',
        // Ghost Dark (레거시)
        'ghost-dark':
          'text-[#F5E6D3]/60 hover:text-[#F5E6D3] hover:bg-white/5 focus-visible:ring-[#C9A962]',
        // Sage → Blush로 매핑 (하위 호환)
        sage:
          'bg-[var(--blush-400)] text-white hover:bg-[var(--blush-500)] active:bg-[var(--blush-600)] focus-visible:ring-[var(--blush-300)]',
        // Rose → Blush로 매핑 (하위 호환)
        rose:
          'bg-[var(--blush-400)] text-white hover:bg-[var(--blush-500)] active:bg-[var(--blush-600)] focus-visible:ring-[var(--blush-300)]',
        // Ghost Light - 연한 배경
        'ghost-light':
          'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--blush-50)] focus-visible:ring-[var(--blush-300)]',
        // NEW: Soft - 연한 배경 + 진한 텍스트 (배지 스타일)
        soft:
          'bg-[var(--blush-100)] text-[var(--blush-600)] hover:bg-[var(--blush-200)] focus-visible:ring-[var(--blush-300)]',
        // NEW: Outline Warm - 따뜻한 베이지 아웃라인
        'outline-warm':
          'border border-[var(--warm-300)] text-[var(--text-body)] bg-transparent hover:bg-[var(--warm-50)] focus-visible:ring-[var(--warm-400)]',
      },
      size: {
        default: 'h-14 px-6 py-3',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-16 rounded-xl px-8 text-base',
        icon: 'h-10 w-10',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, fullWidth, isLoading, children, disabled, ...props },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : null}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
