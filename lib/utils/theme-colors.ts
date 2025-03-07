// Theme colors utility to ensure consistency across the application

// Blue from the hero section to be used globally
export const themeColors = {
  // Primary blue for consistent usage across the site
  primary: {
    light: 'hsl(217, 91%, 60%)', // Tailwind blue-600 - matches hero section
    dark: 'hsl(217, 91%, 60%)',
  },
  
  // Background colors for section alternation
  background: {
    light: {
      primary: 'hsl(0, 0%, 100%)', // White
      secondary: 'hsl(30, 20%, 96%)', // Light tan/brown
    },
    dark: {
      primary: 'hsl(240, 10%, 3.9%)', // Dark background
      secondary: 'hsl(240, 10%, 5.9%)', // Slightly lighter dark background
    }
  },
  
  // Card gradient settings
  cardGradient: {
    light: 'linear-gradient(135deg, rgba(0, 112, 243, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
    dark: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)',
  }
};

// CSS variable utility to insert these values into globals.css
export const themeCssVariables = `
  --color-primary: ${themeColors.primary.light};
  --color-primary-dark: ${themeColors.primary.dark};
  
  --color-bg-primary: ${themeColors.background.light.primary};
  --color-bg-secondary: ${themeColors.background.light.secondary};
  
  --color-bg-primary-dark: ${themeColors.background.dark.primary};
  --color-bg-secondary-dark: ${themeColors.background.dark.secondary};
  
  --card-gradient: ${themeColors.cardGradient.light};
  --card-gradient-dark: ${themeColors.cardGradient.dark};
`;