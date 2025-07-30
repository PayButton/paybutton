import React, { useRef, useState, useLayoutEffect } from 'react';

import { Theme, ThemeName, useTheme } from '../../themes';
import { ButtonSize } from '../../util';

export type animation = 'slide' | 'invert' | 'none' | undefined;

export interface ButtonProps {
  animation?: animation;
  text?: string;
  hoverText?: string;
  theme?: ThemeName | Theme;
  disabled?: boolean;
  onClick?: () => void;
  size?: ButtonSize;
  sizeScaleAlreadyApplied?: boolean;
}

// Utility functions to generate Tailwind classes
const getSizeClasses = (size: ButtonSize) => {
  switch (size) {
    case 'xs': 
    case "extrasmall":
      return 'text-xs p-3 min-w-[6rem]'
    case 'sm':
    case "small":
      return 'text-sm p-3 min-w-[7rem]'
    case 'lg':
    case "large":
      return 'text-lg p-3 min-w-[12rem]'
    case 'xl':
    case "extralarge":
      return 'text-xl p-3 min-w-[14rem]'
    default:
      return 'text-base p-3 min-w-[10rem]'
  }
}

const getBorderRadius = (size: ButtonSize) => {
  switch (size) {
    case 'xs': 
    case "extrasmall":
      return 'rounded-lg' // More rounded for small buttons
    case 'sm':
    case "small":
      return 'rounded-xl' // Nice curve for small
    case 'lg':
    case "large":
      return 'rounded-2xl' // Generous rounding for large
    case 'xl':
    case "extralarge":
      return 'rounded-3xl' // Bold curves for extra large
    default:
      return 'rounded-xl' // Perfect balance for medium
  }
}

const getButtonClasses = (_theme: Theme, animation: animation, size: ButtonSize) => {
  const baseClasses = [
    // Layout and spacing - sizing handled by getSizeClasses
    'inline-flex',
    'items-center',
    'justify-center',
    'w-auto',
    
    // Typography
    'font-semibold', // Slightly bolder for better presence
    'text-center',
    'normal-case',
    'whitespace-nowrap',
    
    // Enhanced border and appearance
    'border-2',
    'bg-transparent',
    'backdrop-blur-sm', // Subtle backdrop blur for depth
    
    // Cursor
    'cursor-pointer',
    
    // Force border radius with important to override any existing styles
    '!rounded-none', // Reset any inherited radius first
    
    // Enhanced focus states
    'focus:ring-4',
    'focus:ring-dynamic',
    'focus:ring-offset-2',
    'focus:ring-offset-white',
    'focus:outline-none',
    
    // Enhanced hover effects with better styling
    'hover:shadow-xl', // More dramatic shadow
    'hover:shadow-current/20', // Shadow uses button color
    'hover:-translate-y-1', // More lift
    'hover:border-opacity-80',
    'active:translate-y-0',
    'active:shadow-lg',
    'active:scale-[0.98]', // Subtle press effect
    
    // Layout
    'relative',
    'overflow-hidden',
    'transform',
    'origin-center',
    
    // Enhanced disabled states
    'disabled:opacity-40',
    'disabled:cursor-not-allowed',
    'disabled:transform-none',
    'disabled:shadow-none',
    'disabled:border-opacity-30',
    
    // Size-specific classes (includes padding, text size, min-width)
    getSizeClasses(size),
    // Apply border radius with important to ensure it takes precedence
    `!${getBorderRadius(size)}`
  ];

  // Add animation-specific classes with enhanced styling
  if (animation === 'slide') {
    baseClasses.push(
      'bg-gradient-to-r', 
      'bg-[length:300%_100%]', 
      'bg-[100%_center]',
      'transition-all',
      'duration-500',
      'ease-out',
      'hover:bg-[length:250%_100%]' // Slight compression on hover for depth
    );
  } else if (animation === 'invert') {
    baseClasses.push(
      'transition-all', 
      'duration-300', 
      'ease-out',
      'hover:border-2' // Maintain border thickness
    );
  } else {
    // 'none' animation - enhanced basic transitions
    baseClasses.push(
      'transition-all', 
      'duration-250',
      'ease-out',
      'hover:border-opacity-90'
    );
  }

  return baseClasses.join(' ');
}

const getInlineStyles = (theme: Theme, animation: animation, size: ButtonSize) => {
  // Get border radius value based on size
  const getBorderRadiusValue = (size: ButtonSize) => {
    switch (size) {
      case 'xs': 
      case "extrasmall":
        return '0.5rem' // rounded-lg equivalent
      case 'sm':
      case "small":
        return '0.75rem' // rounded-xl equivalent
      case 'lg':
      case "large":
        return '1rem' // rounded-2xl equivalent
      case 'xl':
      case "extralarge":
        return '1.5rem' // rounded-3xl equivalent
      default:
        return '0.75rem' // rounded-xl equivalent
    }
  }

  // Get min-width value to ensure it's applied
  const getMinWidthValue = (size: ButtonSize) => {
    switch (size) {
      case 'xs': 
      case "extrasmall":
        return '6rem' // 96px
      case 'sm':
      case "small":
        return '7rem' // 112px
      case 'lg':
      case "large":
        return '12rem' // 192px
      case 'xl':
      case "extralarge":
        return '14rem' // 224px
      default:
        return '10rem' // 160px
    }
  }

  // Get padding value to ensure it's applied
  const getPaddingValue = () => {
    // All sizes use 12px padding as requested
    return '12px'; // p-3 equivalent for all sizes
  }

  const styles: React.CSSProperties = {
    // Outline button base styles
    color: theme.palette.primary,
    borderColor: theme.palette.primary,
    backgroundColor: 'transparent',
    
    // Force border radius in CSS to ensure it's applied
    borderRadius: getBorderRadiusValue(size),
    
    // Force min-width in CSS to ensure it's applied
    minWidth: getMinWidthValue(size),
    
    // Force padding in CSS to ensure it's applied
    padding: getPaddingValue(),
    
    // Force cursor pointer to ensure it's applied
    cursor: 'pointer',
    
    // Focus ring color (using CSS custom properties for dynamic theming)
    '--tw-ring-color': `${theme.palette.primary}30`, // 30 is alpha in hex (about 18% opacity)
    
    // Ensure smooth transitions
    transition: animation === 'slide' 
      ? 'background-position 0.5s ease-out, color 0.3s ease-out, border-color 0.3s ease-out, transform 0.25s ease-out, box-shadow 0.25s ease-out'
      : 'all 0.3s ease-out',
  } as React.CSSProperties & { '--tw-ring-color': string };

  if (animation === 'slide') {
    // For slide animation: gradient goes from primary (left) to secondary (right)
    // Start position shows secondary color (transparent background)
    styles.background = `linear-gradient(45deg, ${theme.palette.primary} 50%, transparent 50%)`;
    styles.backgroundSize = '300% 100%';
    styles.backgroundPosition = '100% center'; // Shows transparent part initially
  }

  return styles;
}

const getHoverHandlers = (animation: animation, theme: Theme) => {
  return {
    onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
      const target = e.currentTarget;
      if (animation === 'slide') {
        // Slide to show the primary color background
        target.style.backgroundPosition = '0% center';
        target.style.color = theme.palette.secondary;
        target.style.borderColor = theme.palette.primary;
      } else if (animation === 'invert') {
        target.style.backgroundColor = theme.palette.primary;
        target.style.color = theme.palette.secondary;
        target.style.borderColor = theme.palette.primary;
      } else {
        // 'none' animation - simple fill effect
        target.style.backgroundColor = theme.palette.primary;
        target.style.color = theme.palette.secondary;
        target.style.borderColor = theme.palette.primary;
      }
    },
    onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
      const target = e.currentTarget;
      if (animation === 'slide') {
        // Slide back to transparent
        target.style.backgroundPosition = '100% center';
        target.style.color = theme.palette.primary;
        target.style.borderColor = theme.palette.primary;
      } else if (animation === 'invert') {
        target.style.backgroundColor = 'transparent';
        target.style.color = theme.palette.primary;
        target.style.borderColor = theme.palette.primary;
      } else {
        // 'none' animation - restore outline style
        target.style.backgroundColor = 'transparent';
        target.style.color = theme.palette.primary;
        target.style.borderColor = theme.palette.primary;
      }
    }
  };
}

export const Button = (props: ButtonProps): React.ReactElement => {
  const { animation, text, hoverText, disabled, size } = Object.assign(
    {},
    Button.defaultProps,
    props,
  );

  const [hovering, setHovering] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const timer = useRef<number>();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const theme = useTheme(props.theme);
  
  // Get Tailwind classes and styles
  const buttonClasses = getButtonClasses(theme, animation, size!);
  const buttonStyles = getInlineStyles(theme, animation, size!);
  const hoverHandlers = getHoverHandlers(animation, theme);

  const handleClick = (): void => {
    if (!props.onClick) return;
    
    // If button is currently hovered, add a small delay to allow 
    // the scale-down animation to complete when hover state is lost
    if (hovering) {
      setTimeout(() => {
        props.onClick?.();
      }, 100); // Shorter delay for better UX
    } else {
      // No delay needed if not hovered
      props.onClick();
    }
  };

  useLayoutEffect(() => {
    if (buttonRef !== null && text) {
      const { current } = buttonRef;
      if (current !== null) {
        const { style } = current;
        // Set fixed width to prevent size changes when text changes on hover
        style.width = `${current.clientWidth}px`;
        // Keep the height fixed too for consistency
        style.height = `${current.clientHeight + 4}px`;
      }
    }
  }, [text, buttonRef]);

  const handleMouseEnter = (): void => {
    setHovering(true);
    if (animation === 'none') return;
    setTransitioning(true);
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setTransitioning(false), 150);
  };

  const handleMouseLeave = (): void => {
    setHovering(false);
    if (animation === 'none') return;
    setTransitioning(true);
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setTransitioning(false), 150);
  };

  return (
    <div className="inline-block">
      <button
        disabled={disabled}
        className={buttonClasses}
        style={buttonStyles}
        onClick={handleClick}
        onMouseEnter={(e) => {
          handleMouseEnter();
          hoverHandlers.onMouseEnter(e);
        }}
        onMouseLeave={(e) => {
          handleMouseLeave();
          hoverHandlers.onMouseLeave(e);
        }}
        ref={buttonRef}
      >
        <span>{transitioning !== hovering ? hoverText : (text && text.trim() !== "" ? text : <div>&nbsp;</div>)}</span>
      </button>
    </div>
  );
};

const buttonDefaultProps: ButtonProps = {
  animation: 'slide',
  text: 'Donate',
  hoverText: 'Send Payment',
  disabled: false,
  size: 'medium',
  sizeScaleAlreadyApplied: false,
};

Button.defaultProps = buttonDefaultProps;

export default Button;
