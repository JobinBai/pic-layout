/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#1E1E2E',
          secondary: '#2A2A3C',
          deep: '#181825',
        },
        primary: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
          active: '#1D4ED8',
        },
        text: {
          primary: '#CDD6F4',
          secondary: '#A6ADC8',
          white: '#FFFFFF',
        },
        success: '#A6E3A1',
        danger: '#F38BA8',
        warning: '#FAB387',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
