/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", 
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0ea5e9', // Tailwind sky-500, update with your branding
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f1f5f9', // Tailwind slate-100
          foreground: '#0f172a',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#0f172a',
        },
        background: '#f8fafc',
      },
      fontFamily: {
        medium: ['Poppins_500Medium', 'sans-serif'],
        bold: ['Poppins_700Bold', 'sans-serif'],
      }
    },
  },
  plugins: [],
}