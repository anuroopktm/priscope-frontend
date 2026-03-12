import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  impactSettingsSchema,
  type ImpactSettingsFormValues,
} from "@/validations/onboarding/impactsettings.schema";

const ImpactSettings = ({ onNext }: { onNext: () => void }) => {
  const { data, updateData } = useOnboardingStore();

  const { handleSubmit, register } = useForm<ImpactSettingsFormValues>({
    resolver: zodResolver(impactSettingsSchema),
    defaultValues: {
      fx_threshold: data.fx_threshold ?? null,
      tariff_threshold: data.tariff_threshold ?? null,
      freight_threshold: data.freight_threshold ?? null,
    },
  });

  const onSubmit = (formData: ImpactSettingsFormValues) => {
    updateData(formData);
    onNext();
  };
  console.log(data);
  const fields = [
    { name: "fx_threshold", label: "FX impact" },
    { name: "tariff_threshold", label: "Tariff impact" },
    { name: "freight_threshold", label: "Freight impact" },
  ] as const;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        maxWidth: 500,
        mx: "auto",
      }}
    >
      {fields.map((field) => (
        <Box
          key={field.name}
          sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}
        >
          <Typography
            sx={{ fontSize: "12px", fontWeight: 500, color: "#1A2B44" }}
          >
            {field.label}
          </Typography>

          <TextField
            // type="number"
            placeholder="Value"
            {...register(field.name, {
              setValueAs: (value) => (value === "" ? null : Number(value)),
            })}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: 40,
                "& input": {
                  padding: "12px 14px",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography sx={{ fontSize: "14px", color: "#9CA3AF" }}>
                    %
                  </Typography>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      ))}

      <Button type="submit" variant="contained">
        Continue
      </Button>

      <Button
        type="button"
        variant="text"
        onClick={onNext}
        sx={{
          textTransform: "none",
          fontWeight: 600,
          fontSize: "15px",
          py: "6px",
          "&:hover": {
            backgroundColor: "transparent",
          },
        }}
      >
        Skip now
      </Button>
    </Box>
  );
};

export default ImpactSettings;
