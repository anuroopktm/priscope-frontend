import { useListSystemFields } from "@/services/queries/item-master-refactor/item-master-refactor.queries";
import { useToastStore } from "@/store/useToastStore";
import {
  Box,
  FormControl,
  Grid,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { forwardRef, useImperativeHandle } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { CSV_TYPE_OPTIONS } from "../../../constants/upload.constants";
import type { UploadFormValues } from "../types";

export interface SetControlFieldStepRef {
  handleNext: () => void;
  isPending: boolean;
}

const SetControlFieldStep = forwardRef<SetControlFieldStepRef>((_, ref) => {
  const { control, setValue, watch } = useFormContext<UploadFormValues>();
  const csvType = useWatch({ control, name: "csvType" });
  const controlFields = useWatch({ control, name: "controlFields" });
  const headers = useWatch({ control, name: "headers" });
  const { showToast } = useToastStore();

  const { mutate: mutateListSystemFields, isPending } = useListSystemFields();

  useImperativeHandle(ref, () => ({
    handleNext: () => {
      const formValues = watch();
      const payload = {
        template_type: formValues.csvType,
        type: "item+supplier+customer",
        control_fields: Object.fromEntries(
          Object.entries(formValues.controlFields).filter(([_, v]) => !!v),
        ),
      };

      mutateListSystemFields(payload, {
        onSuccess: (res) => {
          setValue("systemFields", res.data);
          const initialMapping: Record<string, string> = {};
          res.data.forEach((f) => {
            initialMapping[f.name] = "";
          });
          setValue("systemFieldMapping", initialMapping);
          setValue("activeStep", 2);
        },
        onError: () => showToast("Failed to fetch system fields", "error"),
      });
    },
    isPending,
  }));

  const currentTypeOption = CSV_TYPE_OPTIONS.find(
    (opt: any) => opt.value === csvType,
  );
  const fieldsToShow = currentTypeOption?.fields || [];

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} mb={1}>
        CSV/Excel Type
      </Typography>
      <ToggleButtonGroup
        value={csvType}
        exclusive
        onChange={(_, val) => val && setValue("csvType", val)}
        sx={{
          mb: 3,
          gap: 1,
          "& .MuiToggleButton-root": {
            borderRadius: 5,
            border: "1px solid #ccc",
            textTransform: "none",
          },
        }}
      >
        {CSV_TYPE_OPTIONS.map((opt: any) => (
          <ToggleButton key={opt.value} value={opt.value}>
            {opt.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Grid
        container
        spacing={3}
        sx={{ border: "1px solid #eee", p: 2, borderRadius: 2 }}
      >
        <Grid size={{ xs: 5 }}>
          <Typography variant="subtitle2" fontWeight={600} mb={2}>
            Control fields
          </Typography>
          {fieldsToShow.map((f: string) => (
            <Typography
              key={f}
              variant="body2"
              sx={{ mb: 3, textTransform: "capitalize" }}
            >
              {f}
            </Typography>
          ))}
        </Grid>
        <Grid size={{ xs: 7 }}>
          <Typography variant="subtitle2" fontWeight={600} mb={2}>
            Select CSV Field
          </Typography>
          {fieldsToShow.map((f: string) => (
            <FormControl key={f} fullWidth size="small" sx={{ mb: 1.5 }}>
              <Select
                value={controlFields[f] || ""}
                onChange={(e) => setValue(`controlFields.${f}`, e.target.value)}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select {f}
                </MenuItem>
                {headers.map((h) => (
                  <MenuItem key={h} value={h}>
                    {h}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
});

export default SetControlFieldStep;
