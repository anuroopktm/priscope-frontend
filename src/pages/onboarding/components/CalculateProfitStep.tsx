import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  profitStepSchema,
  type ProfitStepFormValues,
} from "@/validations/onboarding/profitstep.schema";

const CalculateProfitStep = ({ onNext }: { onNext: () => void }) => {
  const { data, updateData } = useOnboardingStore();
  const { handleSubmit, control } = useForm<ProfitStepFormValues>({
    defaultValues: {
      profitability_mode: data.profitability_mode ?? "",
    },
    resolver: zodResolver(profitStepSchema),
  });
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

  const onSubmit = (formData: ProfitStepFormValues) => {
    console.log(data)
    updateData(formData);
    onNext();
  };
  return (
    <Box
      onSubmit={handleSubmit(onSubmit)}
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        width: "100%",
        maxWidth: 500,
      }}
    >
      <FormControl component="fieldset" sx={{ width: "100%" }}>
        <Controller
          name="profitability_mode"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <RadioGroup
                {...field}
                sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
              >
                {options.map((option) => (
                  <Box
                    key={option.value}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      p: "14px 16px",
                      border: "1.5px solid",
                      borderColor:
                        field.value === option.value ? "#1A2B44" : "#D0D5DD",
                      borderRadius: "10px",
                      cursor: "pointer",
                      backgroundColor: "#ffffff",
                      "&:hover": { borderColor: "#1A2B44" },
                    }}
                  >
                    <FormControlLabel
                      value={option.value}
                      control={
                        <Radio
                          sx={{
                            "&.Mui-checked": { color: "#1A2B44" },
                            p: "0 8px 0 0",
                          }}
                        />
                      }
                      label={
                        <Box>
                          <Typography fontSize="14px" fontWeight={600}>
                            {option.label}
                          </Typography>
                          <Typography fontSize="13px" color="#4B5563">
                            {option.description}
                          </Typography>
                        </Box>
                      }
                      sx={{ m: 0, alignItems: "flex-start", width: "100%" }}
                    />
                  </Box>
                ))}
              </RadioGroup>

              {fieldState.error && (
                <Typography color="error" fontSize="12px">
                  {fieldState.error.message}
                </Typography>
              )}
            </>
          )}
        />
      </FormControl>

      <Typography sx={{ fontSize: "12px", color: "#4B5563", lineHeight: 1.6 }}>
        Both methods use your core cost and selling price data. The only
        difference is how profit is expressed.
      </Typography>
      <Button type="submit" variant="contained" fullWidth>Continue</Button>
    </Box>
  );
};

export default CalculateProfitStep;
