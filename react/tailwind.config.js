/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./index.tsx",
    "./.storybook/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // PayButton brand colors that can be used with Tailwind
        paybutton: {
          primary: '#4BC846',
          secondary: '#ffffff',
          tertiary: '#374151',
        },
        bch: {
          green: '#4BC846',
          orange: '#F7931A',
        },
        xec: {
          blue: '#0074C2',
        }
      },
      fontFamily: {
        paybutton: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      // Add common spacing values used in PayButton components
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      // Add shadows that match MUI elevation system
      boxShadow: {
        'mui-1': '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
        'mui-2': '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
        'mui-3': '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)',
      },
      // Add animation timing that matches MUI transitions
      transitionDuration: {
        '250': '250ms',
        '300': '300ms',
        '500': '500ms',
      },
      transitionTimingFunction: {
        'mui': 'cubic-bezier(0.4, 0, 0.2, 1)',
      }
    },
  },
  plugins: [],
  // Prevent Tailwind from conflicting with Material-UI classes
  corePlugins: {
    preflight: false, // Disable Tailwind's CSS reset to avoid conflicts
  },
}

