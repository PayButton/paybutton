# Tailwind CSS Integration for PayButton Development

This document explains how Tailwind CSS is integrated for **internal PayButton development**.

## Purpose

Tailwind CSS is used **internally by PayButton developers** to:
- 🎨 Style PayButton components with utility classes
- ✨ Add subtle animations and effects (like button hover animations)
- 🚀 Speed up development with utility-first CSS
- 🔧 Gradually migrate from Material-UI to Tailwind CSS

**Note**: Tailwind CSS is **not exposed to consumers** - it's compiled into the final bundle as regular CSS.

## Setup

Tailwind CSS has been integrated into the PayButton development workflow but is **internal only** to avoid conflicts with consumer projects.

### For PayButton Development

If you're working on the PayButton library itself:

1. Tailwind CSS is already installed as a dev dependency
2. Use `npm run build:tailwind` to build the Tailwind CSS
3. Use `npm run watch:tailwind` to watch for changes during development
4. Use `npm run dev` to start both Storybook and Tailwind watching

### For Consumers (Library Users)

**No action required!** Consumers simply import PayButton as usual:

```javascript
// Import PayButton components - styling is already included
import { PayButton, Widget } from '@paybutton/react';

// No additional imports needed - Tailwind styles are compiled into the components
```

The Tailwind styles are compiled and bundled into the distributed CSS, so consumers get the benefits (smooth animations, responsive design) without any Tailwind dependency.

## Custom Theme Colors

The Tailwind configuration includes PayButton-specific colors:

```css
/* Available as Tailwind classes */
.text-paybutton-primary      /* #4BC846 */
.text-paybutton-secondary    /* #ffffff */
.text-paybutton-tertiary     /* #374151 */

.text-bch-green             /* #4BC846 */
.text-bch-orange            /* #F7931A */

.text-xec-blue              /* #0074C2 */

/* And corresponding background, border, etc. classes */
.bg-paybutton-primary
.border-bch-green
/* etc. */
```

## Important Notes

1. **Development Tool**: Tailwind CSS is a development tool for PayButton maintainers, not exposed to end users
2. **CSS Reset Disabled**: Tailwind's CSS reset (preflight) is disabled to prevent conflicts with Material-UI
3. **Co-existence**: Tailwind classes work alongside existing Material-UI styling during development
4. **Compiled Output**: Tailwind styles are compiled to regular CSS in the final build
5. **Enhanced UX**: Used for features like button hover animations (`transition-all duration-300 hover:scale-105 origin-center`)
6. **Storybook Integration**: Tailwind CSS is available in Storybook for component development
7. **Zero Consumer Impact**: Consumers receive compiled CSS without any Tailwind dependency

## Testing Tailwind Integration

To verify Tailwind is working in your project:

```html
<!-- Basic test: This should appear as a red box with white text -->
<div className="bg-red-500 text-white p-4 rounded">
  Tailwind is working!
</div>
```

For PayButton custom colors:
```html
<!-- This should appear with PayButton's green color -->
<div className="bg-paybutton-primary text-white p-4 rounded">
  PayButton colors work!
</div>
```

## Migration Strategy

The Tailwind integration is designed for gradual adoption:

1. **Phase 1** (Current): Tailwind available as opt-in, all existing styling unchanged
2. **Phase 2** (Future): Gradual component migration from Material-UI to Tailwind
3. **Phase 3** (Future): Complete migration with Material-UI removal

## Development Workflow

For PayButton development with Tailwind:

```bash
# Start development with Tailwind watching
npm run dev & npm run watch:tailwind

# Or manually build Tailwind
npm run build:tailwind

# Full build (includes Tailwind)
npm run build
```
