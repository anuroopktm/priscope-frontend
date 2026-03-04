import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";

const CalculateProfitStep = () => {
  const options = [
    {
      value: "margin",
      label: "Margin (%)",
      description: "shows profit as a percentage of the selling price.",
    },
    {
      value: "markup",
      label: "Markup (%)",
      description: "shows profit as a percentage of the cost.",
    },
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
      <FormControl component="fieldset" sx={{ width: "100%" }}>
        <RadioGroup
          //   value={selected}
          //   onChange={(e) => setSelected(e.target.value)}
          sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
        >
          {options.map((option) => {
            // const isSelected = selected === option.value;
            return (
              <Box
                key={option.value}
                // onClick={() => setSelected(option.value)}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  p: "14px 16px",
                  border: "1.5px solid",
                  //   borderColor: isSelected ? "#1A2B44" : "#D0D5DD",
                  borderRadius: "10px",
                  cursor: "pointer",
                  backgroundColor: "#ffffff",
                  transition: "border-color 0.15s ease",
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
                    <Box>
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
                      <Typography
                        sx={{
                          fontSize: "13px",
                          color: "#4B5563",
                          mt: 0.25,
                        }}
                      >
                        {option.description}
                      </Typography>
                    </Box>
                  }
                  sx={{ m: 0, alignItems: "flex-start", width: "100%" }}
                />
              </Box>
            );
          })}
        </RadioGroup>
      </FormControl>

      <Typography sx={{ fontSize: "12px", color: "#4B5563", lineHeight: 1.6 }}>
        Both methods use your core cost and selling price data. The only
        difference is how profit is expressed.
      </Typography>
    </Box>
  );
};

export default CalculateProfitStep;
