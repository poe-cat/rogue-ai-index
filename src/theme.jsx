import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0b0f14",
      paper: "#111821",
    },
    primary: {
      main: "#00c2ff",
    },
    text: {
      primary: "#e6edf3",
      secondary: "#9fb0c0",
    },
    divider: "rgba(255,255,255,0.08)",
  },
  typography: {
    fontFamily: "Inter, Roboto, system-ui, -apple-system, Segoe UI, sans-serif",
    h4: { fontWeight: 850, letterSpacing: -0.5 },
    h5: { fontWeight: 850, letterSpacing: -0.3 },
    h6: { fontWeight: 800 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          borderColor: "rgba(255,255,255,0.08)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderColor: "rgba(255,255,255,0.12)",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "rgba(255,255,255,0.08)",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
  },
});