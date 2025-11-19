/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // 🌸 Kawaii Soft Pop Palette
        primary: {
          DEFAULT: "#88D8B0", // Matcha Green
          hover: "#6FCF97",
          light: "#95D2B3",
          dark: "#55AD9B",
        },
        secondary: {
          DEFAULT: "#FFB7B2", // Pastel Pink
          light: "#FFDAC1",
          dark: "#FF9E98",
        },
        accent: {
          DEFAULT: "#E0BBE4", // Soft Lavender
          blue: "#B5DEFF", // Baby Blue
          peach: "#FFD3B6", // Warning
          mint: "#D4F0F0", // Info
        },
        surface: {
          cream: "#FEFBF6", // Warm Cream (light mode bg)
          white: "#FFFFFF",
          glass: "rgba(255, 255, 255, 0.6)",
        },
        text: {
          primary: "#4A5568", // Soft Charcoal
          secondary: "#718096",
          dark: "#2C3E50",
        },
        success: "#A7E9AF", // Minty Success
        warning: "#FFD3B6", // Peachy Warning
        error: "#FFCBC7", // Rosy Error
        info: "#D4F0F0", // Aqua Info
        // Dark mode colors
        "background-dark": {
          DEFAULT: "#2D2A32", // Charcoal with purple tint
          card: "#1F1D24",
          hover: "#3A3740",
        },
      },
      fontFamily: {
        display: ["Quicksand", "Nunito", "Be Vietnam Pro", "sans-serif"],
        body: ["Nunito", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "2.5rem",
        "3xl": "24px",
        "4xl": "32px",
        "5xl": "40px",
        pill: "9999px",
        full: "9999px",
      },
      boxShadow: {
        // 🎨 Solid Pop Shadows (Kawaii Style)
        solid: "4px 4px 0px 0px #E2E8F0",
        "solid-sm": "2px 2px 0px 0px #E2E8F0",
        "solid-lg": "6px 6px 0px 0px #E2E8F0",
        "solid-primary": "4px 4px 0px 0px #6FCF97",
        "solid-primary-hover": "6px 6px 0px 0px #6FCF97",
        "solid-secondary": "4px 4px 0px 0px #FF9E98",
        "solid-accent": "4px 4px 0px 0px #D4A5D8",
        // Button depth shadows
        "button-depth": "0px 4px 0px 0px #6FCF97",
        "button-depth-hover": "0px 2px 0px 0px #6FCF97",
        // Soft shadows
        glow: "0 0 15px rgba(136, 216, 176, 0.5)",
        soft: "0 10px 40px -10px rgba(136, 216, 176, 0.3)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
        cute: "0 4px 20px rgba(255, 183, 178, 0.25)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        // Existing animations
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        shrink: {
          "0%": { width: "100%" },
          "100%": { width: "0%" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        // New cute animations
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-3deg)" },
          "75%": { transform: "rotate(3deg)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        wave: {
          "0%": { transform: "rotate(0deg)" },
          "10%": { transform: "rotate(14deg)" },
          "20%": { transform: "rotate(-8deg)" },
          "30%": { transform: "rotate(14deg)" },
          "40%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(10deg)" },
          "60%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        slideInRight: "slideInRight 0.3s ease-out",
        shrink: "shrink linear",
        fadeIn: "fadeIn 0.2s ease-in",
        float: "float 3s ease-in-out infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        wave: "wave 2s ease-in-out",
        shimmer: "shimmer 2s linear infinite",
        bounce: "bounce 1s ease-in-out infinite",
        "scale-in": "scale-in 0.3s ease-out",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
