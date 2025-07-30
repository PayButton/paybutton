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

The Tailwind integration is designed for **gradual MUI → Tailwind migration**:

### **Phase 1** (✅ Current): Foundation & Coexistence
- ✅ Tailwind CSS installed and configured
- ✅ Custom PayButton theme colors defined
- ✅ Storybook integration for development
- ✅ MUI and Tailwind classes working side-by-side
- ✅ CSS reset disabled to prevent conflicts
- ✅ Initial enhancements (button hover animations)

### **Phase 2** (🔄 Ready): Component-by-Component Migration
Target components for migration (in suggested order):

1. **Button Component** (`lib/components/Button/`)
   - Replace `makeStyles` with Tailwind classes
   - Keep existing props/API unchanged
   - Already has Tailwind animations added

2. **PaymentDialog** (`lib/components/PaymentDialog/`)
   - Replace MUI `Dialog` with custom Tailwind modal
   - Maintain existing functionality and animations

3. **Widget Components** (`lib/components/Widget/`)
   - Replace MUI layout components with Tailwind flexbox/grid
   - Migrate complex `makeStyles` to utility classes

### **Phase 3** (🎯 Future): Complete Migration
- Remove `@material-ui/core` dependency
- Enable Tailwind's CSS reset (`preflight: true`)
- Final bundle size optimization
- Full utility-first CSS approach

### **Migration Guidelines**

For each component migration:

```tsx
// BEFORE (MUI):
const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    backgroundColor: '#4BC846',
    borderRadius: '8px',
  }
});

// AFTER (Tailwind):
<div className="flex flex-col p-4 bg-paybutton-primary rounded-lg">
```

**Benefits of gradual migration:**
- ✅ No breaking changes for consumers
- ✅ Reduced risk (test each component individually)
- ✅ Maintain existing functionality during transition
- ✅ Smaller, more focused PRs
- ✅ Bundle size decreases with each migration

## Development Workflow

For PayButton development with Tailwind:

```bash
# Start development with Tailwind watching
npm run dev  # Includes both Storybook and Tailwind watching

# Or run separately:
npm run storybook       # Start Storybook
npm run watch:tailwind  # Watch Tailwind changes

# Build Tailwind CSS manually
npm run build:tailwind

# Full build (includes Tailwind CSS compilation)
npm run build
```

## Migration Helper Tools

### **Common MUI → Tailwind Conversions**

```tsx
// Flexbox layouts
makeStyles({ display: 'flex', flexDirection: 'column' })
// → className="flex flex-col"

// Spacing
makeStyles({ padding: '16px', margin: '8px' })
// → className="p-4 m-2"

// Colors
makeStyles({ backgroundColor: '#4BC846', color: '#ffffff' })
// → className="bg-paybutton-primary text-white"

// Shadows (MUI elevation)
makeStyles({ boxShadow: theme.shadows[1] })
// → className="shadow-mui-1"

// Transitions
makeStyles({ transition: theme.transitions.create(['transform']) })
// → className="transition-transform duration-300 ease-mui"
```

### **Component Migration Checklist**

For each component being migrated:

- [ ] **Backup**: Create branch for the component migration
- [ ] **Inventory**: List all `makeStyles` objects to convert
- [ ] **Convert**: Replace MUI classes with Tailwind utilities
- [ ] **Test**: Verify visual appearance in Storybook
- [ ] **Props**: Ensure all component props still work
- [ ] **Types**: Update TypeScript interfaces if needed  
- [ ] **Stories**: Update Storybook stories if necessary
- [ ] **Bundle**: Check that bundle size decreased

### **MUI Dependencies Audit**

Current MUI usage in codebase:
- `Button.tsx`: `makeStyles`, `MuiButton`
- `Widget.tsx`: `makeStyles`, layout components
- `AltpaymentWidget.tsx`: `makeStyles`, layout components  
- `PaymentDialog.tsx`: `Dialog`, `Zoom` components

**Migration Priority**: Start with `Button.tsx` (already has Tailwind animations) → `PaymentDialog.tsx` → `Widget` components
