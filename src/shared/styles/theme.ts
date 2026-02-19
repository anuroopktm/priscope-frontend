import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    custom: {
      inputBorderColor: string;
      inputBg: string;
      buttonBg: string;
      buttonHoverBg: string;
      labelColor: string;
      textColor: string;
      socialIconBg: string;
      socialIconHoverBg: string;
      subTextColor: string;
      subtitleColor: string;
      tableHeaderBg: string;
      checkboxBg: string;
      tablehoverBg: string;
      iconBg: string;
      gradientBg: string;
      sectionDivider: string;
      blurBackground: string;
      surfaceBackground: string;
      bgColor: string;
      midnightBlue: string
      status: {
        active: {
          text: string;
          background: string;
        };
        suspended: {
          text: string;
          background: string;
        };
        invited: {
          text: string;
          background: string;
        };
      };
    };
  }

  interface ThemeOptions {
    custom?: Partial<Theme["custom"]>;
  }

  interface Palette {
    sidebar: {
      bg: string;
      text: string;
      active: string;
      hover: string;
      avatarBg: string;
      avatarText: string;
      userSubText: string;
      divider: string;
      highlight: string;
    };
    topbar: {
      bg: string;
      text: string;
    };
  }

  interface PaletteOptions {
    sidebar?: Partial<Palette["sidebar"]>;
  }

  interface PaletteOptions {
    topbar?: Partial<Palette["topbar"]>;
  }

  interface TypographyVariants {
    formLabel: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    formLabel?: React.CSSProperties;
  }
}

// 🔷 Also add variant prop for <Typography variant="formLabel" />
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    formLabel: true;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    midnight: true;
  }
}

const theme = createTheme({
  typography: {
    fontFamily: "Inter, sans-serif",
    formLabel: {
      fontWeight: 500,
      marginBottom: "8px",
    },
    subtitle1: {
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: "140%",
      color: "#17222B", // or theme.custom.subtitleColor
    },
    body2: {
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "140%",
      color: "#858585", // or theme.custom.subTextColor
    },
  },
  shape: {
    borderRadius: 1.5,
  },
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#9c27b0",
    },
    sidebar: {
      bg: "#1a2b44",
      text: "#ffffff",
      active: "#d8ecf8",
      hover: "rgba(255, 255, 255, 0.05)",
      avatarBg: "#89c5ea",
      avatarText: "#1a2b44",
      userSubText: "#d2d2d2",
      divider: "#0F3953",
      highlight: "#144E72",
    },
    topbar: {
      bg: "#1A2B44",
      text: "#ffffff",
    },
  },
  custom: {
    inputBorderColor: "#BBBBBB",
    inputBg: "#FFFFFF",
    buttonBg: "#1A2B44",
    buttonHoverBg: "#152238",
    labelColor: "#333333",
    textColor: "#1A2B44",
    socialIconBg: "#1A2B44",
    socialIconHoverBg: "#2A3E63",
    subTextColor: "#858585",
    subtitleColor: "#17222B",
    tableHeaderBg: "#f2f2f2",
    checkboxBg: "#17222B",
    tablehoverBg: "#f9f9f9",
    iconBg: "#EAF2FB",
    blurBackground: "#f5f5f5",
    surfaceBackground: "#f8f9fa",
    bgColor: "#14253F",
    sectionDivider: "1px solid #D2D2D2",
    gradientBg: "linear-gradient(96.81deg, #D8ECF8 0%, #89C5EA 100%)",
    midnightBlue: "#144E72",

    status: {
      active: {
        text: "#1FC16B",
        background: "#1FC16B1A",
      },
      suspended: {
        text: "#D00416",
        background: "#FB37481A",
      },
      invited: {
        text: "#DFB400",
        background: "#FFDB431A",
      },
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          height: "50px",
          borderRadius: "12px",
          backgroundColor: theme.custom.inputBg,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.custom.inputBorderColor,
          },
        }),
        input: {
          height: "100%",
          padding: "0 16px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: "6px",
          textTransform: "none",
          fontWeight: 500,
          fontSize: "14px",
          padding: "12px 16px",
          lineHeight: 1.5,
          minWidth: 80,
        }),
      },
      variants: [
        {
          props: { variant: "contained" },
          style: ({ theme }) => ({
            backgroundColor: theme.custom.buttonBg,
            color: theme.custom.inputBg,
            "&:hover": {
              backgroundColor: theme.custom.buttonHoverBg,
            },
          }),
        },
        {
          props: { variant: "outlined" },
          style: ({ theme }) => ({
            border: `1px solid ${theme.custom.textColor}`,
            backgroundColor: theme.palette.background.paper,
            color: theme.custom.textColor,
            "&:hover": {
              backgroundColor: "#F8F9FA",
              border: `1px solid ${theme.custom.textColor}`,
            },
          }),
        },
        {
          props: { variant: "text" },
          style: {
            color: "#1A2B44",
            "&:hover": {
              backgroundColor: "#F4F6F8",
            },
          },
        },
        {
          props: { color: "error" },
          style: {
            backgroundColor: "#FF4D4F",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#D9363E",
            },
          },
        },
        {
          props: { variant: "midnight" },
          style: ({ theme }) => ({
            height: "40px",
            textTransform: "none",
            borderRadius: "8px",
            backgroundColor: theme.custom.midnightBlue,
            color: theme.custom.inputBg,
            "&:hover": {
              backgroundColor: theme.custom.midnightBlue,
            },
          }),
        },
      ],
    },
    MuiCheckbox: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: "12px",
          color: theme.custom.textColor,
          "&.Mui-checked": {
            color: theme.custom.textColor,
          },
        }),
      },
    },
  },
});

export default theme;
