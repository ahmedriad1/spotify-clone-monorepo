module.exports = {
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
        'circular-book': ['circular-black'],
        'circular-bold': ['circular-black'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
