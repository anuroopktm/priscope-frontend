import { Box, Typography, TextField, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOnboardingStore } from "../store/useOnboardingStore";
import {
  systemFieldMappingSchema,
  type SystemFieldMappingFormValues,
} from "@/validations/onboarding/systemFieldMapping.validation";

const fields = [
  { label: "SKU", name: "sku" },
  { label: "UPC", name: "upc" },
  { label: "Description", name: "description" },
  { label: "Category", name: "category" },
  { label: "HS Code", name: "hsCode" },
  { label: "Supplier Name", name: "supplierName" },
  { label: "Supplier Code", name: "supplierCode" },
  { label: "Customer Name", name: "customerName" },
  { label: "Customer Code", name: "customerCode" },
];

const SystemFieldMappingsDetails = ({ onNext }: { onNext: () => void }) => {
  const { data, updateData } = useOnboardingStore();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SystemFieldMappingFormValues>({
    resolver: zodResolver(systemFieldMappingSchema),
    mode: "onChange",
    defaultValues: data.field_mappings ?? {
      sku: "",
      upc: "",
      description: "",
      category: "",
      hsCode: "",
      supplierName: "",
    },
  });

  const onSubmit = (data: SystemFieldMappingFormValues) => {
    updateData({ field_mappings: data });
    onNext();
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
      <Typography
        sx={{
          fontSize: "12px",
          fontWeight: 600,
          color: "#1A2B44",
        }}
      >
        System field labelling
      </Typography>

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
      <Typography
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontSize: "13px",
          color: "#4B5563",
          mt: 1,
        }}
      >
        Matching your field names ensures Priscope reads your data correctly, no
        matter what your internal labels are.
      </Typography>
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
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default SystemFieldMappingsDetails;
