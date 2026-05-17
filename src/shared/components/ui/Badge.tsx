import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@shared/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-secondary text-secondary-foreground',
        hot: 'bg-[#e84d3d]/12 text-[#e84d3d]',
        active: 'bg-green-500/12 text-green-500',
        viewed: 'bg-blue-500/12 text-blue-500',
        negotiating: 'bg-purple-500/12 text-purple-500',
        closed: 'bg-emerald-500/12 text-emerald-500',
        lost: 'bg-zinc-500/12 text-zinc-500',
        live: 'bg-[#e84d3d]/12 text-[#e84d3d] animate-pulse-dot',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}
