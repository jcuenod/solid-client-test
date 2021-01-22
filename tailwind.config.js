const colors = require('tailwindcss/colors')

module.exports = {
  purge: [
    './src/**/*.html',
    './src/**/*.js',
    './src/**/*.jsx',
    './src/**/*.ts',
    './src/**/*.tsx',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      // Build your palette here
      gray: colors.coolGray,
      blue: colors.blue,
      red: colors.red,
      yellow: colors.amber,
      pb: {
        50: '#ff0000',
        100: '#ff0000',
        200: '#ff0000',
        300: '#ff0000',
        400: '#ff0000',
        500: '#ff0000',
        600: '#106EBE',
        700: '#ff0000',
        800: '#0E62AC',
        900: '#ff0000',
      },
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
