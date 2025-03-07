type ColorPalette = {
  [key: string]: string | { [key: string]: string };
  blue: { [key: string]: string };
};

export const getThemeColor = (type: string): string => {
  const colors: ColorPalette = {
    primary: '#60a5fa', // Changed to blue-400
    secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
    destructive: 'rgb(var(--color-destructive) / <alpha-value>)',
    muted: 'rgb(var(--color-muted) / <alpha-value>)',
    accent: 'rgb(var(--color-accent) / <alpha-value>)',
    popover: 'rgb(var(--color-popover) / <alpha-value>)',
    card: 'rgb(var(--color-card) / <alpha-value>)',
    blue: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
    eggshell: '#F5F5DC', // Replace with your exact eggshell color value
    'pewter-blue': '#8DA9C4', // Replace with your exact pewter-blue color value
  };

  const color = colors[type];
  return typeof color === 'string' ? color : (colors.primary as string);
};
