/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Bảng màu nhận diện PwC
      colors: {
        pwc: {
          orange: '#D04A02',
          orangeDark: '#A93C02', // dùng cho chữ nhỏ trên nền trắng để đạt tương phản AA
          amber: '#EB8C00',
          black: '#000000',
          dark: '#2D2D2D',
          light: '#F5F5F5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};