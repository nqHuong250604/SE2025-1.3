/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 👈 thêm dòng này để Tailwind đọc được class trong React component
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
