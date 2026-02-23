// import { type Theme } from "@mui/material/styles";

// export default function Select(theme: Theme) {
//   return {
//     MuiSelect: {
//       styleOverrides: {
//         select: {
//           textTransform: "none" as const,
//           fontSize: "14px",
//           padding: "6.75px 12px",
//           borderRadius: 12,
//           color: theme.palette.common.white,
//           backgroundColor: theme.palette.primary.main,
//           "&:hover": {
//             backgroundColor: theme.palette.brand.tertiary,
//           },
//         },

//         icon: {
//           color: theme.palette.common.white,
//         },

//         iconOpen: {
//           color: theme.palette.common.white,
//         },
//       },
//     },
//   };
// }

import { alpha, type Theme } from "@mui/material/styles";

export default function Select(theme: Theme) {
  return {
    MuiSelect: {
      variants: [
        {
          props: { variant: "standard" },
          style: {
            borderRadius: 12,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
            "&:hover": {
              backgroundColor: theme.palette.brand.tertiary,
            },
          },
        },

        {
          props: { variant: "outlined" },
          style: {
            borderRadius: 12,
            backgroundColor: theme.palette.grey[100],
            border: `1px solid ${theme.palette.grey[300]}`,
            color: theme.palette.text.primary,

            "&:hover": {
              backgroundColor: theme.palette.grey[200],
            },

            "&.Mui-focused": {
              borderColor: theme.palette.primary.main,
              boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.15)}`,
            },
          },
        },
      ],

      styleOverrides: {
        icon: {
          color: theme.palette.text.secondary,
        },
      },
    },
  };
}
