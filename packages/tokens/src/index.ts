export const colors = {
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    500: "#2563eb",
    600: "#1d4ed8",
    700: "#1e40af"
  },
  neutral: {
    0: "#ffffff",
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    500: "#6b7280",
    700: "#374151",
    900: "#111827"
  },
  success: {
    500: "#16a34a",
    600: "#15803d"
  },
  warning: {
    500: "#d97706",
    600: "#b45309"
  },
  danger: {
    500: "#dc2626",
    600: "#b91c1c"
  }
} as const;

export const spacing = {
  0: "0",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem"
} as const;

export const radius = {
  none: "0",
  sm: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  full: "9999px"
} as const;

export const typography = {
  fontFamily: {
    sans: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem"
  },
  lineHeight: {
    tight: "1.25",
    normal: "1.5"
  },
  fontWeight: {
    regular: "400",
    medium: "500",
    semibold: "600"
  }
} as const;

export const shadow = {
  none: "none",
  sm: "0 1px 2px rgb(17 24 39 / 0.08)",
  md: "0 8px 24px rgb(17 24 39 / 0.12)",
  overlay: "0 18px 50px rgb(17 24 39 / 0.22)"
} as const;

export const zIndex = {
  base: "0",
  dropdown: "40",
  sticky: "50",
  overlay: "100",
  modal: "110",
  toast: "120"
} as const;

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px"
} as const;

export const sizing = {
  control: {
    sm: "2rem",
    md: "2.5rem",
    lg: "3rem"
  },
  icon: {
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem"
  }
} as const;

export const motion = {
  duration: {
    fast: "120ms",
    normal: "200ms",
    slow: "300ms"
  },
  easing: {
    standard: "ease",
    decelerate: "cubic-bezier(0, 0, 0.2, 1)",
    accelerate: "cubic-bezier(0.4, 0, 1, 1)"
  }
} as const;

export const grid = {
  columns: "12",
  gutter: "1rem",
  container: {
    sm: "40rem",
    md: "48rem",
    lg: "64rem",
    xl: "80rem"
  }
} as const;
