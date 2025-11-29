import { ReactNode } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  hover?: boolean
  glow?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingSizes = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export default function Card({
  children,
  hover = false,
  glow = false,
  padding = 'md',
  className = '',
  ...props
}: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={`
        bg-cafe-900/50 backdrop-blur-sm border border-cafe-800 rounded-2xl overflow-hidden
        ${hover ? 'transition-all duration-300 hover:border-gold-500/30 hover:shadow-gold cursor-pointer' : ''}
        ${glow ? 'shadow-gold' : ''}
        ${paddingSizes[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Card Header
interface CardHeaderProps {
  children: ReactNode
  className?: string
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`border-b border-cafe-800 px-6 py-4 ${className}`}>
      {children}
    </div>
  )
}

// Card Content
interface CardContentProps {
  children: ReactNode
  className?: string
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  )
}

// Card Footer
interface CardFooterProps {
  children: ReactNode
  className?: string
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`border-t border-cafe-800 px-6 py-4 ${className}`}>
      {children}
    </div>
  )
}

