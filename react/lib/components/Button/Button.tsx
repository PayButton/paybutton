import React, { useRef, useState } from 'react'
import { Button as MuiButton } from '@mui/material'
import { styled } from '@mui/material/styles'

import { Theme, ThemeName, useTheme } from '../../themes'
import { ButtonSize } from '../../util'

export type animation = 'slide' | 'invert' | 'none' | undefined

export interface ButtonProps {
  animation?: animation
  text?: string
  hoverText?: string
  theme?: ThemeName | Theme
  disabled?: boolean
  onClick?: () => void
  size?: ButtonSize
  sizeScaleAlreadyApplied?: boolean
}

interface StyleProps {
  animation: animation
  $theme: Theme
  $btnSize?: ButtonSize
  sizeScaleAlreadyApplied?: boolean
}

/* ---------- styled ---------- */
const Container = styled('div', {
  shouldForwardProp: (prop) =>
    prop !== '$theme' &&
    prop !== 'animation' &&
    prop !== '$btnSize' &&
    prop !== 'sizeScaleAlreadyApplied',
})<StyleProps>(({ $btnSize }) => {
  const fontSizeMap: Record<string, string> = {
    xs: '0.6rem',
    extrasmall: '0.6rem',
    sm: '0.7rem',
    small: '0.7rem',
    md: '0.8rem',
    medium: '0.8rem',
    lg: '1rem',
    large: '1rem',
    xl: '1.2rem',
    extralarge: '1.2rem',
  }
  return { fontSize: `${fontSizeMap[$btnSize ?? 'md']} !important` }
})

const BaseButton = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof MuiButton>>(
  (props, ref) => <MuiButton ref={ref} {...props} />
)
BaseButton.displayName = 'BaseButton'

const StyledButton = styled(BaseButton, {
  shouldForwardProp: (prop) =>
    prop !== '$theme' &&
    prop !== 'animation' &&
    prop !== '$btnSize' &&
    prop !== 'sizeScaleAlreadyApplied',
})<StyleProps>(({ $theme, animation, $btnSize }) => {
  const radiusBySize = {
    xs: '5px',
    extrasmall: '5px',
    sm: '7px',
    small: '7px',
    md: '10px',
    medium: '10px',
    lg: '12px',
    large: '12px',
    xl: '13px',
    extralarge: '13px',
  }
  const borderRadius = radiusBySize[($btnSize ?? 'default') as keyof typeof radiusBySize] ?? '10px'

  return {
    background: `${$theme.palette.secondary} !important`,
    transition: '0.6s !important',
    minWidth: '14em !important',
    padding: '0.618em 1.618em !important',
    margin: 'auto !important',
    boxShadow: '3px 3px 3px rgba(0, 0, 0, 0.08) !important',
    border: `2px solid ${$theme.palette.primary} !important`,
    borderRadius: `${borderRadius} !important`,
    fontSize: '1em !important',

    ...(animation === 'slide'
      ? {
          background: `linear-gradient(45deg, ${$theme.palette.primary} 50%, ${$theme.palette.secondary} 50%) 100% center / 300% !important`,
          backgroundSize: '300% !important',
          backgroundPosition: '100% !important',
          transition: 'background-position 0.8s, color 0.15s !important',
        }
      : {}),
    color: `${$theme.palette.primary} !important`,
    textTransform: 'none',

    '&:hover': {
      ...(animation === 'slide'
        ? {
            backgroundPosition: '0 !important',
            color: `${$theme.palette.secondary} !important`,
          }
        : {}),
      ...(animation === 'invert'
        ? {
            background: `${$theme.palette.primary} !important`,
            color: `${$theme.palette.secondary} !important`,
          }
        : {}),
      ...(animation === 'none'
        ? {
            background: `${$theme.palette.secondary} !important`,
            color: `${$theme.palette.primary} !important`,
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
  }
})

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
  const [hovering, setHovering] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const timer = useRef<number>()
  const buttonRef = useRef<HTMLButtonElement>(null)

  const theme = useTheme(themeProp)
  const styleProps: StyleProps = { animation, $theme: theme, $btnSize: size, sizeScaleAlreadyApplied }

  const handleMouseEnter = (): void => {
    setHovering(true)
    if (animation === 'none') return
    setTransitioning(true)
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setTransitioning(false), 150)
  }

  const handleMouseLeave = (): void => {
    setHovering(false)
    if (animation === 'none') return
    setTransitioning(true)
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setTransitioning(false), 150)
  }

  return (
    <Container {...styleProps}>
      <StyledButton
        {...styleProps}
        disabled={disabled}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={buttonRef}
      >
        {transitioning !== hovering ? hoverText : text || '\u00A0'}
      </StyledButton>
    </Container>
  )
}

export default Button

