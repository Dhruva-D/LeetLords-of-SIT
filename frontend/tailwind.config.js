/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customGray: '#121316',
        customBlue: '#5F2FDE'
      },
      boxShadow: {
        'custom-large': '2px 2px 25px 2px rgb(98, 49, 230)',
      },
    },
  },
  plugins: [],
}

