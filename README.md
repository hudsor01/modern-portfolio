# Modern Portfolio Website

This is a modern portfolio website built with Next.js, Tailwind CSS, and React.

## Features

- Modern, responsive design
- Light and dark mode support
- Smooth scrolling
- Animated components with Framer Motion
- Project showcase
- Testimonials section
- Skills and expertise display

## Color Theme

The website uses a custom color theme defined in `globals.css` with CSS variables. The theme is based on a system that maps to both light and dark mode automatically.

Key colors:
- Primary: Blue (#0070f3)
- Background: White in light mode, dark gray in dark mode
- Text: Dark gray in light mode, white in dark mode

## Project Structure

- `app/` - Next.js app directory
- `components/` - React components
- `lib/` - Utilities and data
- `public/` - Static assets
- `styles/` - Global styles and animations

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Notes

- Scroll-to-top button will appear after scrolling down
- Smooth scrolling between sections is enabled
- The project uses CSS variables for theming, avoiding inline styles
- Projects section shows 2 featured projects on the homepage
- Testimonials section adapts to mobile and desktop views
