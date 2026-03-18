import { useGetAttributes } from "@/services/global-settings/global-setting.queries";
import { Box, Card, CardContent, Typography } from "@mui/material";

const AttributeLabel = () => {
  const { data } = useGetAttributes();
  console.log(data)
  // const {
  //     handleSubmit,
  //     register,
  //     formState: { errors },
  //   } = useForm<SystemFieldMappingFormValues>({
  //     resolver: zodResolver(systemFieldMappingSchema),
  //     mode: "onChange",
  //     defaultValues: {
  //       sku: "",
  //       upc: "",
  //       description: "",
  //       category: "",
  //       hsCode: "",
  //     },
  //   });
  return (
    <Box
      component="form"
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
              Attribute Label
            </Typography>

            <Typography sx={{ mb: 0.5 }}>Company Name*</Typography>
            {/* <Controller
              name="company_name"
            //   control={control}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  size="small"
                  {...field}
                  fullWidth
                  //   error={!!errors.company_name}
                  //   helperText={errors.company_name?.message}
                  sx={{ mb: 2 }}
                />
              )}
            /> */}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AttributeLabel;
