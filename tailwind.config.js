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
        /* ── Design Token Surface Colors ── */
        bg: {
          app: 'var(--bg-app)',
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          card: 'var(--bg-card)',
          elevated: 'var(--bg-elevated)',
          input: 'var(--bg-input)',
          hover: 'var(--bg-hover)',
          active: 'var(--bg-active)',
          overlay: 'var(--bg-overlay)',
        },

        /* ── Design Token Text Colors ── */
        txt: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          disabled: 'var(--text-disabled)',
          inverse: 'var(--text-inverse)',
        },

        /* ── Design Token Border Colors ── */
        bdr: {
          DEFAULT: 'var(--border)',
          light: 'var(--border-light)',
          focus: 'var(--border-focus)',
        },

        /* ── Brand Colors ── */
        brand: {
          50: 'rgba(var(--brand-rgb), 0.05)',
          100: 'rgba(var(--brand-rgb), 0.1)',
          200: 'rgba(var(--brand-rgb), 0.2)',
          300: 'rgba(var(--brand-rgb), 0.3)',
          400: 'rgba(var(--brand-rgb), 0.4)',
          DEFAULT: 'var(--brand)',
          500: 'var(--brand)',
          light: 'var(--brand-light)',
          hover: 'var(--brand-hover)',
          subtle: 'var(--brand-subtle)',
        },

        /* ── Semantic Colors ── */
        semantic: {
          success: 'var(--success)',
          'success-bg': 'var(--success-bg)',
          'success-border': 'var(--success-border)',
          danger: 'var(--danger)',
          'danger-bg': 'var(--danger-bg)',
          'danger-border': 'var(--danger-border)',
          warning: 'var(--warning)',
          'warning-bg': 'var(--warning-bg)',
          'warning-border': 'var(--warning-border)',
          info: 'var(--info)',
          'info-bg': 'var(--info-bg)',
          'info-border': 'var(--info-border)',
        },

        /* ── Parking-Specific Semantic ── */
        parking: {
          available: 'var(--parking-available)',
          occupied: 'var(--parking-occupied)',
          reserved: 'var(--parking-reserved)',
          maintenance: 'var(--parking-maintenance)',
          electric: 'var(--parking-electric)',
          disabled: 'var(--parking-disabled)',
          emergency: 'var(--parking-emergency)',
          vip: 'var(--parking-vip)',
        },

        /* ── Portal Accent Colors ── */
        owner: {
          DEFAULT: 'var(--owner-accent)',
          light: 'var(--owner-accent-light)',
          subtle: 'var(--owner-accent-subtle)',
        },
        admin: {
          DEFAULT: 'var(--admin-accent)',
          light: 'var(--admin-accent-light)',
          subtle: 'var(--admin-accent-subtle)',
        },

        /* ── Glass ── */
        glass: {
          bg: 'var(--glass-bg)',
          border: 'var(--glass-border)',
          heavy: 'var(--glass-bg-heavy)',
        },

        /* ── Surface (backwards compat) ── */
        surface: {
          50: 'var(--bg-primary)',
          100: 'var(--bg-secondary)',
          200: 'var(--border)',
          card: 'var(--bg-card)',
          dark: 'var(--bg-primary)',
          'dark-card': 'var(--bg-card)',
          'dark-border': 'var(--border)',
        },

        /* ── Amber Accent ── */
        amber: {
          400: '#F0A500',
          500: '#CF7500',
        },
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
      boxShadow: {
        'xs': 'var(--shadow-xs)',
        'soft': 'var(--shadow-sm)',
        'card': 'var(--shadow-card)',
        'hover': 'var(--shadow-hover)',
        'modal': 'var(--shadow-modal)',
        'glow': 'var(--shadow-glow)',
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
