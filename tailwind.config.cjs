/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#797676",
        "primary-dark": "#5A5757",
        "primary-container": "#F0EEEE",
        "ai-purple": "#8B6A1C",
        "ai-purple-light": "#F6EDD8",
        surface: "#FAFAF9",
        "surface-low": "#F4F2F1",
        "surface-container": "#EDEBE9",
        "surface-high": "#E5E2E0",
        "on-surface": "#1A1918",
        "on-surface-2": "#706E6D",
        outline: "#E4E1DF",
        success: "#4A7C59",
        "success-light": "#EAF2EC",
        warning: "#C07A2C",
        danger: "#B94040",

        // Legacy kept for backward compat
        ink: "#1A1918",
        mist: "#FAFAF9",
        line: "#E4E1DF",
        panel: "#ffffff",
        navy: "#14213d",
        brand: "#797676",
        lilac: "#9E9B9B",
        aqua: "#6BA8B8",
      },
      fontSize: {
        h1: ["44px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" }],
        h2: ["30px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "600" }],
        h3: ["22px", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.65", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "1.65", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "1.55", fontWeight: "400" }],
        "label-caps": ["11px", { lineHeight: "1", letterSpacing: "0.1em", fontWeight: "600" }],
        "label-md": ["13px", { lineHeight: "1", letterSpacing: "0.02em", fontWeight: "600" }],
        "label-sm": ["11px", { lineHeight: "1", letterSpacing: "0.04em", fontWeight: "500" }]
      },
      borderRadius: {
        DEFAULT: "0.625rem",
        md: "0.875rem",
        lg: "1.125rem",
        xl: "1.375rem",
        full: "9999px",
        shell: "1.375rem"
      },
      boxShadow: {
        soft: "0 1px 3px rgba(26,25,24,0.06), 0 4px 16px rgba(26,25,24,0.04)",
        card: "0 1px 2px rgba(26,25,24,0.05), 0 2px 8px rgba(26,25,24,0.04)",
        float: "0 8px 32px rgba(26,25,24,0.10)"
      },
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
