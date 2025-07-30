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
      return 'text-[0.6rem]'
    case 'sm':
    case "small":
      return 'text-[0.7rem]'
    case 'lg':
    case "large":
      return 'text-base'
    case 'xl':
    case "extralarge":
      return 'text-xl'
    default:
      return 'text-[0.8rem]'
  }
}

const getBorderRadius = (size: ButtonSize) => {
  switch (size) {
    case 'xs': 
    case "extrasmall":
      return 'rounded-[5px]'
    case 'sm':
    case "small":
      return 'rounded-[7px]'
    case 'lg':
    case "large":
      return 'rounded-xl'
    case 'xl':
    case "extralarge":
      return 'rounded-[13px]'
    default:
      return 'rounded-[10px]'
  }
}

const getButtonClasses = (_theme: Theme, animation: animation, size: ButtonSize) => {
  const baseClasses = [
    // Layout and spacing
    'min-w-[14em]',
    'px-5',
    'py-2.5',
    'mx-auto',
    
    // Typography
    'font-medium',
    'text-center',
    'normal-case',
    
    // Border and appearance
    'border-2',
    'bg-transparent',
    
    // Focus states
    'focus:ring-4',
    'focus:ring-dynamic',
    'focus:outline-none',
    
    // Layout
    'relative',
    'overflow-hidden',
    'transform',
    'origin-center',
    
    // Disabled states
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'disabled:blur-[1px]',
    
    // Size-specific text size and border radius
    getSizeClasses(size),
    getBorderRadius(size)
  ];

  // Add animation-specific classes - remove conflicting transitions
  if (animation === 'slide') {
    baseClasses.push(
      'bg-gradient-to-r', 
      'bg-[length:300%_100%]', 
      'bg-[100%_center]'
      // No transition classes here - handled by inline styles
    );
  } else if (animation === 'invert') {
    baseClasses.push(
      'transition-all', 
      'duration-300', 
      'ease-in-out'
    );
  } else {
    // 'none' animation - basic transitions
    baseClasses.push(
      'transition-colors', 
      'duration-200'
    );
  }

  return baseClasses.join(' ');
}

const getInlineStyles = (theme: Theme, animation: animation) => {
  const styles: React.CSSProperties = {
    // Outline button base styles
    color: theme.palette.primary,
    borderColor: theme.palette.primary,
    backgroundColor: 'transparent',
    
    // Focus ring color (using CSS custom properties for dynamic theming)
    '--tw-ring-color': `${theme.palette.primary}30`, // 30 is alpha in hex (about 18% opacity)
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
        target.style.color = theme.palette.secondary; // White text on colored background
      } else if (animation === 'invert') {
        target.style.backgroundColor = theme.palette.primary;
        target.style.color = theme.palette.secondary;
      } else {
        // 'none' animation - simple fill effect
        target.style.backgroundColor = theme.palette.primary;
        target.style.color = theme.palette.secondary;
      }
    },
    onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
      const target = e.currentTarget;
      if (animation === 'slide') {
        // Slide back to transparent
        target.style.backgroundPosition = '100% center';
        target.style.color = theme.palette.primary; // Primary text on transparent background
      } else if (animation === 'invert') {
        target.style.backgroundColor = 'transparent';
        target.style.color = theme.palette.primary;
      } else {
        // 'none' animation - restore outline style
        target.style.backgroundColor = 'transparent';
        target.style.color = theme.palette.primary;
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
  const containerClasses = getSizeClasses(size!);
  const buttonStyles = getInlineStyles(theme, animation);
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
        style.width = `${current.clientWidth}px`;
        // +4 is a seemingly magic number but it works.
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
    <div className={`transition-all duration-300 hover:scale-105 origin-center ${containerClasses}`}>
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
