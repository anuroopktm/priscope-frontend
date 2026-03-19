import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  systemFieldMappingSchema,
  type SystemFieldMappingFormValues,
} from "@/validations/global-settings/systemfields.schema";
import {
  useGetSystemFields,
  useUpdateSystemFields,
} from "@/services/global-settings/global-setting.queries";
import { useEffect } from "react";
import { useToastStore } from "@/store/useToastStore";

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
  const { mutate: updateSystemFields, isPending } = useUpdateSystemFields();
  const showToast = useToastStore((store) => store.showToast);

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
    updateSystemFields(payload, {
      onSuccess: () => {
        showToast("System fields updated successfully", "success");
      },
      onError: () => {
        showToast("Failed to update system fields", "error");
      },
    });
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
          <Typography sx={{ fontWeight: 600, mb: 2 }}>System Fields</Typography>
          <Typography sx={{ fontWeight: 600, mb: 2 }}>Labeling</Typography>
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
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{
          maxWidth: 500,
          mx: "auto",
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
        {isPending ? <CircularProgress color="inherit" size={20} /> : "Save"}
      </Button>
    </Box>
  );
};

export default SystemFields;
