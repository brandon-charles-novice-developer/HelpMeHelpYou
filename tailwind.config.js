/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        attain: {
          base:    '#1E1A2E',
          card:    '#252040',
          hover:   '#2D2750',
          primary: '#67579E',
          deep:    '#4D4176',
          blue:    '#5C70D6',
          teal:    '#2DD4BF',
          lilac:   '#C4B5FD',
          muted:   '#AFADAD',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
      },
      boxShadow: {
        card: 'rgba(0, 0, 0, 0.2) 0px 1px 30px 0px',
        'card-hover': 'rgba(0, 0, 0, 0.35) 0px 4px 40px 0px',
      },
    },
  },
  plugins: [],
}
