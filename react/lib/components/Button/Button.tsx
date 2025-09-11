import { Button as MuiButton, makeStyles } from '@material-ui/core';
import { CreateCSSProperties } from '@material-ui/styles';
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

interface StyleProps {
  animation: animation;
  theme: Theme;
  size: ButtonProps['size'];
  sizeScaleAlreadyApplied: ButtonProps['sizeScaleAlreadyApplied'];
}

const useStyles = makeStyles({
  container: ({ size }: StyleProps) => {
    switch (size) {
      case 'xs': 
      case "extrasmall":
        return {
          fontSize: '0.6rem !important',
        }
      case 'sm':
      case "small":
        return {
          fontSize: '0.7rem !important',
        }
      case 'lg':
      case "large":
        return {
          fontSize: '1rem !important',
        }
      case 'xl':
      case "extralarge":
        return {
          fontSize: '1.2rem !important',
        }
      default:
        return {
          fontSize: '0.8rem !important',
        }
    }
  },
  button: ({ theme, animation, size }: StyleProps): CreateCSSProperties => {

    const radiusBySize = {
      xs: '5px',
      extrasmall: '5px',
      sm: '7px',
      small: '7px',
      lg: '12px',
      large: '12px',
      xl: '13px',
      extralarge: '13px',
      md: '10px',
      medium: '10px'
    };
  
    const borderRadius = radiusBySize[(size ?? 'default') as keyof typeof radiusBySize];

    return {
      background: `${theme.palette.secondary} !important`,
      transition: '0.6s !important', 
      ...(animation === 'slide'
        ? {
            background: `linear-gradient(45deg, ${theme.palette.primary} 50%, ${theme.palette.secondary} 50%) 100% center / 300% !important`,
            backgroundSize: '300% !important',
            backgroundPosition: '100% !important',
            transition: 'background-position 0.8s, color 0.15s !important',
          }
        : {}),
      color: `${theme.palette.primary} !important`,
      minWidth: '14em !important',
      padding: '0.618em 1.618em !important',
      margin: 'auto !important',
      boxShadow: '3px 3px 3px rgba(0, 0, 0, 0.08) !important',
      border: `2px solid ${theme.palette.primary} !important`,
      borderRadius: `${borderRadius} !important`,
      fontSize: '1em !important',
      textTransform: 'none',
      '&:hover': {
        ...(animation === 'slide'
          ? {
              backgroundPosition: '0 !important',
              color: `${theme.palette.secondary} !important`,
            }
          : {}),
        ...(animation === 'invert'
          ? {
              background: `${theme.palette.primary} !important`,
              color: `${theme.palette.secondary} !important`,
            }
          : {}),
        ...(animation === 'none'
          ? {
              background: `${theme.palette.secondary} !important`,
              color: `${theme.palette.primary} !important`,
            }
          : {}),
      },
      '& .MuiTouchRipple-root': {
        margin: -2,
        color: '#00000044 !important',
      },
      '&:disabled span': {
        filter: 'blur(2px)',
        color: 'rgba(0, 0, 0, 0.5)',
      },
    };
  },
});

export const Button = ({
  animation = 'slide',
  text = 'Donate',
  hoverText = 'Send Payment',
  disabled = false,
  size = 'medium',
  sizeScaleAlreadyApplied = false,
  onClick,
  theme: themeProp,
}: ButtonProps): React.ReactElement => {

  const [hovering, setHovering] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const timer = useRef<number>();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const theme = useTheme(themeProp);
  const styleProps: StyleProps = { animation, theme, size, sizeScaleAlreadyApplied };
  const classes = useStyles(styleProps);

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
    <div className={classes.container}>
      <MuiButton
        disabled={disabled}
        className={classes.button}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={buttonRef}
      >
        <span> {transitioning !== hovering ? hoverText : (text && text.trim() !== "" ? text : <div>&nbsp;</div>)}
        </span>
      </MuiButton>
    </div>
  );
};

export default Button;
