import { alpha, type Theme } from "@mui/material/styles";

export default function Select(theme: Theme) {
  return {
    MuiSelect: {
      styleOverrides: {
        "& .MuiSvgIcon-root": {
          color: "#0000003B", // <------------------ arrow-svg-color
        },
        "&.MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "#0000003B", // <------------------ outline-color by default
          },
          "&:hover fieldset": {
            borderColor: "#0000003B", // <------------------ outline-color on hover
          },
          "&.Mui-focused fieldset": {
            borderColor: "#0000003B", // <------------------ outline-color on focus
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiSvgIcon-root": {
            color: "#0000003B", // <------------------ arrow-svg-color
          },
          "&.MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#0000003B", // <------------------ outline-color by default
            },
            "&:hover fieldset": {
              borderColor: "#0000003B", // <------------------ outline-color on hover
            },
            "&.Mui-focused fieldset": {
              borderColor: "#0000003B", // <------------------ outline-color on focus
            },
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: "#0000003B",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#0000003B",
            },
          },
        },
      },
    },
  };
}
