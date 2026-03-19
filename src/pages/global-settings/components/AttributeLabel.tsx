import {
  useGetAttributes,
  useUpdateAttributes,
} from "@/services/global-settings/global-setting.queries";
import {
  attributeSchema,
  type AttributeSchemaType,
} from "@/validations/global-settings/attributes.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

const AttributeLabel = () => {
  const { data } = useGetAttributes();
  const { mutate: updateAttributes } = useUpdateAttributes();

  console.log(data);
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(attributeSchema),
    mode: "onChange",
    defaultValues: {
      attributes: {},
    },
  });

  useEffect(() => {
    if (data) {
      const formatted = data.reduce(
        (acc, item) => {
          acc[item.name] = item.label;
          return acc;
        },
        {} as Record<string, string>,
      );

      reset({ attributes: formatted });
    }
  }, [data, reset]);

  const onSubmit = (data: AttributeSchemaType) => {
    const payload = {
      attributes: Object.entries(data?.attributes).map(([key, value]) => ({
        name: key,
        label: value,
      })),
    };
    updateAttributes(payload);
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 4,
        gap: 2,
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

            {data?.map((item) => (
              <Controller
                key={item.name}
                name={`attributes.${item.name}`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value || ""}
                    fullWidth
                    size="small"
                    error={!!errors.attributes?.[item.name]}
                    helperText={errors.attributes?.[item.name]?.message}
                    sx={{ mb: 2 }}
                  />
                )}
              />
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
          <Button type="submit" variant="contained">
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AttributeLabel;
