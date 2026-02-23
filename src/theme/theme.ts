import { createTheme } from "@mui/material/styles";
import ComponentsOverrides from "./overrides";

let theme = createTheme({
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
      contrastText: "#EA6565",
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
