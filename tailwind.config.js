/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: 'rgba(var(--brand-rgb), 0.05)',
          100: 'rgba(var(--brand-rgb), 0.1)',
          200: 'rgba(var(--brand-rgb), 0.2)',
          300: 'rgba(var(--brand-rgb), 0.3)',
          400: 'rgba(var(--brand-rgb), 0.4)',
          500: 'var(--brand)',
          600: 'var(--brand-light)',
          700: 'var(--brand-light)',
          800: 'var(--brand-light)',
          900: 'var(--brand-light)',
        },
        amber: {
          400: '#F0A500',
          500: '#CF7500',
        },
        surface: {
          50: 'var(--bg-primary)',
          100: 'var(--bg-secondary)',
          200: 'var(--border)',
          card: 'var(--bg-card)',
          dark: 'var(--bg-primary)',
          'dark-card': 'var(--bg-card)',
          'dark-border': 'var(--border)',
        }
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card': '0 4px 6px -1px rgba(0,0,0,0.04), 0 2px 4px -2px rgba(0,0,0,0.04)',
        'hover': '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -4px rgba(0,0,0,0.05)',
        'glow': '0 0 0 3px rgba(240,165,0,0.15)',
        'glow-amber': '0 0 0 3px rgba(240,165,0,0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-soft': 'bounceSoft 1s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
