import type { Theme } from "@mui/material/styles";
import SelectArrowIcon from "../icon/SelectArrowIcon";

export default function Select(theme: Theme) {
  return {
    MuiSelect: {
      defaultProps: {
        IconComponent: SelectArrowIcon,
      },
      styleOverrides: {
        select: {
          fontSize: "14px",
          fontWeight: 500,
          // padding: "7px 16px",
          // paddingRight: "40px !important",
        },

        icon: {
          right: 10,
          color: "inherit",
        },
      },
    },

    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.common.white,

          "& .MuiSelect-filled": {
            padding: "6px 16px",
          },

          "&:hover": {
            backgroundColor: theme.palette.brand.tertiary,
          },

          "&.Mui-focused": {
            backgroundColor: theme.palette.primary.main,
          },

          "&.Mui-disabled": {
            backgroundColor: theme.palette.action.disabledBackground,
            color: theme.palette.text.disabled,
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.primary.main,

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
            borderWidth: 2,
          },

          "&.Mui-disabled": {
            backgroundColor: theme.palette.action.disabledBackground,
            color: theme.palette.text.disabled,
          },
        },

        notchedOutline: {
          borderWidth: 2,
          // borderColor: theme.palette.primary.main,
        },
      },
    },
  };
}
