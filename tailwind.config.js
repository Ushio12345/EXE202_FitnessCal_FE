/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderColor: {
        primary: "var(--border-primary)", // #c2d8fc
        secondary: "var(--border-secondary)", // #4c515b
        error: "var(--border-error)", // #ff4d4f
        gray: "var(--border-300)", // #d4d4d4
        dark: "var(--color-dark)", // #171738
      },
      backgroundImage: {
        "gradient-button": "var(--color-background-gradient-button)",
        "gradient-login": "var(--color-background-gradient-login)",
      },
      colors: {
        // Text Colors
        title: "var(--color-text-primary)", // #7c5cff
        normal: "var(--color-text-secondary)", // #624fe2

        // Error Colors
        error: {
          50: "var(--color-error-50)", // #fdecec
          100: "var(--color-error-100)", // #fac5c5
          200: "var(--color-error-200)", // #f8a9a9
          300: "var(--color-error-300)", // #f48282
          400: "var(--color-error-400)", // #ff4d4f
          500: "var(--color-error-500)", // #e71010
          600: "var(--color-error-600)", // #cf1322
          700: "var(--color-error-700)", // #a8071a
          800: "var(--color-error-800)", // #820014
          900: "var(--color-error-900)", // #5c0011
          DEFAULT: "var(--color-error-400)",
          foreground: "var(--destructive-foreground)", // #fff
        },

        // Success Colors
        success: {
          50: "var(--color-success-50)", // #edfdf5
          100: "var(--color-success-100)", // #d1fae5
          200: "var(--color-success-200)", // #a7f3d0
          300: "var(--color-success-300)", // #6ee7b7
          400: "var(--color-success-400)", // #78eb7b
          500: "var(--color-success-500)", // #10b981
          600: "var(--color-success-600)", // #059669
          700: "var(--color-success-700)", // #047857
          800: "var(--color-success-800)", // #065f46
          900: "var(--color-success-900)", // #064e3b
          DEFAULT: "var(--color-success-500)",
          foreground: "var(--success-foreground)", // #fff
        },

        // Primary Colors
        primary: {
          50: "var(--color-primary-50)", // #f2e6ee
          100: "var(--color-primary-100)", // #ffccf2
          200: "var(--color-primary-200)", // #e0b8ff
          300: "var(--color-primary-300)", // #c19cff
          400: "var(--color-primary-400)", // #a280ff
          500: "var(--color-primary-500)", // #7c5cff
          600: "var(--color-primary-600)", // #624fe2
          700: "var(--color-primary-700)", // #3c2eff
          800: "var(--color-primary-800)", // #1d14c7
          900: "var(--color-primary-900)", // #0e0a64
          DEFAULT: "var(--color-primary-500)",
          foreground: "var(--primary-foreground)", // #fff
        },

        // Secondary Colors
        secondary: {
          50: "var(--color-secondary-50)", // #eff6ff
          100: "var(--color-secondary-100)", // #d0edff
          200: "var(--color-secondary-200)", // #a3dcff
          300: "var(--color-secondary-300)", // #6cbcff
          400: "var(--color-secondary-400)", // #409cff
          500: "var(--color-secondary-500)", // #007bff
          600: "var(--color-secondary-600)", // #0062cc
          700: "var(--color-secondary-700)", // #004a99
          800: "var(--color-secondary-800)", // #003166
          900: "var(--color-secondary-900)", // #001933
          DEFAULT: "var(--color-secondary-500)",
          foreground: "var(--secondary-foreground)", // #fff
        },

        // Core Colors
        background: "var(--background)", // #fff
        foreground: "var(--foreground)", // #0a0a0a
        card: {
          DEFAULT: "var(--card)", // #fff
          foreground: "var(--card-foreground)", // #0a0a0a
        },
        popover: {
          DEFAULT: "var(--popover)", // #fff
          foreground: "var(--popover-foreground)", // #0a0a0a
        },
        muted: {
          DEFAULT: "var(--muted)", // #f5f5f5
          foreground: "var(--muted-foreground)", // #737373
        },
        accent: {
          DEFAULT: "var(--accent)", // #f5f5f5
          foreground: "var(--accent-foreground)", // #171717
        },
        destructive: {
          DEFAULT: "var(--destructive)", // #ff4d4f
          foreground: "var(--destructive-foreground)", // #fff
        },
        border: "var(--border)", // #e5e5e5
        input: "var(--input)", // #e5e5e5
        ring: "var(--ring)", // #0a0a0a

        // Chart Colors
        chart: {
          1: "var(--chart-1)", // #3b82f6
          2: "var(--chart-2)", // #10b981
          3: "var(--chart-3)", // #ff4d4f
          4: "var(--chart-4)", // #c19cff
          5: "var(--chart-5)", // #facc15
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "2xs": "var(--shadow-2xs)",
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        rg: "var(--shadow-rg)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "2xl": "var(--shadow-2xl)",
        "3xl": "var(--shadow-3xl)",
        "4xl": "var(--shadow-4xl)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
