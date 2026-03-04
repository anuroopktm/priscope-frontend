import { Box, TextField, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const GeneralInfo = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        width: "100%",
        // maxWidth: 900,
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
          //   width: "100%",
          //   maxWidth: 700,
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
          Fine-tune alerts per customer and supplier.   After setup, you’ll be
          able to define custom margin ranges for each customer and
          supplier.   These act as an extra layer of control on top of your
          global guardrails.   When you or your team adjust prices and those
          limits are crossed, Priscope will automatically trigger an alert in
          your Alerts Center.  This feature activates once your base setup is
          complete. You can manage it anytime from the customer or supplier
          view.   Think of these as personalized alert thresholds — they help
          you stay proactive where margins matter most.” 
        </Typography>
      </Box>
    </Box>
  );
};

export default GeneralInfo;
