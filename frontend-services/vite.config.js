import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      config: {
        content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              primary: "#1173d4",
              "background-light": "#f6f7f8",
              "background-dark": "#101922",
            },
            fontFamily: {
              display: ["Inter", "sans-serif"],
            },
            borderRadius: {
              DEFAULT: "0.25rem",
              lg: "0.5rem",
              xl: "0.75rem",
              full: "9999px",
            },
          },
        },
        plugins: [],
      },
    }),
  ],
});
