import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-purple-50 text-primary-purple border border-purple-200',
        secondary: 'bg-pink-50 text-accent-pink border border-pink-200',
        success: 'bg-green-50 text-green-700 border border-green-200',
        warning: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
        error: 'bg-red-50 text-red-700 border border-red-200',
        outline: 'border border-gray-200 text-charcoal bg-transparent',
        required: 'bg-badge-required-bg text-badge-required-text border-0',
        optional: 'bg-badge-optional-bg text-badge-optional-text border border-gray-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
