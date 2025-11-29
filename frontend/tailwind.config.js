/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Gold tones
        gold: {
          50: '#FDF9F0',
          100: '#F9EFD8',
          200: '#F3DFB1',
          300: '#E9C76A',
          400: '#D4A84B',
          500: '#C49A3A',
          600: '#A67C2E',
          700: '#8A6425',
          800: '#6E4F1E',
          900: '#523B16',
        },
        // Neutral - Black/Dark tones
        cafe: {
          50: '#F7F7F7',
          100: '#E3E3E3',
          200: '#C8C8C8',
          300: '#A4A4A4',
          400: '#818181',
          500: '#666666',
          600: '#515151',
          700: '#434343',
          800: '#383838',
          900: '#1A1A1A',
          950: '#0D0D0D',
        },
        // Accent colors
        success: '#22C55E',
        warning: '#EAB308',
        error: '#EF4444',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-gold': 'linear-gradient(135deg, #C49A3A 0%, #E9C76A 50%, #C49A3A 100%)',
        'gradient-dark': 'linear-gradient(180deg, #1A1A1A 0%, #0D0D0D 100%)',
        'noise': "url('/noise.png')",
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(196, 154, 58, 0.4)' },
          '50%': { boxShadow: '0 0 0 15px rgba(196, 154, 58, 0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'gold': '0 4px 20px -2px rgba(196, 154, 58, 0.25)',
        'gold-lg': '0 10px 40px -4px rgba(196, 154, 58, 0.3)',
        'inner-gold': 'inset 0 2px 4px 0 rgba(196, 154, 58, 0.1)',
      },
    },
  },
  plugins: [],
}

