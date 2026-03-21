import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'
import containerQueries from '@tailwindcss/container-queries'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface": "#131315",
        "on-secondary": "#003825",
        "surface-container-lowest": "#0e0e10",
        "on-background": "#e5e1e4",
        "tertiary": "#ffd2d5",
        "on-tertiary-fixed": "#400010",
        "error": "#ffb4ab",
        "on-surface-variant": "#bbc9cd",
        "on-tertiary": "#67001f",
        "error-container": "#93000a",
        "on-error-container": "#ffdad6",
        "on-primary": "#00363e",
        "tertiary-fixed": "#ffdadc",
        "primary-fixed-dim": "#2fd9f4",
        "tertiary-container": "#ffaab2",
        "surface-container": "#201f22",
        "primary-container": "#22d3ee",
        "inverse-on-surface": "#313032",
        "surface-container-high": "#2a2a2c",
        "surface-container-highest": "#353437",
        "surface-dim": "#131315",
        "secondary": "#45dfa4",
        "on-secondary-container": "#00452e",
        "outline": "#859397",
        "inverse-surface": "#e5e1e4",
        "on-primary-fixed-variant": "#004e5a",
        "on-primary-fixed": "#001f25",
        "on-primary-container": "#005763",
        "on-surface": "#e5e1e4",
        "outline-variant": "#3c494c",
        "surface-container-low": "#1c1b1d",
        "primary-fixed": "#a2eeff",
        "on-tertiary-container": "#94223a",
        "tertiary-fixed-dim": "#ffb2b9",
        "background": "#131315",
        "on-tertiary-fixed-variant": "#891933",
        "secondary-container": "#00bd85",
        "primary": "#8aebff",
        "on-secondary-fixed-variant": "#005137",
        "surface-bright": "#39393b",
        "surface-variant": "#353437",
        "surface-tint": "#2fd9f4",
        "inverse-primary": "#006877",
        "secondary-fixed": "#68fcbf",
        "on-error": "#690005",
        "secondary-fixed-dim": "#45dfa4",
        "on-secondary-fixed": "#002114"
      },
      fontFamily: {
        "headline": ["Space Grotesk", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"],
        "mono": ["JetBrains Mono", "monospace"]
      },
      borderRadius: {
        "DEFAULT": "0px",
        "lg": "0px",
        "xl": "0px",
        "full": "9999px"
      },
      keyframes: {
        scan: {
          "0%": { top: "0%", opacity: "0" },
          "5%": { opacity: "1" },
          "95%": { opacity: "1" },
          "100%": { top: "100%", opacity: "0" }
        }
      },
      animation: {
        "scan": "scan 3s linear infinite"
      }
    },
  },
  plugins: [
    forms,
    containerQueries,
  ],
} satisfies Config
