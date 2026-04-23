/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ubuntu: {
          purple: '#772953',
          orange: '#E95420',
          dark: '#300A24',
          gray: '#AEA79F',
          light: '#F7F7F7',
          window: '#3D3D3D',
        }
      },
      backgroundImage: {
        'ubuntu-gradient': 'linear-gradient(135deg, #772953 0%, #E95420 100%)',
      }
    },
  },
  plugins: [],
}
