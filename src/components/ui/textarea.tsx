import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  label?: string
  showCount?: boolean
  maxLength?: number
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, id, showCount, maxLength, value, ...props }, ref) => {
    const generatedId = React.useId()
    const textareaId = id || generatedId
    const currentLength = typeof value === 'string' ? value.length : 0

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-2 block text-sm font-medium text-charcoal"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            'flex min-h-[120px] w-full rounded-lg border bg-white px-4 py-3 text-base text-charcoal placeholder:text-gray-400 resize-none',
            'focus:outline-none focus:ring-2 focus:ring-blush-pink focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-200 hover:border-blush-pink-200',
            className
          )}
          ref={ref}
          value={value}
          maxLength={maxLength}
          {...props}
        />
        <div className="mt-1 flex justify-between">
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          {showCount && maxLength && (
            <p className={cn(
              'ml-auto text-sm',
              currentLength >= maxLength ? 'text-red-500' : 'text-gray-400'
            )}>
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
