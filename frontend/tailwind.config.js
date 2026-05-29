/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gym: {
          pitch: "#09090b",   // Deep pitch black
          steel: "#141416",   // Sleek tech gray
          card: "#1e1e21",    // Luxury card container
          silver: "#e4e4e7",  // Silver metallic
          crimson: "#dc2626", // Elegant red
          neon: "#ff2e2e",    // Glowing neon red
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon-red': '0 0 15px rgba(255, 46, 46, 0.4)',
        'neon-red-strong': '0 0 25px rgba(255, 46, 46, 0.75)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        }
      }
    },
  },
  plugins: [],
}
