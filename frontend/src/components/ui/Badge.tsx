import { ReactNode } from 'react'

type BadgeVariant = 'default' | 'gold' | 'success' | 'warning' | 'error'
type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  className?: string
  icon?: ReactNode
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-cafe-800 text-cafe-300 border-cafe-700',
  gold: 'bg-gold-500/20 text-gold-400 border-gold-500/30',
  success: 'bg-success/20 text-success border-success/30',
  warning: 'bg-warning/20 text-warning border-warning/30',
  error: 'bg-error/20 text-error border-error/30',
}

const sizes: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
}

export default function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  icon,
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium border
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {icon}
      {children}
    </span>
  )
}

