import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  sellingPriceElementSchema,
  type SellingPriceElementFormValues,
} from "@/validations/onboarding/sellingprice.schema";
import { useForm } from "react-hook-form";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import addCircle from "@/assets/onboarding/add-circle.svg";

const SellingStep = ({ onNext }: { onNext: () => void }) => {
  const { data, updateData } = useOnboardingStore();
  const [sellingSteps, setSellingSteps] = useState(
    data.additional_selling_price_elements ?? [],
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SellingPriceElementFormValues>({
    resolver: zodResolver(sellingPriceElementSchema),
    defaultValues: {
      core_selling_price_element: data.core_selling_price_element ?? "",
      additional_selling_price_elements:
        data.additional_selling_price_elements ?? [],
    },
  });
  const addSellingElement = () => {
    setSellingSteps([...sellingSteps, ""]);
  };

  const handleSellingElementChange = (index: number, value: string) => {
    const updated = [...sellingSteps];
    updated[index] = value;
    setSellingSteps(updated);
  };

  const onSubmit = (formData: SellingPriceElementFormValues) => {
    updateData({
      ...formData,
      additional_selling_price_elements: sellingSteps,
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
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: "normal",
            color: "#000000",
            mb: 1,
          }}
        >
          Core selling price element
        </Typography>
        <TextField
          fullWidth
          {...register("core_selling_price_element")}
          error={!!errors.core_selling_price_element}
          helperText={errors.core_selling_price_element?.message}
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
          health calculations. You can still include other price fields (like
          MAP or MSRP) for reporting or analysis, but they won’t affect GM%
        </Typography>
      </Box>
      <Box>
        <Box
          onClick={addSellingElement}
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            gap: 1,
            lineHeight: 1,
          }}
        >
          <img src={addCircle} alt="" style={{ height: "100%" }} />
          <Typography sx={{ fontSize: "12px" }}>
            Additional Selling Price Elements
          </Typography>
        </Box>
        {sellingSteps.map((value, index) => (
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
                handleSellingElementChange(index, e.target.value)
              }
            />
            <IconButton
              color="error"
              onClick={() =>
                setSellingSteps(sellingSteps.filter((_, i) => i !== index))
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

export default SellingStep;
