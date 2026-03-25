/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0A0A0A',
          card: '#111111',
        },
        qns: '#00D179',
        qfpay: '#0052FF',
        burn: '#E85D25',
        'burn-red': '#C13333',
      },
      fontFamily: {
        display: ['"Clash Display"', 'sans-serif'],
        body: ['Satoshi', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'monospace'],
      },
      maxWidth: {
        content: '720px',
      },
    },
  },
  plugins: [],
};
