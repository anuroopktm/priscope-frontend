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
      background_gradient: "linear-gradient(180deg, #14253F 0%, #1A2B44 100%)",
      border: "#BBBBBB",
    },
    background: {
      default: "#F4F6F8",
      paper: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

theme.components = ComponentsOverrides(theme);

export { theme };
