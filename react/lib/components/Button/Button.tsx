import { Button as MuiButton, makeStyles } from '@material-ui/core';
import { CreateCSSProperties } from '@material-ui/styles';
import React, { useRef, useState, useLayoutEffect } from 'react';

import { Theme, ThemeName, useTheme } from '../../themes';

export type animation = 'slide' | 'invert' | 'none' | undefined;

export interface ButtonProps {
  animation?: animation;
  text?: string;
  hoverText?: string;
  theme?: ThemeName | Theme;
  disabled?: boolean;
  onClick?: () => void;
}

interface StyleProps {
  animation: animation;
  theme: Theme;
}

const useStyles = makeStyles({
  container: {
    fontSize: '0.8rem !important',
  },
  button: ({ theme, ...props }: StyleProps): CreateCSSProperties => ({
    background: `${theme.palette.secondary} !important`,
    transition: '0.6s !important',
    ...(props.animation === 'slide'
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
    borderRadius: '10px !important',
    fontSize: '1em !important',
    textTransform: 'none',
    '&:hover': {
      ...(props.animation === 'slide'
        ? {
            backgroundPosition: '0 !important',
            color: `${theme.palette.secondary} !important`,
          }
        : {}),
      ...(props.animation === 'invert'
        ? {
            background: `${theme.palette.primary} !important`,
            color: `${theme.palette.secondary} !important`,
          }
        : {}),
      ...(props.animation === 'none'
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
  }),
});

export const Button = (props: ButtonProps): React.ReactElement => {
  const { animation, text, hoverText, disabled } = Object.assign(
    {},
    Button.defaultProps,
    props,
  );

  const [hovering, setHovering] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const timer = useRef<number>();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const theme = useTheme(props.theme);
  const styleProps: StyleProps = { animation, theme };
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
        onClick={props.onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={buttonRef}
      >
        <span>{transitioning !== hovering ? hoverText : text}</span>
      </MuiButton>
    </div>
  );
};

const buttonDefaultProps: ButtonProps = {
  animation: 'slide',
  text: 'Donate',
  hoverText: 'Send Payment',
  disabled: false,
};

Button.defaultProps = buttonDefaultProps;

export default Button;
