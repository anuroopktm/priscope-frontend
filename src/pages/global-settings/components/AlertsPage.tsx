import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  useGetAlerts,
  useUpdateAlerts,
} from "@/services/global-settings/global-setting.queries";
import {
  impactSettingsSchema,
  type ImpactSettingsFormValues,
} from "@/validations/onboarding/impactsettings.schema";
import { useToastStore } from "@/store/useToastStore";

const fields = [
  { name: "fx_threshold", label: "FX impact" },
  { name: "tariff_threshold", label: "Tariff impact" },
  { name: "freight_threshold", label: "Freight impact" },
] as const;

const AlertsPage = () => {
  const { data } = useGetAlerts();
  const { mutate, isPending } = useUpdateAlerts();
  const showToast = useToastStore((store) => store.showToast);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<ImpactSettingsFormValues>({
    resolver: zodResolver(impactSettingsSchema),
    defaultValues: {
      fx_threshold: 0,
      tariff_threshold: 0,
      freight_threshold: 0,
    },
  });
  useEffect(() => {
    if (data) {
      reset({
        fx_threshold: data.fx_threshold ?? 0,
        tariff_threshold: data.tariff_threshold ?? 0,
        freight_threshold: data.freight_threshold ?? 0,
      });
    }
  }, [data, reset]);

  const onSubmit = (data: ImpactSettingsFormValues) => {
    mutate(data, {
      onSuccess: () => {
        showToast("Alerts settings updated successfully", "success");
      },
      onError: () => {
        showToast("Failed to update alerts settings", "error");
      },
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: "flex", justifyContent: "center", mt: 4 }}
    >
      <Box sx={{ width: 420 }}>
        <Card
          sx={{ borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
        >
          <CardContent
            sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Alerts Settings
            </Typography>

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
                  placeholder="Value"
                  type="number"
                  {...register(field.name, {
                    valueAsNumber: true,
                  })}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]?.message}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 40,
                      "& input": { padding: "12px 14px" },
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
          </CardContent>
        </Card>
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  backgroundColor: "#1f4e6d",
                  textTransform: "none",
                  borderRadius: "8px",
                  height: 40,
                  "&:hover": {
                    backgroundColor: "#163c55",
                  },
                }}
              >
                {isPending ? (
                  <CircularProgress color="inherit" size={20} />
                ) : (
                  "Save"
                )}
              </Button>
            </Box>
      </Box>
    </Box>
  );
};

export default AlertsPage;
