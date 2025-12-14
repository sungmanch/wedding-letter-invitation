import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const inputVariants = cva(
  'flex h-12 w-full rounded-lg border px-4 py-3 text-base focus:outline-none focus:ring-2 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-white border-gray-200 text-charcoal placeholder:text-gray-400 focus:ring-blush-pink hover:border-blush-pink-200',
        dark:
          'bg-white/5 border-white/10 text-[#F5E6D3] placeholder:text-[#F5E6D3]/40 focus:ring-[#C9A962]/50 focus:border-[#C9A962]/30 hover:border-white/20',
        light:
          'bg-white border-[var(--sand-200)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:ring-[var(--sage-400)] hover:border-[var(--sage-300)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  error?: string
  label?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, id, variant, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id || generatedId
    const isDark = variant === 'dark'
    const isLight = variant === 'light'

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'mb-2 block text-sm font-medium',
              isDark ? 'text-[#F5E6D3]' : isLight ? 'text-[var(--text-body)]' : 'text-charcoal'
            )}
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            inputVariants({ variant }),
            error && (isDark || isLight ? 'border-red-400 focus:ring-red-400' : 'border-red-500 focus:ring-red-500'),
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className={cn('mt-1 text-sm', isDark ? 'text-red-400' : 'text-red-500')}>
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input, inputVariants }
