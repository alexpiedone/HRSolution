/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  safelist: [
    {
      pattern: /bg-(blue|green|yellow|red|gray)-(50|200)/,
    },
    {
      pattern: /text-(blue|green|yellow|red|gray)-400/,
    }
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

safelist: [
  'bg-blue-50',
  'bg-green-50',
  'bg-yellow-50',
  'bg-red-50',
  'bg-gray-50',
  'bg-blue-200',
  'bg-green-200',
  'bg-yellow-200',
  'bg-red-200',
  'bg-gray-200',
  'text-blue-400',
  'text-green-400',
  'text-yellow-400',
  'text-red-400',
  'text-gray-400',
]
