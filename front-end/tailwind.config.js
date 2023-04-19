/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./template/*.{html,js}"],
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
      },
    },
  },
  plugins: [],
}
