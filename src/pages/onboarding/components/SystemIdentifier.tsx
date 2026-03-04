import { useState } from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Button,
} from "@mui/material";

const SystemIdentifier = () => {
  const [selected, setSelected] = useState("upc");

  const options = [
    { value: "sku", label: "SKU" },
    { value: "upc", label: "UPC" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        width: "100%",
        maxWidth: 500,
      }}
    >
      <Typography sx={{ fontSize: "14px", fontWeight: 600, color: "#1A2B44" }}>
        Unique Identifier
      </Typography>

      <FormControl component="fieldset" sx={{ width: "100%" }}>
        <RadioGroup
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1.5,
            width: "100%",
          }}
        >
          {options.map((option) => {
            const isSelected = selected === option.value;
            return (
              <Box
                key={option.value}
                onClick={() => setSelected(option.value)}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  p: "14px 16px",
                  border: "1.5px solid",
                  borderColor: isSelected ? "#1A2B44" : "#D0D5DD",
                  borderRadius: "10px",
                  cursor: "pointer",
                  backgroundColor: "#ffffff",
                  transition: "border-color 0.15s ease",
                  flex: 1,
                  "&:hover": { borderColor: "#1A2B44" },
                }}
              >
                <FormControlLabel
                  value={option.value}
                  control={
                    <Radio
                      sx={{
                        color: "#D0D5DD",
                        "&.Mui-checked": { color: "#1A2B44" },
                        p: "0 8px 0 0",
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#1A2B44",
                        lineHeight: 1.4,
                      }}
                    >
                      {option.label}
                    </Typography>
                  }
                  sx={{ m: 0, alignItems: "center", width: "100%" }}
                />
              </Box>
            );
          })}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default SystemIdentifier;
