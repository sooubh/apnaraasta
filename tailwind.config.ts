import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        raasta: {
          canvas: "#EAEBFA",
          surface: "#FFFFFF",
          subtle: "#F5F5FC",
          primary: "#5B50E6",
          primaryHover: "#4C40D8",
          primaryLight: "#ECEAFE",
          periwinkle: "#BEC3FB",
          lilac: "#E5DBFE",
          lavender: "#D6D1FC",
          ink: "#11121C",
          inkMuted: "#65687E",
          border: "#E5E6F5",
          borderSubtle: "#F0F0FA",
          accentPink: "#FBCFE8",
          accentAmber: "#FEF3C7",
          accentGreen: "#DCFCE7",
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(91, 80, 230, 0.06), 0 2px 6px -1px rgba(17, 18, 28, 0.04)",
        floating: "0 10px 30px -4px rgba(91, 80, 230, 0.12), 0 4px 10px -2px rgba(17, 18, 28, 0.06)",
        subtle: "0 1px 3px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
