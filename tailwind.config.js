/** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     './index.html',
//     './src/**/*.{vue,js,ts,jsx,tsx}',
//     './node_modules/primevue/**/*.{vue,js,ts,jsx,tsx}',
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [require('tailwindcss-primeui')],
// }

const primeui = require('tailwindcss-primeui')

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  plugins: [primeui],
  darkMode: 'class',
}
