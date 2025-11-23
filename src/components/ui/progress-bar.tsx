import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  showLabel?: boolean
  size?: 'sm' | 'default' | 'lg'
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, value, max = 100, showLabel = false, size = 'default', ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    const sizeClasses = {
      sm: 'h-0.5',
      default: 'h-1',
      lg: 'h-2',
    }

    return (
      <div className={cn('w-full', className)} {...props}>
        <div
          ref={ref}
          className={cn(
            'w-full overflow-hidden rounded-full bg-pink-50',
            sizeClasses[size]
          )}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-purple to-accent-pink transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showLabel && (
          <div className="mt-1 flex justify-between text-xs text-gray-500">
            <span>{value}명 응답</span>
            <span>{Math.round(percentage)}%</span>
          </div>
        )}
      </div>
    )
  }
)
ProgressBar.displayName = 'ProgressBar'

export { ProgressBar }
