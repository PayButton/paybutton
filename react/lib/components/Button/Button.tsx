import { Button as MuiButton } from '@mui/material';
import { styled } from '@mui/system'

import  { useRef, useState, useLayoutEffect } from 'react';

import { ButtonTheme, ButtonThemeName, useButtonTheme } from '../../buttonThemes';

export type animation = 'slide' | 'invert' | 'none' | undefined;

export interface ButtonProps {
  animation?: animation;
  text?: string;
  hoverText?: string;
  buttonTheme?: ButtonThemeName | ButtonTheme;
  disabled?: boolean;
  onClick?: () => void;
}

interface StyleProps {
  animation: animation;
  buttonTheme: ButtonTheme;
}

const WIPcontainer = {
  fontSize: '0.8rem !important',
}

const StyledButton = styled(MuiButton)(({ buttonTheme, ...props }: StyleProps) => ({
  background: `${buttonTheme.palette.secondary} !important`,
  transition: '0.6s !important',
  ...(props.animation === 'slide'
    ? {
      background: `linear-gradient(45deg, ${buttonTheme.palette.primary} 50%, ${buttonTheme.palette.secondary} 50%) 100% center / 300% !important`,
      backgroundSize: '300% !important',
      backgroundPosition: '100% !important',
      transition: 'background-position 0.8s, color 0.15s !important',
    }
    : {}),
  color: `${buttonTheme.palette.primary} !important`,
  minWidth: '14em !important',
  padding: '0.618em 1.618em !important',
  margin: 'auto !important',
  boxShadow: '3px 3px 3px rgba(0, 0, 0, 0.08) !important',
  border: `2px solid ${buttonTheme.palette.primary} !important`,
  borderRadius: '10px !important',
  fontSize: '1em !important',
  textTransform: 'none',
  '&:hover': {
    ...(props.animation === 'slide'
      ? {
        backgroundPosition: '0 !important',
        color: `${buttonTheme.palette.secondary} !important`,
      }
      : {}),
    ...(props.animation === 'invert'
      ? {
        background: `${buttonTheme.palette.primary} !important`,
        color: `${buttonTheme.palette.secondary} !important`,
      }
      : {}),
    ...(props.animation === 'none'
      ? {
        background: `${buttonTheme.palette.secondary} !important`,
        color: `${buttonTheme.palette.primary} !important`,
      }
      : {}),
  },
  '& .MuiTouchRipple-root': {
    margin: -2,
    color: '#00000044 !important',
  },
})
)

export function Button(props: ButtonProps) {
  const { animation, text, hoverText, disabled } = Object.assign(
    {},
    Button.defaultProps,
    props,
  );

  const [hovering, setHovering] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const timer = useRef<number>();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const buttonTheme = useButtonTheme(props.buttonTheme);
  const styleProps: StyleProps = { animation, buttonTheme };

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
    <div style={{ fontSize: '0.8rem' }}>
      <StyledButton
        {...styleProps}
        disabled={disabled}
        className={"button"}
        onClick={props.onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={buttonRef}
      >
        <span>{transitioning !== hovering ? hoverText : text}</span>
      </StyledButton>
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
