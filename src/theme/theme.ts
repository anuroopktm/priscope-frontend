import { createTheme } from "@mui/material/styles";
import ComponentsOverrides from "./overrides";

declare module "@mui/material/styles" {
  interface Palette {
    brand: {
      primary: string;
      secondary: string;
      tertiary: string;
      background: string;
      background_gradient: string;
      border: string;
      gradientBg: string;
      hover: string;
      surfaceBackground: string;
    };
  }
  interface PaletteOptions {
    brand?: {
      primary: string;
      secondary: string;
      tertiary: string;
      background: string;
      background_gradient: string;
      border: string;
      gradientBg: string;
      hover: string;
      surfaceBackground: string;
    };
  }
}

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1A2B44",
    },
    secondary: {
      main: "#4A78BA",
    },
    success: {
      main: "#1FC16B",
      light: "#1FC16B1A",
    },
    error: {
      main: "#D00416",
      light: "#FB37481A",
    },
    pending: {
      main: "#DFB400",
      light: "#FFDB431A",
    },
    brand: {
      primary: "#1A2B44",
      secondary: "#4A78BA",
      tertiary: "#144E72",
      background: "#1A2B44",
      background_gradient: "linear-gradient(180deg, #14253F 0%, #1A2B44 100%)",
      border: "#BBBBBB",
      gradientBg: "linear-gradient(96.81deg, #D8ECF8 0%, #89C5EA 100%)",
      hover: "rgba(255, 255, 255, 0.05)",
      surfaceBackground: "#f8f9fa",
    },
    background: {
      default: "#e3e3e3",
      paper: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
});

theme = createTheme(theme, {
  components: ComponentsOverrides(theme),
});

export { theme };
