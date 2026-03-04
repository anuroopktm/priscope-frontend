import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import Header from "./components/Header";
import { steps } from "@/constants/onboarding.constants";
import BackArrow from "@/assets/onboarding/Frame 22.svg";

const Onboarding = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      alert("All steps completed!");
    }
  };
  const currentStep = steps[activeStep];
  const StepComponent = currentStep?.component;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #FFFFFF 0%, #D8ECF8 100%)",
      }}
    >
      <Header />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          px: 2,
          mb: 1,
          mt: 1,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            flexShrink: 0,
          }}
        >
          {activeStep > 0 && (
            <Box
              onClick={() => setActiveStep((prev) => prev - 1)}
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                border: "1.5px solid #1A2B44",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                "&:hover": { backgroundColor: "#f0f4f8" },
              }}
            >
              <img src={BackArrow} alt="Back" width="100%" height="100%" />
            </Box>
          )}
        </Box>

        <Box
          sx={{
            flex: 1,
            height: "1.5px",
            background:
              "repeating-linear-gradient(to right, #1A2B44 0px, #1A2B44 4px, transparent 4px, transparent 9px)",
          }}
        />

        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            backgroundColor: "#1A2B44",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: "17px",
            flexShrink: 0,
          }}
        >
          {activeStep + 1}
        </Box>

        <Box
          sx={{
            flex: 1,
            height: "1.5px",
            background:
              "repeating-linear-gradient(to right, #1A2B44 0px, #1A2B44 4px, transparent 4px, transparent 9px)",
          }}
        />

        <Box sx={{ width: 36, flexShrink: 0 }} />
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          width="100%"
          maxWidth={500}
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={1}
        >
          <Typography fontWeight="bold" fontSize="1.5rem" textAlign="center">
            {steps[activeStep].label}
          </Typography>
          {steps[activeStep].description && (
            <Typography
              fontSize="14px"
              color="text.secondary"
              textAlign="center"
            >
              {steps[activeStep].description}
            </Typography>
          )}
          <Box width="100%">{StepComponent && <StepComponent />}</Box>
          <Button fullWidth variant="contained" onClick={handleNext}>
            {activeStep === steps.length - 1 ? "Finish" : "Continue"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Onboarding;
