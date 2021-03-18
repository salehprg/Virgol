module.exports = {
  purge: [],
  prefix: 'tw-',
  theme: {
    extend: {
      backgroundImage: theme => ({

        'vst': "url('./videoBack.svg')"
       }),
      fontFamily: {
        'vr': ['VazirRegular'],
        'vm': ['VazirMedium'],
        'vb': ['VazirBold']
      },
      colors: {
        'black-blue': '#202442',
        'bold-blue': '#242747',
        'dark-blue': '#2D325A',
        'light-blue': '#4E7CFF',
        'sky-blue': '#22C0FF',
        'purplish': '#7033FF',
        'redish': '#F65164',
        'greenish': '#41CD7D',
        'pinkish': '#E25B84',
        'grayish': '#707070',
        
      },
      maxWidth: {
        '250': '250px',
        '350': '350px',
        '450' : '450px',
        '500': '500px',
        '800': '800px',
        '1000': '1000px',
        '80': '80%'
      },
      minWidth: {
        '250': '250px',
        '300': '300px',
        '350': '350px',
        '700': '700px',
        '900': '900px',
      },
      height: {
        '80': '80vh',
        '85': '85vh',
        '90': '90vh'
      },
      minHeight: {
        '70': '70vh',
        '85': '85vh',
        '90': '90vh'
      },
      maxHeight: {
        '500': '500px',
        '75': '75vh'
      },
      borderRadius: {
        xl: '1rem'
      }
    },
  },
  variants: {},
  plugins: [],
}
