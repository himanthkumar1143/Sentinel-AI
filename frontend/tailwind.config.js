/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        carbon: {
          900: '#060A11',
          800: '#0B0F19',
          700: '#111827',
          600: '#1E293B',
          500: '#334155',
        },
        slateBlue: {
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
          500: '#64748B',
          400: '#94A3B8',
          300: '#CBD5E1',
        },
        industrial: {
          safe: '#10B981',
          warning: '#F59E0B',
          critical: '#F43F5E',
          cyan: '#06B6D4',
          steel: '#38BDF8'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-safe': '0 0 15px rgba(16, 185, 129, 0.25)',
        'glow-warning': '0 0 15px rgba(245, 158, 11, 0.3)',
        'glow-critical': '0 0 20px rgba(244, 63, 94, 0.45)',
        'panel': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
