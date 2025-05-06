/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/context/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      // aqui você pode adicionar cores, fontes, etc.
    },
  },
  plugins: [],
};
