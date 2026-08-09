import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#07111d",
          900: "#0a1626",
          800: "#12233a",
          700: "#1d3554",
        },
        mist: {
          50: "#f7fafc",
          100: "#eef4fb",
        },
        aurora: {
          400: "#74d2ff",
          500: "#49b8ff",
          600: "#2196f3"
        }
      },
      boxShadow: {
        soft: "0 16px 40px rgba(4, 10, 18, 0.18)",
      },
      backgroundImage: {
        "radial-fog":
          "radial-gradient(circle at top, rgba(73,184,255,0.20), transparent 32%), radial-gradient(circle at 80% 20%, rgba(116,210,255,0.16), transparent 25%), linear-gradient(180deg, #07111d 0%, #0a1626 55%, #eef4fb 55%, #f7fafc 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
