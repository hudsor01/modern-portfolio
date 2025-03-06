'use client'

import { ReactNode } from 'react'
import { Link as ScrollLink } from 'react-scroll'
import { Button, ButtonProps } from '@mui/material'

interface SmoothScrollLinkProps extends Omit<ButtonProps, 'href'> {
  to: string
  children: ReactNode
  offset?: number
  variant?: 'text' | 'outlined' | 'contained'
  color?: 'primary' | 'secondary' | 'inherit' | 'success' | 'error' | 'info' | 'warning'
}

export function SmoothScrollLink({
  to,
  children,
  offset = -80, // Adjust this based on header height
  variant = 'contained',
  color = 'primary',
  ...props
}: SmoothScrollLinkProps) {
  return (
    <ScrollLink
      to={to}
      spy={true}
      smooth={true}
      offset={offset}
      duration={800}
      className="cursor-pointer"
    >
      <Button variant={variant} color={color} {...props}>
        {children}
      </Button>
    </ScrollLink>
  )
}
