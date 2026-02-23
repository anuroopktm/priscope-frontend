import "@mui/material/IconButton";
import "@mui/material/styles";
import "@mui/material/Select";

declare module "@mui/material/IconButton" {
  interface IconButtonOwnProps {
    variant?: "ghost" | "action";
  }
}

declare module "@mui/material/styles" {
  interface Palette {
    pending: Palette["primary"];
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
    pending?: PaletteOptions["primary"];
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

declare module "@mui/material/Select" {
  interface SelectPropsVariantOverrides {
    variant?: "outlined" | "filled";
  }
}

