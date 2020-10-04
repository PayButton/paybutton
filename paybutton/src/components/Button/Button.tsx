import { Button as MuiButton, makeStyles } from '@material-ui/core';
import { CreateCSSProperties } from '@material-ui/styles';
import React, { useRef, useState } from 'react';

import { Theme, ThemeName, useTheme } from '../../themes';

type animation = 'slide' | 'invert' | 'none';

export interface ButtonProps {
  animation?: animation;
  borderRadius?: number | string;
  size?: number;
  children?: string;
  hoverText?: string;
  onClick?: () => void;
  theme?: ThemeName | Theme;
}

interface StyleProps {
  animation: animation;
  borderRadius: number | string;
  size: number;
  theme: Theme;
}

const useStyles = makeStyles({
  container: {
    fontSize: (props: StyleProps): string => `${props.size / 100}rem`,
  },
  button: ({ theme, ...props }: StyleProps): CreateCSSProperties => ({
    background: theme.palette.secondary,
    transition: '0.6s',
    ...(props.animation === 'slide'
      ? {
          background: `linear-gradient(45deg, ${theme.palette.primary} 50%, ${theme.palette.secondary} 50%)`,
          backgroundSize: '300%',
          backgroundPosition: '100%',
          transition: 'background-position 0.8s, color 0.15s',
        }
      : {}),
    color: theme.palette.primary,
    minWidth: '14em',
    padding: '0.618em 1.618em',
    margin: 'auto',
    boxShadow: '3px 3px 3px rgba(0, 0, 0, 0.08)',
    border: `2px solid ${theme.palette.primary}`,
    borderRadius: props.borderRadius,
    fontSize: '1em',
    textTransform: 'none',
    '&:hover': {
      ...(props.animation === 'slide'
        ? {
            backgroundPosition: 0,
            color: theme.palette.secondary,
          }
        : {}),
      ...(props.animation === 'invert'
        ? {
            background: theme.palette.primary,
            color: theme.palette.secondary,
          }
        : {}),
      ...(props.animation === 'none'
        ? {
            background: theme.palette.secondary,
            color: theme.palette.primary,
          }
        : {}),
    },
    '& .MuiTouchRipple-root': {
      margin: -2,
      color: '#00000044',
    },
  }),
});

export const Button = (props: ButtonProps): React.ReactElement => {
  const {
    size = 80,
    animation = 'slide',
    children = 'Donate',
    hoverText = 'Click to send BCH',
  } = props;

  const [hovering, setHovering] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const timer = useRef<number>();

  const borderRadius = props.borderRadius ?? size / 8;

  const theme = useTheme(props.theme);
  const styleProps: StyleProps = { animation, borderRadius, size, theme };
  const classes = useStyles(styleProps);

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

  const text = transitioning !== hovering ? hoverText : children;

  return (
    <div className={classes.container}>
      <MuiButton
        className={classes.button}
        onClick={props.onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span>{text}</span>
      </MuiButton>
    </div>
  );
};

export default Button;
