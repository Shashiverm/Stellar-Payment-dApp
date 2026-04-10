export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Sora", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        abyss: "#091022",
        pulse: "#42f5d7",
        ember: "#ff8d5e",
        frost: "#c8d8ff",
      },
      boxShadow: {
        plasma: "0 0 0 1px rgba(66,245,215,0.2), 0 12px 40px rgba(0,0,0,0.35)",
      },
      keyframes: {
        floatIn: {
          "0%": { opacity: 0, transform: "translateY(14px) scale(0.98)" },
          "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
        },
        pulseLine: {
          "0%, 100%": { opacity: 0.35 },
          "50%": { opacity: 0.85 },
        },
      },
      animation: {
        floatIn: "floatIn 500ms ease-out forwards",
        pulseLine: "pulseLine 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
