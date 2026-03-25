import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  costStepSchema,
  type CostStepFormValues,
} from "@/validations/onboarding/coststep.schema";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import addCircle from "@/assets/onboarding/add-circle.svg";

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
      additional_cost_elements: data.additional_cost_elements ?? [],
    },
  });

  const [additionalCosts, setAdditionalCosts] = useState(
    data.additional_cost_elements ?? [],
  );

  const addCostElement = () => {
    setAdditionalCosts([...additionalCosts, ""]);
  };

  const handleAdditionalCostChange = (index: number, value: string) => {
    const updated = [...additionalCosts];
    updated[index] = value;
    setAdditionalCosts(updated);
  };

  const onSubmit = (formData: CostStepFormValues) => {
    const cleaned = additionalCosts
      .map((i) => i.trim())
      .filter((i) => i !== "");

    updateData({
      ...formData,
      additional_cost_elements: cleaned.length > 0 ? cleaned : null,
    });

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
        <Typography sx={{ fontSize: "12px", mb: 1 }}>
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
              "& input": { padding: "12px 14px" },
            },
          }}
        />
        <Typography sx={{ fontSize: "11px", mt: 1 }}>
          {/* This will be the reference price for all automatic GM% calculations. */}
          This will become Priscope’s reference point for all gross margin (GM%)
          calculations. You can also tag other cost fields (like Freight, Duty,
          or Testing Fees) for reference, but they won’t affect automatic GM%.
        </Typography>
      </Box>

      <Box>
        <Box
          onClick={addCostElement}
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            gap: 1,
            // justifyContent: "center"
            lineHeight: 1,
          }}
        >
          <img src={addCircle} alt="" style={{ height: "100%" }} />
          <Typography sx={{ fontSize: "12px" }}>
            Additional Cost Elements
          </Typography>
        </Box>
        {additionalCosts.map((value, index) => (
          <Box key={index} sx={{ display: "flex", gap: 1, mt: 1 }}>
            <TextField
              fullWidth
              value={value}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: 40,
                  "& input": { padding: "12px 14px" },
                },
              }}
              placeholder="e.g., freight, duty, testing fees"
              onChange={(e) =>
                handleAdditionalCostChange(index, e.target.value)
              }
            />
            <IconButton
              color="error"
              onClick={() =>
                setAdditionalCosts(
                  additionalCosts.filter((_, i) => i !== index),
                )
              }
              size="small"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>
      <Typography sx={{ fontSize: "11px", mt: 1 }}>
        The primary cost field should reflect your base cost per unit — it
        drives all gross margin calculations.
      </Typography>

      <Button type="submit" variant="contained" fullWidth>
        Continue
      </Button>
    </Box>
  );
};

export default CostStep;
