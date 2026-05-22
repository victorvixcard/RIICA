/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
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
          glow: "hsl(var(--primary-glow))",
          deep: "hsl(var(--primary-deep))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: "hsl(var(--success))",
        destructive: "hsl(var(--destructive))",
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        "surface-dark": {
          DEFAULT: "hsl(var(--surface-dark))",
          foreground: "hsl(var(--surface-dark-foreground))",
        },
        "chart-email": "hsl(var(--chart-email))",
        "chart-whatsapp": "hsl(var(--chart-whatsapp))",
        "chart-push": "hsl(var(--chart-push))",
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 6px)",
      },
      backgroundImage: {
        "gradient-hero":
          "radial-gradient(50% 70% at 80% 10%, hsl(var(--primary) / 0.08) 0%, transparent 60%), radial-gradient(40% 60% at 10% 80%, hsl(var(--primary) / 0.06) 0%, transparent 60%), linear-gradient(180deg, hsl(60 14% 99%) 0%, hsl(var(--background)) 100%)",
        "gradient-card":
          "linear-gradient(160deg, hsl(0 0% 100%) 0%, hsl(60 14% 98%) 100%)",
        "gradient-brand":
          "linear-gradient(135deg, hsl(var(--primary-deep)) 0%, hsl(var(--primary)) 100%)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "bounce-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(6px)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.6s ease-out both",
        "bounce-soft": "bounce-soft 2.4s ease-in-out infinite",
      },
      boxShadow: {
        soft: "0 1px 2px hsl(220 13% 9% / 0.04), 0 4px 12px -2px hsl(220 13% 9% / 0.06)",
        elevated:
          "0 4px 12px -2px hsl(220 13% 9% / 0.08), 0 16px 40px -8px hsl(220 13% 9% / 0.12)",
        brand: "0 10px 30px -8px hsl(var(--primary) / 0.35)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
