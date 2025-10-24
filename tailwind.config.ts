import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-purple': {
          light: '#F3E8FF',
          DEFAULT: '#8B5CF6',
        },
        'brand-pink': {
          light: '#FFF0F5',
          DEFAULT: '#EC4899',
        },
        'brand-blue': {
          light: '#E0F2FE',
        },
        'brand-beige': {
          light: '#FFF7ED',
        },
        'brand-yellow': {
          light: '#FEF9C3',
        }
      },
      fontFamily: {
        'sans': ['Noto Sans KR', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config

