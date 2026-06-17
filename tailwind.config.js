/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0058be',
          hover: '#2170e4',
          50: '#EFF6FF',
          100: '#DBEAFE',
        },
        background: '#f8f9fb',
        surface: '#ffffff',
        sidebar: '#f3f4f6',
        text: {
          primary: '#191c1e',
          secondary: '#424754',
        },
        border: '#E2E8F0',
        active: {
          sidebar: '#DBEAFE',
        },
        success: {
          surface: '#ECFDF5',
          border: '#A7F3D0',
          text: '#065F46',
        },
        warning: {
          surface: '#FFFBEB',
          border: '#FCD34D',
          text: '#92400E',
        },
        error: {
          surface: '#FEF2F2',
          border: '#FECACA',
          text: '#991B1B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'headline-lg': ['30px', { lineHeight: '38px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-md': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-sm': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'label-md': ['13px', { lineHeight: '16px', fontWeight: '500' }],
        'label-sm': ['11px', { lineHeight: '14px', letterSpacing: '0.05em', fontWeight: '500' }],
      },
      maxWidth: {
        content: '1440px',
      },
      spacing: {
        sidebar: '280px',
        header: '64px',
        container: '32px',
        gutter: '24px',
        'stack-sm': '8px',
        'stack-md': '16px',
        'stack-lg': '24px',
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },
      boxShadow: {
        card: '0px 4px 12px rgba(0, 0, 0, 0.05)',
        hover: '0px 6px 16px rgba(0, 0, 0, 0.08)',
        header: '0px 2px 8px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}
