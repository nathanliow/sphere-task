import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      'gradient-start-blue': '#3A76FF',
      'gradient-end-blue': '#27D6FF',
      'blue': '#2C61F9',
      'dark-blue': '#0B3FD9',
      'black': '#000000',
      'gray': '#D1D7E3',
      'dark-gray': '#98A2B3',
      'white': '#FFFFFF',
      'hover-white': '#F4F4F4',
      'red': '#F85858',
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
