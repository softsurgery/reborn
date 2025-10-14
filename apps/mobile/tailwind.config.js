const { hairlineWidth } = require("nativewind/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    fontFamily: {
      "poppins-black": ["Poppins-Black"],
      "poppins-black-italic": ["Poppins-BlackItalic"],
      "poppins-bold": ["Poppins-Bold"],
      "poppins-bold-italic": ["Poppins-BoldItalic"],
      "poppins-extrabold": ["Poppins-ExtraBold"],
      "poppins-extrabold-italic": ["Poppins-ExtraBoldItalic"],
      "poppins-extralight": ["Poppins-ExtraLight"],
      "poppins-extra-light-italic": ["Poppins-LightItalic"],
      "poppins-italic": ["Poppins-Italic"],
      "poppins-light": ["Poppins-Light"],
      "poppins-light-italic": ["Poppins-LightItalic"],
      "poppins-medium": ["Poppins-Medium"],
      "poppins-medium-italic": ["Poppins-MediumItalic"],
      poppins: ["Poppins"],
      "poppins-semibold": ["Poppins-SemiBold"],
      "poppins-semibold-italic": ["Poppins-SemiBoldItalic"],
      "poppins-thin": ["Poppins-Thin"],
      "poppins-thin-italic": ["Poppins-ThinItalic"],
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require("tailwindcss-animate")],
};
