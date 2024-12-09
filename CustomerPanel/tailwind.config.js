// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust paths as needed
  ],
  theme: {
    extend: {
      // Extend Tailwind's default theme here if necessary
    },
  },
  plugins: [
    require("daisyui"),
    // Add other plugins if necessary
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#4a90e2",
          secondary: "#d0021b",
          accent: "#f5a623",
          neutral: "#3d4451",
          "base-100": "#ffffff",
          info: "#2094f3",
          success: "#009485",
          warning: "#ff9900",
          error: "#ff5724",
        },
      },
      "light", // Include default themes if desired

      // Add more themes or custom themes as needed
    ],
  },
};
