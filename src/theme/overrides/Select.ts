// // Select.ts
// import type { Theme } from "@mui/material/styles";

// export default function Select(theme: Theme) {
//   return {
//     MuiSelect: {
//       variants: [

//       ],

//       styleOverrides: {
//         root: {
//           "& .MuiSvgIcon-root": {
//             color: "#0000003B", // arrow color
//           },

//           "& .MuiOutlinedInput-root": {
//             "& fieldset": {
//               borderColor: "#0000003B",
//             },
//             "&:hover fieldset": {
//               borderColor: "#0000003B",
//             },
//             "&.Mui-focused fieldset": {
//               borderColor: "#0000003B",
//             },
//           },
//         },
//       },
//     },

//     MuiOutlinedInput: {
//       styleOverrides: {
//         root: {
//           "& .MuiSvgIcon-root": {
//             color: "#0000003B",
//           },

//           "& fieldset": {
//             borderColor: "#0000003B",
//           },
//           "&:hover fieldset": {
//             borderColor: "#0000003B",
//           },
//           "&.Mui-focused fieldset": {
//             borderColor: "#0000003B",
//           },

//           ".MuiOutlinedInput-notchedOutline": {
//             borderColor: "#0000003B",
//           },
//           "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//             borderColor: "#0000003B",
//           },
//         },
//       },
//     },
//   };
// }

// Select.ts
import type { Theme } from "@mui/material/styles";

export default function Select(theme: Theme) {
  return {
    MuiSelect: {
      variants: [
        {
          props: { variant: "rateLibrary" },
          style: {
            color: "#000", // text color
            fontSize: "14px",
            padding: "6px 12px",
            borderRadius: 8,
            backgroundColor: "#fff",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#0000003B",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#0000003B",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#0000003B",
            },
            "& .MuiSvgIcon-root": {
              color: "#0000003B", // arrow color
            },
          },
        },
      ],

      styleOverrides: {
        root: {
          "& .MuiSvgIcon-root": {
            color: "#0000003B",
          },

          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#0000003B",
            },
            "&:hover fieldset": {
              borderColor: "#0000003B",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#0000003B",
            },
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiSvgIcon-root": {
            color: "#0000003B",
          },

          "& fieldset": {
            borderColor: "#0000003B",
          },
          "&:hover fieldset": {
            borderColor: "#0000003B",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#0000003B",
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
  };
}
