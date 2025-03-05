# Project Carousel Implementation

This document outlines the implementation of the project carousel feature in the portfolio website.

## Overview

The project carousel is a key feature that showcases featured projects on the homepage and provides an interactive browsing experience on the projects page. This implementation uses Swiper.js for a smooth, responsive, and touch-friendly carousel.

## Components

### 1. `ProjectSwiper`

The main carousel component used on the homepage for featured projects.

**Features:**

- Responsive slides (1-4 based on screen size)
- Touch-friendly navigation
- Customizable title and subtitle
- "View All" link to projects page
- Quick view functionality
- Animated transitions between slides
- Progress indicators

### 2. `SwiperCarousel`

A simpler carousel component used on the projects page as one of the view options.

**Features:**

- Alternative view for projects
- Responsive design
- Creative transition effects
- Custom navigation

### 3. `swiper-navigation.tsx`

Custom navigation components for Swiper:

- `PrevButton` - Custom previous slide button
- `NextButton` - Custom next slide button
- `CustomPagination` - Custom pagination indicators
- `AutoplayControl` - Play/pause control

## CSS

Custom CSS for the carousel is defined in `swiper-styles.css` with:

- Custom theme colors
- Enhanced navigation buttons
- Animated pagination bullets
- Card hover effects
- Responsive adjustments

## Usage

### On Homepage:

```tsx
<ProjectSwiper
	projects={featuredProjects}
	title='Featured Projects'
	subtitle='Check out some of my recent work'
/>
```

### On Projects Page:

```tsx
<SwiperCarousel projects={projects} />
```

## Customization

You can customize the carousel by:

1. Adjusting breakpoints in the Swiper configuration
2. Modifying slide effects and transitions
3. Changing autoplay settings
4. Updating the CSS in `swiper-styles.css`

## Dependencies

- Swiper 11.x
- React 19.x
- Next.js 15.x

## Browser Support

- Works in all modern browsers
- Optimized for mobile devices
- Touch gesture support
- Keyboard navigation for accessibility
