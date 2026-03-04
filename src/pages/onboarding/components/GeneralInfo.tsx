import { Box, Button, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const GeneralInfo = ({ onNext }: { onNext: () => void }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1.5,
          p: "14px 16px",
          backgroundColor: "#ffffff",
          border: "1.5px solid #D0D5DD",
          borderRadius: "10px",
        }}
      >
        <InfoOutlinedIcon
          sx={{
            fontSize: 18,
            color: "#4B5563",
            mt: "1px",
            flexShrink: 0,
          }}
        />

        <Typography
          sx={{
            fontSize: "13px",
            color: "#1A2B44",
            lineHeight: 1.6,
          }}
        >
          Fine-tune alerts per customer and supplier. After setup, you’ll be
          able to define custom margin ranges for each customer and supplier.
          These act as an extra layer of control on top of your global
          guardrails. When limits are crossed, Priscope will automatically
          trigger an alert in your Alerts Center. This feature activates once
          your base setup is complete.
        </Typography>
      </Box>

      <Button variant="contained" onClick={onNext} fullWidth>
        Continue
      </Button>
    </Box>
  );
};

export default GeneralInfo;
