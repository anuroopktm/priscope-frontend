import { Box, Button, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const SystemFieldMapping = ({ onNext }: { onNext: () => void }) => {
  const handleSubmit = () => {
    onNext();
  };
  return (
    <Box
      onSubmit={handleSubmit}
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        mx: "auto",
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
          maxWidth: 800,
          mx: "auto",
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
          Match your data fields to Priscope's system fields. Priscope uses
          standard system fields like SKU, UPC, and Product Description to keep
          your data consistent. Match each Priscope field to the corresponding
          column in your dataset — for example, if you call UPC as “Bar Code,”
          identify that here. Once mapped, Priscope will remember your
          selections, and you can update them anytime in Global Settings.
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
          maxWidth: 500,
          mx: "auto",
        }}
      >
        <Button type="submit" variant="contained" fullWidth>
          Continue
        </Button>
      </Box>
    </Box>
  );
};
export default SystemFieldMapping;
