/**
 * OKLCH Color System for Pet-to-You Unified Dashboard
 *
 * OKLCH Format: oklch(L C H / A)
 * - L (Lightness): 0-1 (0 = black, 1 = white)
 * - C (Chroma): 0-0.4+ (color intensity)
 * - H (Hue): 0-360 (color wheel angle)
 * - A (Alpha): 0-1 (transparency)
 *
 * Advantages:
 * - Perceptual uniformity (equal changes = equal visual differences)
 * - Wide gamut support (P3 color space - 35% more colors than sRGB)
 * - Better color systems (single hue variable for theme variants)
 * - 93% browser compatibility
 */

export const colors = {
  // Primary Palettes
  hospital: {
    primary: 'oklch(0.65 0.22 250)',      // Medical blue
    secondary: 'oklch(0.70 0.18 180)',    // Teal
    accent: 'oklch(0.75 0.20 340)',       // Pink accent
  },

  business: {
    primary: 'oklch(0.60 0.25 280)',      // Purple
    secondary: 'oklch(0.65 0.20 210)',    // Blue
    accent: 'oklch(0.70 0.22 160)',       // Cyan accent
  },

  // Semantic Colors (shared)
  semantic: {
    success: 'oklch(0.70 0.20 140)',      // Green
    warning: 'oklch(0.75 0.20 80)',       // Yellow
    danger: 'oklch(0.65 0.25 25)',        // Red
    info: 'oklch(0.70 0.18 240)',         // Blue
  },

  // Glass Effect Colors
  glass: {
    light: {
      background: 'oklch(from white l c h / 0.1)',
      border: 'oklch(from white l c h / 0.2)',
      shadow: 'oklch(0 0 0 / 0.1)',
    },
    dark: {
      background: 'oklch(from black l c h / 0.3)',
      border: 'oklch(from white l c h / 0.1)',
      shadow: 'oklch(0 0 0 / 0.3)',
    },
  },

  // Gradient Backgrounds
  gradients: {
    hospital: 'linear-gradient(135deg, oklch(0.75 0.15 250), oklch(0.65 0.20 280))',
    business: 'linear-gradient(135deg, oklch(0.70 0.20 280), oklch(0.60 0.25 240))',
    vibrant: 'linear-gradient(to bottom right, oklch(0.80 0.25 340), oklch(0.70 0.20 280), oklch(0.60 0.22 240))',
    smooth: 'linear-gradient(135deg, oklch(0.75 0.15 250) 0%, oklch(0.65 0.20 280) 50%, oklch(0.55 0.18 310) 100%)',
  },

  // Neutral Colors
  neutral: {
    50: 'oklch(0.98 0 0)',
    100: 'oklch(0.96 0 0)',
    200: 'oklch(0.92 0 0)',
    300: 'oklch(0.85 0 0)',
    400: 'oklch(0.70 0 0)',
    500: 'oklch(0.55 0 0)',
    600: 'oklch(0.45 0 0)',
    700: 'oklch(0.35 0 0)',
    800: 'oklch(0.25 0 0)',
    900: 'oklch(0.15 0 0)',
  },
} as const;

/**
 * CSS Custom Properties Generator
 * Use this to inject OKLCH colors into your app
 */
export const generateCSSVariables = (theme: 'hospital' | 'business' = 'hospital') => {
  const themeColors = colors[theme];

  return {
    '--color-primary': themeColors.primary,
    '--color-secondary': themeColors.secondary,
    '--color-accent': themeColors.accent,
    '--color-success': colors.semantic.success,
    '--color-warning': colors.semantic.warning,
    '--color-danger': colors.semantic.danger,
    '--color-info': colors.semantic.info,
    '--glass-bg': colors.glass.light.background,
    '--glass-border': colors.glass.light.border,
    '--glass-shadow': colors.glass.light.shadow,
  };
};
