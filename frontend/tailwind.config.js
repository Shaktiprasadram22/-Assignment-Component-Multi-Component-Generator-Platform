/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Fira Code", "JetBrains Mono", "monospace"],
      },
      colors: {
        "primary-bg": "#0F172A",
        "panel-bg": "#1E293B",
        "sidebar-bg": "#111827",
        accent: "#6366F1",
        "text-primary": "#F1F5F9",
        "text-secondary": "#CBD5E1",
        "user-bubble": "#4ADE80",
        "ai-bubble": "#38BDF8",
      },
    },
  },
  plugins: [],
};
