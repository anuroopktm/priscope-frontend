import { type Theme } from "@mui/material/styles";

const Typography = (theme: Theme) => ({
  MuiTypography: {
    styleOverrides: {
      paragraph: {
        marginBottom: theme.spacing(2),
      },
      gutterBottom: {
        marginBottom: theme.spacing(1),
      },
      // H1-H6 default weights
      h1: { fontWeight: 800 },
      h2: { fontWeight: 800 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 600 },
      subtitle1: { fontWeight: 600 },
      subtitle2: { fontWeight: 600 },
      body1: { lineHeight: 1.5 },
      body2: { lineHeight: 1.5 },
      // Custom link buttons inside Typography
      button: {
        fontWeight: 700,
        textTransform: "none" as const,
      },
    },
  },
});

export default Typography;
