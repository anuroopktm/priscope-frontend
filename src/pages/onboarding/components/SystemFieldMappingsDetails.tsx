import { Box, Typography, TextField, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   systemFieldMappingSchema,
//   SystemFieldMappingFormValues,
// } from "@/validations/systemFieldMapping.validation";
import { useEffect } from "react";
import { useOnboardingStore } from "../store/useOnboardingStore";
import {
  systemFieldMappingSchema,
  type SystemFieldMappingFormValues,
} from "@/validations/onboarding/systemFieldMapping.validation";
// import { useOnboardingStore } from "@/store/onboarding.store";

const fields = [
  { label: "SKU", name: "sku" },
  { label: "UPC", name: "upc" },
  { label: "Description", name: "description" },
  { label: "Category", name: "category" },
  { label: "HS Code", name: "hsCode" },
  { label: "Supplier Name", name: "supplierName" },
];

const SystemFieldMappingsDetails = ({ onNext }: { onNext: () => void }) => {
  const { updateData } = useOnboardingStore();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SystemFieldMappingFormValues>({
    resolver: zodResolver(systemFieldMappingSchema),
    mode: "onChange",
  });

  const onSubmit = (data: SystemFieldMappingFormValues) => {
    updateData({ field_mappings: data });
    onNext(); // go to next step
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ width: "100%", maxWidth: 900 }}
    >
      <Typography
        sx={{
          fontSize: "16px",
          fontWeight: 600,
          color: "#1A2B44",
          mb: 2,
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

        <Typography
          sx={{
            fontSize: "13px",
            color: "#4B5563",
            mt: 1,
          }}
        >
          Matching your field names ensures Priscope reads your data correctly,
          no matter what your internal labels are.
        </Typography>
      </Box>
      <Button type="submit" variant="contained">
        Continue
      </Button>
    </Box>
  );
};

export default SystemFieldMappingsDetails;
