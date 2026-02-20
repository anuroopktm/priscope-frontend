import theme from "@/shared/styles/theme";
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
          border: `2px solid ${theme.palette.sidebar.divider}`,
          borderRadius: '30%',
          backgroundColor: theme.custom.inputBg,
          '& .MuiStepIcon-text': {
            fill: theme.palette.sidebar.divider,
            fontWeight: 'bold'
          }
        },
        '& .MuiStepIcon-root.Mui-active': {
          // Active step styling
          backgroundColor: theme.palette.sidebar.divider,
          border: `2px solid ${theme.palette.sidebar.divider}`,
          color: theme.palette.sidebar.divider,
          '& .MuiStepIcon-text': {
            fill: theme.custom.inputBg,
            fontWeight: 'bold'
          }
        },
        '& .MuiStepIcon-root.Mui-completed': {
          // Completed step styling (same as active)
          backgroundColor: theme.palette.sidebar.divider,
          border: `2px solid ${theme.palette.sidebar.divider}`,
          color: theme.custom.inputBg,
          '& .MuiStepIcon-text': {
            fill: theme.custom.inputBg,
            fontWeight: 'bold'
          }
        },
        '& .MuiStepLabel-label': {
          // Step label text color
          color: theme.palette.sidebar.divider,
          fontWeight: '600'
        },
        '& .MuiStepLabel-label.Mui-active': {
          // Active step label
          color: theme.palette.sidebar.divider,
          fontWeight: '600'
        },
        '& .MuiStepLabel-label.Mui-completed': {
          // Completed step label
          color: theme.palette.sidebar.divider,
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
                  border: `1px solid ${theme.palette.sidebar.divider}`,
                  backgroundColor: active || completed
                    ? theme.palette.sidebar.divider
                    : theme.custom.inputBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "lighter",
                  fontSize: 14, 
                  color: active || completed
                    ? theme.custom.inputBg
                    : theme.palette.sidebar.divider
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