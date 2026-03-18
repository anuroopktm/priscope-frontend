import { Box, Button, CircularProgress, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useOnboardingMutation } from "@/services/queries/onboarding/onboarding.queries";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { useToastStore } from "@/store/useToastStore";

const GeneralInfo = ({ onNext }: { onNext: () => void }) => {
  const { data } = useOnboardingStore();
  const { mutate, isPending } = useOnboardingMutation();
  const showToast = useToastStore((store) => store.showToast);

  const handleSubmit = () => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        return;
      }
      if (typeof value === "object" && !(value instanceof File)) {
        formData.append(key, JSON.stringify(value));
        return;
      }
      if (typeof value === "number") {
        formData.append(key, String(value));
        return;
      }
      if (value instanceof File) {
        formData.append(key, value);
        return;
      }
      formData.append(key, value as string);
    });

    mutate(formData, {
      onSuccess: () => {
        showToast("Onboarding completed successfully", "success");
        onNext();
      },
      onError: () => {
        showToast("Onboarding failed", "error");
      },
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        maxWidth: 800,
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
          maxWidth: 600,
          mx: "auto",
        }}
      >
        <Button variant="contained" onClick={handleSubmit} fullWidth>
          {isPending ? <CircularProgress size={20} /> : "Continue"}
        </Button>
      </Box>
    </Box>
  );
};

export default GeneralInfo;
