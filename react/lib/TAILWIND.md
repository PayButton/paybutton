# Tailwind CSS Integration for PayButton

This document explains how to use Tailwind CSS with PayButton components.

## Setup

Tailwind CSS has been integrated into the PayButton project but is **opt-in** to avoid conflicts with existing Material-UI styling.

### For Development

If you're working on the PayButton library itself:

1. Tailwind CSS is already installed as a dev dependency
2. Use `npm run build:tailwind` to build the Tailwind CSS
3. Use `npm run watch:tailwind` to watch for changes during development

### For Consumers

If you're using PayButton in your project and want to use Tailwind utilities:

#### Option 1: Import the pre-built CSS (Recommended)

```javascript
// Import PayButton components
import { PayButton, Widget } from '@paybutton/react';

// Import the Tailwind CSS (optional)
import '@paybutton/react/dist/tailwind.css';
```

#### Option 2: Import the source and configure your own build

```javascript
// Import PayButton components
import { PayButton, Widget } from '@paybutton/react';

// Import the Tailwind source (requires your build system to process it)
import '@paybutton/react/lib/styles/tailwind.css';
```

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

1. **CSS Reset Disabled**: Tailwind's CSS reset (preflight) is disabled to prevent conflicts with Material-UI
2. **Co-existence**: Tailwind classes work alongside existing Material-UI styling
3. **Future Migration**: This setup prepares for gradual migration from Material-UI to Tailwind
4. **Opt-in**: Tailwind styles are only included if explicitly imported
5. **Verified Working**: Tailwind CSS has been tested and confirmed working in Storybook and build processes
6. **Enhanced UX**: Button components include subtle Tailwind hover animations for improved user experience

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
