/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff0f1',
          100: '#ffe3e5',
          200: '#ffcdd1',
          300: '#ff9ba4',
          400: '#ff5c6d',
          500: '#ff1e38', // Neon Red
          600: '#e6122a',
          700: '#be0a1f',
          800: '#9e0d1d',
          900: '#85101c',
          950: '#4a030b',
        },
        accent: {
          green: '#34D32A' // Neon Green
        },
        dark: {
          DEFAULT: '#181312', // Warm Black
          card: '#221a19',
          border: '#382a28'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
