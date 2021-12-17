const { join } = require('path');

module.exports = {
  content: [join(__dirname, 'libs/ui/src/**/*.{js,ts,jsx,tsx}')],
  theme: {
    extend: {
      colors: {
        'sp-green': '#1db954',
      },
      gridTemplateColumns: {
        cards: 'repeat(auto-fill, minmax(200px, 1fr))',
      },
      boxShadow: {
        card: '0 8px 24px rgba(0, 0, 0, 0.5)',
      },
      fontFamily: {
        'circular-black': ['circular-black'],
        'circular-book': ['circular-book'],
        'circular-bold': ['circular-bold'],
        'circular-medium': ['circular-medium'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
