import { theme } from "@/theme/theme";
import { Step, StepLabel, Stepper } from "@mui/material";
import React from "react";

interface StyledStepperProps {
  activeStep: number;
  steps: string[];
  sx?: object; // Allow additional sx props if needed
}

const StyledStepper: React.FC<StyledStepperProps> = ({
  activeStep,
  steps,
  sx = {}
}) => {
  return (
    <Stepper
      activeStep={activeStep}
      sx={{
        width: "100%",
        '& .MuiStepIcon-root': {
          // Non-active step styling
          color: 'transparent',
          border: `2px solid ${theme.palette.brand.divider}`,
          borderRadius: '30%',
          backgroundColor: theme.palette.brand.inputBg,
          '& .MuiStepIcon-text': {
            fill: theme.palette.brand.divider,
            fontWeight: 'bold'
          }
        },
        '& .MuiStepIcon-root.Mui-active': {
          // Active step styling
          backgroundColor: theme.palette.brand.divider,
          border: `2px solid ${theme.palette.brand.divider}`,
          color: theme.palette.brand.divider,
          '& .MuiStepIcon-text': {
            fill: theme.palette.brand.inputBg,
            fontWeight: 'bold'
          }
        },
        '& .MuiStepIcon-root.Mui-completed': {
          // Completed step styling (same as active)
          backgroundColor: theme.palette.brand.divider,
          border: `2px solid ${theme.palette.brand.divider}`,
          color: theme.palette.brand.inputBg,
          '& .MuiStepIcon-text': {
            fill: theme.palette.brand.inputBg,
            fontWeight: 'bold'
          }
        },
        '& .MuiStepLabel-label': {
          // Step label text color
          color: theme.palette.brand.divider,
          fontWeight: '600'
        },
        '& .MuiStepLabel-label.Mui-active': {
          // Active step label
          color: theme.palette.brand.divider,
          fontWeight: '600'
        },
        '& .MuiStepLabel-label.Mui-completed': {
          // Completed step label
          color: theme.palette.brand.divider,
          fontWeight: '600'
        },
        ...sx // Merge any additional sx props
      }}
    >
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel
            StepIconComponent={(props) => {
              const { icon, active, completed } = props;
              return (
                <div className="MuiStepIcon-root" style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: `1px solid ${theme.palette.brand.divider}`,
                  backgroundColor: active || completed
                    ? theme.palette.brand.divider
                    : theme.palette.brand.inputBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "lighter",
                  fontSize: 14, 
                  color: active || completed
                    ? theme.palette.brand.inputBg
                    : theme.palette.brand.divider
                }}>
                  {icon}
                </div>
              );
            }}
          >
            {label }
          </StepLabel>

        </Step>
      ))}
    </Stepper>
  );
};

export default StyledStepper;