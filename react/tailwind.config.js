/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./index.tsx"
  ],
  theme: {
    extend: {
      colors: {
        // PayButton brand colors that can be used with Tailwind
        'paybutton': {
          primary: '#4BC846',
          secondary: '#ffffff',
          tertiary: '#374151',
        },
        'bch': {
          green: '#4BC846',
          orange: '#F7931A',
        },
        'xec': {
          blue: '#0074C2',
        }
      },
      fontFamily: {
        'paybutton': ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
  // Prevent Tailwind from conflicting with Material-UI classes
  corePlugins: {
    preflight: false, // Disable Tailwind's CSS reset to avoid conflicts
  },
}

