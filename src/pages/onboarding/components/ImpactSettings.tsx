import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";

const ImpactSettings = () => {
  const [values, setValues] = useState({ fx: "", tariff: "", freight: "" });

  const fields = [
    { key: "fx", label: "FX impact" },
    { key: "tariff", label: "Tariff impact" },
    { key: "freight", label: "Freight impact" },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%", maxWidth: 500 }}>
      {fields.map((field) => (
        <Box key={field.key} sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
          <Typography sx={{ fontSize: "14px", fontWeight: 600, color: "#1A2B44" }}>
            {field.label}
          </Typography>
          <TextField
            placeholder="Value"
            value={values[field.key]}
            onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography sx={{ fontSize: "14px", color: "#9CA3AF" }}>%</Typography>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                backgroundColor: "#ffffff",
                fontSize: "14px",
                "& fieldset": { borderColor: "#D0D5DD" },
                "&:hover fieldset": { borderColor: "#1A2B44" },
                "&.Mui-focused fieldset": { borderColor: "#1A2B44" },
              },
              "& input": { color: "#1A2B44" },
              "& input::placeholder": { color: "#9CA3AF", opacity: 1 },
            }}
          />
        </Box>
      ))}

      <Box
        sx={{
          mt: 1,
          p: "16px",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <Typography sx={{ fontSize: "13px", color: "#4B5563", lineHeight: 1.6, fontStyle: "italic" }}>
          Example: If you set FX to 2%, Priscope will alert you when exchange-rate shifts reduce or raise gross margin by more than 2%.
        </Typography>
        <Typography sx={{ fontSize: "13px", color: "#4B5563", lineHeight: 1.6, mt: 1 }}>
          You can fine-tune these values anytime in Global settings.
          <br />
          Alerts appear only in your Alerts Center — no emails or pop-ups.
        </Typography>
      </Box>

      {/* <Button
        variant="contained"
        onClick={() => console.log("Values:", values)}
        sx={{
          backgroundColor: "#1A2B44",
          color: "#ffffff",
          borderRadius: "10px",
          textTransform: "none",
          fontWeight: 600,
          fontSize: "15px",
          py: "14px",
          width: "100%",
          "&:hover": { backgroundColor: "#14223a" },
          boxShadow: "none",
        }}
      >
        Continue
      </Button> */}

      <Button
        variant="text"
        onClick={() => console.log("Skipped")}
        sx={{
          color: "#1A2B44",
          textTransform: "none",
          fontWeight: 600,
          fontSize: "15px",
          py: "6px",
          "&:hover": { backgroundColor: "transparent", textDecoration: "underline" },
        }}
      >
        Skip now
      </Button>
    </Box>
  );
};

export default ImpactSettings;