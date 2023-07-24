/** @type {import('tailwindcss').Config} */
module.exports = { 
  content: ["./public/*.html", "./src/**/*.js", "./src/components/**/*.js"],
  // content: ["./public/*.html", "./src/app.js", "./src/**/*.js", "./src/components/**/*.js"],
  theme: {
    extend: {
      colors: {
        'bitter-chocolate': '#503130',
        'brown-coffee': '#4F2C22',
        'gainsboro': '#DFE0DF',
        'khaki': '#B8A99A',
        'medium-aquamarine': '#60D5A3',
        'melon': '#FFC0B8',
        'middle-yellow-red': '#F2B46D',
        'milktea': '#F2B46D',
        'myrtle-green': '#25646D',
        'cosmic-latte': '#FFF7E7', 
      },
      listStyleImage: {
        checkmark: 'url("/src/assets/icons/checkmark.png")',
        checkmark_gif: 'url("/src/assets/icons/checkmark-resize.gif")',
        uncheckmark_gif : 'url("/src/assets/icons/uncheckmark.png")',
      },
    },
  },
  plugins: [],
}