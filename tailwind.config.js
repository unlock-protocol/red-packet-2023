/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    colors: {
      red: '#D1451D',
      darkred: '#B11417',
      yellow: '#F5CB3E',
      white: '#ffffff',
      // black: '#000000',
      // darkyellow: '#ACA571',
      // darkred: '#792E31',
    },
    fontFamily: {
      'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
      'serif': ['ui-serif', 'Georgia'],
      'mono': ['ui-monospace', 'SFMono-Regular'],
    }
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}