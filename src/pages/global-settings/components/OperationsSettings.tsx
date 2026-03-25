import {
  useGetOperationsSettings,
  useUpdateOperationsSettings,
} from "@/services/queries/global-settings/global-setting.queries";
import { useToastStore } from "@/store/useToastStore";
import {
  systemIdentifierSchema,
  type SystemIdentifierFormValues,
} from "@/validations/onboarding/systemidentifier.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Radio,
  CircularProgress,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

const options = [
  { label: "SKU", value: "sku" },
  { label: "UPC", value: "upc" },
];

const OperationsSettings = () => {
  const { data } = useGetOperationsSettings();
  const { mutate, isPending } = useUpdateOperationsSettings();
  const showToast = useToastStore((store) => store.showToast);

  const {
    control,
    handleSubmit,
    // formState: { errors },
    reset,
  } = useForm<SystemIdentifierFormValues>({
    resolver: zodResolver(systemIdentifierSchema),
    mode: "onChange",
    defaultValues: {
      system_identifier: "",
    },
  });

  useEffect(() => {
    if (!data?.system_identifier) return;
    reset({
      system_identifier: data.system_identifier,
    });
  }, [data, reset]);

  const onSubmit = (data: SystemIdentifierFormValues) => {
    mutate(data, {
      onSuccess: () => {
        showToast("Operations settings updated successfully", "success");
      },
      onError: () => {
        showToast("Failed to update operations settings", "error");
      },
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 4,
      }}
    >
      <Box sx={{ width: 420 }}>
        <Card
          sx={{
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Operations Settings
            </Typography>

            <Typography fontSize="14px" fontWeight={600} color="#1A2B44" mb={1}>
              Unique Identifier
            </Typography>

            <Controller
              name="system_identifier"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Box display="flex" gap={1.5}>
                    {options.map((option) => {
                      const isSelected = field.value === option.value;

                      return (
                        <Box
                          key={option.value}
                          onClick={() => field.onChange(option.value)}
                          sx={{
                            flex: 1,
                            p: "14px 16px",
                            border: "1.5px solid",
                            borderColor: isSelected ? "#1A2B44" : "#D0D5DD",
                            borderRadius: "10px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            "&:hover": { borderColor: "#1A2B44" },
                          }}
                        >
                          <Radio
                            checked={isSelected}
                            value={option.value}
                            sx={{
                              p: 0,
                              "&.Mui-checked": {
                                color: "#1A2B44",
                              },
                            }}
                          />
                          <Typography fontSize="14px" fontWeight={600}>
                            {option.label}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>

                  {fieldState.error && (
                    <Typography color="error" fontSize="12px" mt={0.5}>
                      {fieldState.error.message}
                    </Typography>
                  )}
                </>
              )}
            />
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

export default OperationsSettings;
