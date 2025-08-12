/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        'primary-green': '#6DBE45',
        'dark-green': '#2E7D32',
        'dark-charcoal': '#263238',
        'light-gray': '#ECEFF1',
        'error-red': '#E53935',
        'success-green': '#43A047',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '0.9' },
        },
        'pulse-slow': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-in-out',
        float: 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 4s infinite ease-in-out',
        shimmer: 'shimmer 2s infinite linear',
        spin: 'spin 20s linear infinite',
        bounce: 'bounce 2s infinite',
      },
    },
  },
  plugins: [],
}

