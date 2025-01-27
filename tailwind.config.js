/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js,json}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")], // DaisyUI plugin
  daisyui: {
    themes: ["cupcake", "dark"],
  },
};
