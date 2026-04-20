import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1180px"
      }
    },
    extend: {
      colors: {
        teal: {
          brand: "#0D9488",
          ink: "#0F766E",
          soft: "#CCFBF1"
        },
        amber: {
          cta: "#F59E0B",
          ink: "#92400E"
        }
      },
      boxShadow: {
        soft: "0 18px 50px rgba(15, 118, 110, 0.12)",
        panel: "0 10px 30px rgba(15, 23, 42, 0.08)"
      },
      borderRadius: {
        lg: "8px",
        md: "6px",
        sm: "4px"
      }
    }
  },
  plugins: []
};

export default config;
