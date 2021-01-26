module.exports = {
  purge: {
    enabled: true,
    content: ['./structures/web/views/*.ejs', './structures/web/public/*.html']
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        purple: {
          50: '#BBB8F8',
          100: '#EAE9FA',
          200: '#E7E5FF',
          300: '#9590EE',
          400: '#9590EE',
          500: '#BBB8F8',
          600: '#9590EE',
          700: '#7069EF',
          800: '#7069EF',
          900: '#7069EF'
        }
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
