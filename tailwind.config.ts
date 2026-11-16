import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#07070B',
        'text-main': '#F5F3F7',
        'text-muted': 'rgba(245, 243, 247, 0.62)',
        'accent-gold': '#F2B8C6',
        'accent-rose': '#FF6B9A',
        'accent-violet': '#8B7CFF',
        'glass-fill': 'rgba(255, 255, 255, 0.07)',
        'glass-border': 'rgba(255, 255, 255, 0.16)',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'card': '28px',
        'card-lg': '32px',
      },
      boxShadow: {
        'card': '0 20px 60px rgba(0, 0, 0, 0.45)',
        'glass-inner': 'inset 0 1px 0 rgba(255, 255, 255, 0.35), inset 0 -1px 0 rgba(255, 255, 255, 0.06)',
        'glow-rose': '0 0 25px rgba(255, 107, 154, 0.35)',
        'glow-gold': '0 0 25px rgba(242, 184, 198, 0.3)',
      },
      backdropBlur: {
        'glass': '24px',
        'glass-mobile': '16px',
      },
    },
  },
  plugins: [],
} satisfies Config;
