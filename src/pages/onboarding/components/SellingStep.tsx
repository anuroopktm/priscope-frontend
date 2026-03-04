import { Box, TextField, Typography } from "@mui/material";
import React from "react";

const SellingStep = () => {
  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        width: "100%",
        maxWidth: 500,
      }}
    >
      <Box>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "normal",
            color: "#000000",
            mb: 1,
          }}
        >
          Core selling price element
        </Typography>
        <TextField
          fullWidth
          required
          sx={{
            "& .MuiOutlinedInput-root": {
              height: 40,
              "& input": {
                padding: "12px 14px",
              },
            },
          }}
        />
        <Typography
          sx={{
            fontSize: "11px",
            fontWeight: "normal",
            color: "#1A2B44",
            mt: 1,
          }}
        >
          This will be the reference price for all automatic GM% and margin
          health calculations. You can still include other price fields (like
          MAP or MSRP) for reporting or analysis, but they won’t affect GM%
        </Typography>
      </Box>
    </Box>
  );
};

export default SellingStep;
