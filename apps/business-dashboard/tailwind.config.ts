import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Business Dashboard Purple-Pink Theme
        business: {
          primary: "hsl(280, 70%, 60%)",     // Purple
          secondary: "hsl(330, 70%, 60%)",   // Pink
          accent: "hsl(40, 90%, 60%)",       // Warm Yellow
        },
        status: {
          confirmed: "hsl(142, 71%, 45%)",   // Green
          pending: "hsl(45, 100%, 51%)",     // Yellow
          cancelled: "hsl(0, 72%, 51%)",     // Red
          completed: "hsl(210, 79%, 46%)",   // Blue
          inProgress: "hsl(280, 70%, 60%)",  // Purple
        },
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
}

export default config
