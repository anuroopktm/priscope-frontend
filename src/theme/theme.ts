import { createTheme } from "@mui/material/styles";
import ComponentsOverrides from "./overrides";

declare module "@mui/material/styles" {
  interface Palette {
    brand: {
      primary: string;
      secondary: string;
      tertiary: string;
      background: string;
    };
    auth: {
      surface: string;
      border: string;
      inputBg: string;
    };
  }
  interface PaletteOptions {
    brand?: {
      primary: string;
      secondary: string;
      tertiary: string;
      background: string;
    };
    auth?: {
      surface: string;
      border: string;
      inputBg: string; // Generic placeholder for input backgrounds if needed
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
    brand: {
      primary: "#1A2B44",
      secondary: "#4A78BA",
      tertiary: "#144E72",
      background: "#1A2B44",
    },
    auth: {
      surface: "#FFFFFF",
      border: "#BBBBBB",
      inputBg: "#FFFFFF",
    },
    background: {
      default: "#F4F6F8", // Neutral background for the app context
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

theme.components = ComponentsOverrides(theme);

export { theme };
