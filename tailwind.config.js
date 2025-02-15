/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  darkMode: ["class", '[data-theme="lemonade"]'], // Tidak diperlukan jika menggunakan DaisyUI themes
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: ["lemonade"], // Mendeklarasikan tema yang tersedia
    theme: "lemonade", // Menetapkan tema default
  },
};
