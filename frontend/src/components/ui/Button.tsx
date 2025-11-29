import { forwardRef, ReactNode, MouseEvent } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  children?: ReactNode
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-cafe-950 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 shadow-gold hover:shadow-gold-lg',
  secondary: 'bg-cafe-800 text-cafe-100 hover:bg-cafe-700 border border-cafe-700',
  outline: 'bg-transparent text-gold-400 border-2 border-gold-500/50 hover:bg-gold-500/10 hover:border-gold-400',
  ghost: 'bg-transparent text-cafe-300 hover:text-cafe-100 hover:bg-cafe-800/50',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      type = 'button',
      onClick,
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        type={type}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        className={`
          inline-flex items-center justify-center gap-2 font-medium rounded-lg
          transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 
          focus:ring-offset-cafe-950 focus:ring-gold-500
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        disabled={disabled || isLoading}
        onClick={onClick}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export default Button
