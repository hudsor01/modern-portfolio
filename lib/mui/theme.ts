import { createTheme, ThemeOptions } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

/**
 * Converts RGB values from CSS variables to HSL color strings for MUI
 * This ensures consistency between Tailwind CSS variables and MUI theme
 */
function cssVarToColor(r: number, g: number, b: number): string {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `hsl(${h}, ${s}%, ${l}%)`;
}

// Function to get design tokens based on mode (light/dark)
export const getDesignTokens = (mode: PaletteMode): ThemeOptions => {
  // CSS variables from our theme
  const blue600 = cssVarToColor(37, 99, 235); // --color-primary
  const bgPrimary = mode === 'light' ? cssVarToColor(255, 255, 255) : cssVarToColor(15, 23, 42);
  const bgSecondary = mode === 'light' ? cssVarToColor(248, 244, 237) : cssVarToColor(22, 32, 54);

  // Create theme based on our CSS variables
  return {
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // Light mode
            primary: {
              main: blue600, // Tailwind blue-600 - matches hero section
              contrastText: '#FAFAFA', // Matches --color-primary-foreground
            },
            secondary: {
              main: bgSecondary, // Matches --color-bg-secondary
              contrastText: '#0F172A', // Matches --color-secondary-foreground
            },
            background: {
              default: bgPrimary, // Matches --color-bg-primary
              paper: '#FFFFFF', // Matches --color-card
            },
            text: {
              primary: '#0F172A', // Matches --color-foreground
              secondary: '#64748B', // Matches --color-muted-foreground
            },
            error: {
              main: '#EF4444', // Matches --color-destructive
            },
            divider: '#E2E8F0', // Matches --color-border
          }
        : {
            // Dark mode
            primary: {
              main: blue600, // Tailwind blue-600 - matches hero section
              contrastText: '#FAFAFA', // Matches --color-primary-foreground
            },
            secondary: {
              main: bgSecondary, // Matches --color-bg-secondary
              contrastText: '#F1F5F9', // Matches --color-secondary-foreground
            },
            background: {
              default: bgPrimary, // Matches --color-bg-primary
              paper: '#1E293B', // Matches --color-card
            },
            text: {
              primary: '#F1F5F9', // Matches --color-foreground
              secondary: '#94A3B8', // Matches --color-muted-foreground
            },
            error: {
              main: '#EF4444', // Matches --color-destructive
            },
            divider: '#334155', // Matches --color-border
          }),
    },
    typography: {
      fontFamily: 'var(--font-sans)',
      h1: {
        fontFamily: 'var(--font-serif)',
        fontWeight: 800,
        fontSize: '2.75rem',
        lineHeight: 1.2,
        letterSpacing: '-0.025em',
        '@media (min-width:600px)': {
          fontSize: '3.5rem',
        },
        '@media (min-width:960px)': {
          fontSize: '4rem',
        },
      },
      h2: {
        fontFamily: 'var(--font-serif)',
        fontWeight: 700,
        fontSize: '2.25rem',
        lineHeight: 1.2,
        letterSpacing: '-0.025em',
        '@media (min-width:600px)': {
          fontSize: '2.75rem',
        },
      },
      h3: {
        fontFamily: 'var(--font-sans)',
        fontWeight: 600,
        fontSize: '1.75rem',
        lineHeight: 1.2,
        letterSpacing: '-0.025em',
        '@media (min-width:600px)': {
          fontSize: '2.25rem',
        },
      },
      h4: {
        fontFamily: 'var(--font-sans)',
        fontWeight: 700,
        fontSize: '1.5rem',
        lineHeight: 1.2,
        letterSpacing: '-0.025em',
      },
      h5: {
        fontFamily: 'var(--font-sans)',
        fontWeight: 700,
        fontSize: '1.25rem',
        lineHeight: 1.2,
        letterSpacing: '-0.025em',
      },
      h6: {
        fontFamily: 'var(--font-sans)',
        fontWeight: 700,
        fontSize: '1.1rem',
        lineHeight: 1.2,
        letterSpacing: '-0.025em',
      },
      body1: {
        fontFamily: 'var(--font-sans)',
        fontSize: '1rem',
        lineHeight: 1.7,
        '@media (min-width:600px)': {
          fontSize: '1.125rem',
        },
      },
      body2: {
        fontFamily: 'var(--font-sans)',
        fontSize: '0.875rem',
        lineHeight: 1.7,
        '@media (min-width:600px)': {
          fontSize: '1rem',
        },
      },
      subtitle1: {
        fontFamily: 'var(--font-sans)',
        fontSize: '1.125rem',
        fontWeight: 500,
        lineHeight: 1.5,
        color: mode === 'light' ? 'hsl(240, 3.8%, 46.1%)' : 'hsl(240, 5%, 64.9%)',
      },
      button: {
        fontFamily: 'var(--font-sans)',
        fontWeight: 600,
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 8, // Matches --radius-md
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '0.75rem', // More rounded buttons
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: mode === 'light' ? '0 2px 8px rgba(0, 0, 0, 0.05)' : 'none',
            transition: 'all 0.2s ease-in-out',
            padding: '0.625rem 1.25rem', // More padding
            ':hover': {
              transform: 'translateY(-2px)',
              boxShadow:
                mode === 'light'
                  ? '0 6px 20px rgba(0, 0, 0, 0.1)'
                  : '0 6px 20px rgba(0, 0, 0, 0.2)',
            },
          },
          containedPrimary: {
            backgroundColor: 'hsl(217, 91%, 60%)', // Use the blue-600 consistently
            color: 'hsl(0, 0%, 98%)',
            backgroundImage:
              'linear-gradient(135deg, hsl(217, 91%, 60%) 0%, hsl(224, 91%, 58%) 100%)', // Subtle gradient
            ':hover': {
              backgroundImage:
                'linear-gradient(135deg, hsl(217, 91%, 55%) 0%, hsl(224, 91%, 53%) 100%)',
            },
          },
          outlinedPrimary: {
            borderColor: 'hsl(217, 91%, 60%)',
            borderWidth: '2px',
            ':hover': {
              borderColor: 'hsl(217, 91%, 50%)',
              backgroundColor: 'hsla(217, 91%, 60%, 0.04)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '1rem', // More rounded cards
            border: '1px solid',
            borderColor: mode === 'light' ? 'hsl(240, 5.9%, 90%)' : 'hsl(240, 3.7%, 15.9%)',
            boxShadow:
              mode === 'light'
                ? '0 4px 20px rgba(0, 0, 0, 0.05), 0 8px 16px rgba(0, 0, 0, 0.02)'
                : '0 4px 20px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease',
            ':hover': {
              transform: 'translateY(-4px)',
              boxShadow:
                mode === 'light'
                  ? '0 12px 30px rgba(0, 0, 0, 0.08), 0 16px 24px rgba(0, 0, 0, 0.03)'
                  : '0 12px 30px rgba(0, 0, 0, 0.3)',
            },
            backgroundImage:
              mode === 'light'
                ? 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(249, 250, 251, 1) 100%)'
                : 'linear-gradient(135deg, rgba(30, 41, 59, 1) 0%, rgba(26, 32, 44, 1) 100%)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderRadius: '1rem',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '8px', // Squarer chips
            fontWeight: 500,
            padding: '0 8px',
          },
          filled: {
            backgroundColor:
              mode === 'light' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.2)',
            color: mode === 'light' ? 'hsl(217, 91%, 45%)' : 'hsl(217, 91%, 80%)',
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: mode === 'light' ? 'rgba(226, 232, 240, 0.8)' : 'rgba(51, 65, 85, 0.8)',
          },
        },
      },
    },
  };
};

// Create theme instance
export const getTheme = (mode: PaletteMode) => createTheme(getDesignTokens(mode));
