/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
        colors: {
            "light": "#DFF3E4",
            "glaucous": "#7180B9",
            "zaffre": "#3423A6",
            "federal": "#2E1760",
            "space": "#171738"
        }
    },
  },
  plugins: [],
}

