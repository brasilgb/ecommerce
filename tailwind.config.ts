import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['var(--font-roboto)'],
      },
      colors: {
        'blue-primary': '#154295',
        'blue-secundary': '#1452bc',
        'blue-light': '#00AEEF',
        'yellow-dark': '#F18800',
        'yellow-light': '#FFD100',
        'gray-dark': '#F1F1F1',
        'gray-middle': '#F8F8F8',
        'gray-light': '#FAFAFA',
        'orange-middle': '#F5B025',
        'orange-dark': '#EC6608',
      },

    },
  },
  plugins: [],
}
export default config
