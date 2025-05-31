/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  prefix: "tw-",
  important: true,
  theme: {
    extend: {
      colors: {
        primary: {
          main: "#1976d2",
          light: "#42a5f5",
          dark: "#1565c0",
        },
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
        "gradient-success": "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
        "gradient-warning": "linear-gradient(90deg, #f7971e 0%, #ffd200 100%)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
  corePlugins: {
    preflight: true,
  },
};
