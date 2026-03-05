import { Box, Button, TextField, Typography } from "@mui/material";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  costStepSchema,
  type CostStepFormValues,
} from "@/validations/onboarding/coststep.schema";

const CostStep = ({ onNext }: { onNext: () => void }) => {
  const { data, updateData } = useOnboardingStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CostStepFormValues>({
    resolver: zodResolver(costStepSchema),
    defaultValues: {
      core_cost_element: data.core_cost_element ?? "",
    },
  });
  const onSubmit = (formData: CostStepFormValues) => {
    updateData(formData);
    onNext();
  };
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
      <Box>
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: "normal",
            color: "#000000",
            mb: 1,
          }}
        >
          Core Cost Element
        </Typography>
        <TextField
          fullWidth
          {...register("core_cost_element")}
          error={!!errors.core_cost_element}
          helperText={errors.core_cost_element?.message}
          sx={{
            "& .MuiOutlinedInput-root": {
              height: 40,
              "& input": {
                padding: "12px 14px",
              },
            },
          }}
        />
        <Typography
          sx={{
            fontSize: "11px",
            fontWeight: "normal",
            color: "#1A2B44",
            mt: 1,
          }}
        >
          This will be the reference price for all automatic GM% and margin
          health calculations. You can still include other price fields (like
          MAP or MSRP) for reporting or analysis, but they won’t affect GM%.
        </Typography>
      </Box>
      <Button type="submit" variant="contained" fullWidth>
        Continue
      </Button>
    </Box>
  );
};

export default CostStep;
