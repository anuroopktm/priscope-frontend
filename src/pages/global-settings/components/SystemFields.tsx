import { Box, Typography, TextField, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useOnboardingStore } from "../store/useOnboardingStore";
import {
  systemFieldMappingSchema,
  type SystemFieldMappingFormValues,
} from "@/validations/global-settings/systemfields.schema";
import {
  useGetSystemFields,
  useUpdateSystemFields,
} from "@/services/global-settings/global-setting.queries";
import { useEffect } from "react";

const fields = [
  { label: "SKU", name: "sku" },
  { label: "UPC", name: "upc" },
  { label: "Description", name: "description" },
  { label: "Category", name: "category" },
  { label: "HS Code", name: "hsCode" },
];

const fieldKeyMap: Record<string, keyof SystemFieldMappingFormValues> = {
  SKU: "sku",
  UPC: "upc",
  Description: "description",
  Category: "category",
  "HS Code": "hsCode",
};

const SystemFields = () => {
  const { data } = useGetSystemFields();
  const { mutate: updateSystemFields } = useUpdateSystemFields();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<SystemFieldMappingFormValues>({
    resolver: zodResolver(systemFieldMappingSchema),
    mode: "onChange",
    defaultValues: {
      sku: "",
      upc: "",
      description: "",
      category: "",
      hsCode: "",
    },
  });

  useEffect(() => {
    if (!data?.fields) return;

    const mappedValues = data.fields.reduce((acc, field) => {
      const key = fieldKeyMap[field.system_field];

      if (key) {
        acc[key] = field.label;
      }

      return acc;
    }, {} as SystemFieldMappingFormValues);

    reset(mappedValues);
  }, [data, reset]);

  const onSubmit = (data: SystemFieldMappingFormValues) => {
    const payload = Object.entries(fieldKeyMap).map(([key, value]) => ({
      system_field: key,
      label: data[value],
    }));
    updateSystemFields(payload);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        width: "100%",
        maxWidth: 800,
        mx: "auto",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#F9FAFB",
          borderRadius: "14px",
          p: 3,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            mb: 2,
          }}
        >
          <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
            System Fields
          </Typography>
          <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
            Labeling
          </Typography>
        </Box>

        {fields.map((field) => (
          <Box
            key={field.name}
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                color: "#1A2B44",
              }}
            >
              {field.label}
            </Typography>

            <TextField
              {...register(field.name as keyof SystemFieldMappingFormValues)}
              placeholder="Value"
              size="small"
              fullWidth
              error={!!errors[field.name as keyof SystemFieldMappingFormValues]}
              helperText={
                errors[field.name as keyof SystemFieldMappingFormValues]
                  ?.message
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  backgroundColor: "#ffffff",
                  fontSize: "14px",
                },
              }}
            />
          </Box>
        ))}
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
        <Button type="submit" variant="contained">
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default SystemFields;
