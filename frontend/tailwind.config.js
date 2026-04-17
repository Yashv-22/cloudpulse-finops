/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        'ibm-plex': ['IBM Plex Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: { primary: '#007AFF', hover: '#005BB5' },
        severity: {
          critical: '#FF3B30',
          high: '#FF9500',
          medium: '#FFCC00',
          low: '#34C759',
          monitor: '#8E8E93',
        },
      },
    },
  },
  plugins: [],
};
