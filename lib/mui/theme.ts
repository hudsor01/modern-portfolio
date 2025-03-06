import { createTheme, ThemeOptions } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

// Function to get design tokens based on mode (light/dark)
export const getDesignTokens = (mode: PaletteMode): ThemeOptions => {
  // Create theme based on our CSS variables
  return {
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // Light mode
            primary: {
              main: 'hsl(211, 100%, 48%)', // Matches --color-primary in light mode
              contrastText: 'hsl(0, 0%, 98%)', // Matches --color-primary-foreground
            },
            secondary: {
              main: 'hsl(240, 4.8%, 95.9%)', // Matches --color-secondary
              contrastText: 'hsl(240, 5.9%, 10%)', // Matches --color-secondary-foreground
            },
            background: {
              default: 'hsl(0, 0%, 100%)', // Matches --color-background
              paper: 'hsl(0, 0%, 100%)', // Matches --color-card
            },
            text: {
              primary: 'hsl(240, 10%, 3.9%)', // Matches --color-foreground
              secondary: 'hsl(240, 3.8%, 46.1%)', // Matches --color-muted-foreground
            },
            error: {
              main: 'hsl(0, 84.2%, 60.2%)', // Matches --color-destructive
            },
            divider: 'hsl(240, 5.9%, 90%)', // Matches --color-border
          }
        : {
            // Dark mode
            primary: {
              main: 'hsl(211, 100%, 60%)', // Matches --color-primary in dark mode
              contrastText: 'hsl(240, 5.9%, 10%)', // Matches --color-primary-foreground
            },
            secondary: {
              main: 'hsl(240, 3.7%, 15.9%)', // Matches --color-secondary
              contrastText: 'hsl(0, 0%, 98%)', // Matches --color-secondary-foreground
            },
            background: {
              default: 'hsl(240, 10%, 3.9%)', // Matches --color-background
              paper: 'hsl(240, 10%, 3.9%)', // Matches --color-card
            },
            text: {
              primary: 'hsl(0, 0%, 98%)', // Matches --color-foreground
              secondary: 'hsl(240, 5%, 64.9%)', // Matches --color-muted-foreground
            },
            error: {
              main: 'hsl(0, 62.8%, 30.6%)', // Matches --color-destructive
            },
            divider: 'hsl(240, 3.7%, 15.9%)', // Matches --color-border
          }),
    },
    typography: {
      fontFamily: 'var(--font-sans)',
      h1: {
        fontFamily: 'var(--font-serif)',
        fontWeight: 800,
        fontSize: '2.5rem',
        lineHeight: 1.2,
        letterSpacing: '-0.025em',
      },
      h2: {
        fontFamily: 'var(--font-serif)',
        fontWeight: 700,
        fontSize: '2rem',
        lineHeight: 1.2,
        letterSpacing: '-0.025em',
      },
      h3: {
        fontFamily: 'var(--font-sans)',
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.2,
        letterSpacing: '-0.025em',
      },
      h4: {
        fontFamily: 'var(--font-sans)',
        fontWeight: 700,
        fontSize: '1.25rem',
        lineHeight: 1.2,
        letterSpacing: '-0.025em',
      },
      h5: {
        fontFamily: 'var(--font-sans)',
        fontWeight: 700,
        fontSize: '1.125rem',
        lineHeight: 1.2,
        letterSpacing: '-0.025em',
      },
      h6: {
        fontFamily: 'var(--font-sans)',
        fontWeight: 700,
        fontSize: '1rem',
        lineHeight: 1.2,
        letterSpacing: '-0.025em',
      },
      body1: {
        fontFamily: 'var(--font-sans)',
        fontSize: '1rem',
        lineHeight: 1.7,
      },
      body2: {
        fontFamily: 'var(--font-sans)',
        fontSize: '0.875rem',
        lineHeight: 1.7,
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
            borderRadius: 'var(--radius-md)',
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: 'none',
            ':hover': {
              boxShadow: 'none',
            },
          },
          containedPrimary: {
            backgroundColor: mode === 'light' ? 'hsl(211, 100%, 48%)' : 'hsl(211, 100%, 60%)',
            color: mode === 'light' ? 'hsl(0, 0%, 98%)' : 'hsl(240, 5.9%, 10%)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 'var(--radius-lg)',
            border: '1px solid',
            borderColor: mode === 'light' ? 'hsl(240, 5.9%, 90%)' : 'hsl(240, 3.7%, 15.9%)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  };
};

// Create theme instance
export const getTheme = (mode: PaletteMode) => createTheme(getDesignTokens(mode));
