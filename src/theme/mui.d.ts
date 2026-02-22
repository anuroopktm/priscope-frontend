import "@mui/material/IconButton";
import "@mui/material/styles";

declare module "@mui/material/IconButton" {
  interface IconButtonOwnProps {
    variant?: "ghost" | "action";
  }
}

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
