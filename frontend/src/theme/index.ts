import { createTheme } from "@mui/material/styles";

export const purpleTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8B5CF6", // Purple-500
      light: "#A78BFA", // Purple-400
      dark: "#7C3AED", // Purple-600
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#EC4899", // Pink-500
      light: "#F472B6", // Pink-400
      dark: "#DB2777", // Pink-600
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#0F0F23", // Dark purple-blue
      paper: "#1A1A2E", // Slightly lighter purple-blue
    },
    surface: {
      main: "#16213E", // Dark blue-purple
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#A1A1AA", // Gray-400
    },
    success: {
      main: "#10B981", // Emerald-500
      light: "#34D399", // Emerald-400
      dark: "#059669", // Emerald-600
    },
    error: {
      main: "#EF4444", // Red-500
      light: "#F87171", // Red-400
      dark: "#DC2626", // Red-600
    },
    warning: {
      main: "#F59E0B", // Amber-500
      light: "#FBBF24", // Amber-400
      dark: "#D97706", // Amber-600
    },
    info: {
      main: "#3B82F6", // Blue-500
      light: "#60A5FA", // Blue-400
      dark: "#2563EB", // Blue-600
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.125rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
          padding: "8px 16px",
        },
        contained: {
          boxShadow: "0 4px 14px 0 rgba(139, 92, 246, 0.3)",
          "&:hover": {
            boxShadow: "0 6px 20px 0 rgba(139, 92, 246, 0.4)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)",
          border: "1px solid rgba(139, 92, 246, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        },
        bar: {
          borderRadius: 4,
        },
      },
    },
  },
});

export default purpleTheme;
