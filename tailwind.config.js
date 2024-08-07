/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'blue-150': '#4EA9F3',
        'yellow-150': '#FCDB7C',
        'gray-950': '#1E1E1E',
      },
      width: {
        '18': '4.5rem',
        '160': '40rem',
      }
    },
  },
  plugins: [
    require('tailwindcss-animated')
  ],
};
