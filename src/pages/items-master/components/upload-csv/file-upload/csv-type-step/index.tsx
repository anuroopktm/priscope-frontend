import React, { type ChangeEvent } from "react";
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  type SelectChangeEvent,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { Grid } from "@mui/material";
import {
  type ControlFields,
  CSV_TYPE_OPTIONS,
  CONTROL_FIELDS,
} from "@/pages/items-master/constants/upload.constants";
import { useItemMasterStore } from "../../../../store/itemMasterStore";
import { KeyboardArrowDown } from "@mui/icons-material";

type CsvTypeSelectionProps = {
  csvType: string;
  controlFields: ControlFields;
  onCsvTypeChange: (value: string) => void;
  onControlFieldChange: (field: keyof ControlFields, value: string) => void;
};

const CsvTypeSelection: React.FC<CsvTypeSelectionProps> = ({
  csvType,
  controlFields,
  onCsvTypeChange,
  onControlFieldChange,
}) => {
  const availableOptions = useItemMasterStore(
    (state) => state.getAvailableHeaders,
  );
  const setControlFields = useItemMasterStore(
    (state) => state.setControlFields,
  );
  const clearFields = useItemMasterStore((state) => state.clearFields);
  const selected = useItemMasterStore((state) => state.selected);
  const handleCsvTypeChange = (
    event: SelectChangeEvent<string> | ChangeEvent<HTMLInputElement>,
  ) => {
    onCsvTypeChange(event.target.value);
    clearFields([
      CONTROL_FIELDS.ITEM,
      CONTROL_FIELDS.CUSTOMER,
      CONTROL_FIELDS.SUPPLIER,
    ]);
  };

  const getCurrentFields = (): string[] => {
    return (
      CSV_TYPE_OPTIONS.find((type) => type.value === csvType)?.fields || []
    );
  };

  return (
    <Box>
      {/* CSV/Excel Type Section */}
      <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600 }}>
        CSV/Excel Type
      </Typography>
      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <ToggleButtonGroup
          value={csvType}
          exclusive
          onChange={(_, value) => {
            if (value) handleCsvTypeChange({ target: { value } } as any);
          }}
          sx={{
            display: "flex",
            gap: 1.5,
            flexWrap: "wrap",
            "& .MuiToggleButton-root": {
              borderRadius: "9999px",
              textTransform: "none",
              fontSize: "14px",
              fontWeight: 600,
              padding: "6px 16px",
              border: "1px solid #D2D2D2",
              color: "#777777",
              backgroundColor: "#ffffffff",
              "&.Mui-selected": {
                borderColor: "#1A2B44",
                color: "#1A2B44",
                fontWeight: 600,
              },
              "&:hover": {
                backgroundColor: "#F9FAFB",
              },
            },
          }}
        >
          {CSV_TYPE_OPTIONS.map((option) => (
            <ToggleButton key={option.value} value={option.value}>
              {option.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </FormControl>

      {/* Control Fields and CSV Selection */}
      <Grid
        container
        spacing={3}
        sx={{ border: "1px solid #E8E8E8", padding: 2, borderRadius: "8px" }}
      >
        <Grid size={5}>
          <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600 }}>
            Control fields
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {getCurrentFields().map((field) => (
              <Typography
                key={field}
                variant="body2"
                sx={{ textTransform: "capitalize" }}
              >
                {field}
              </Typography>
            ))}
          </Box>
        </Grid>
        <Grid size={7}>
          <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600 }}>
            Select CSV Field
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {getCurrentFields().map((field) => (
              <FormControl key={field} fullWidth size="small">
                <Select
                  // variant={"outlined"}
                  value={controlFields[field as keyof ControlFields]}
                  onChange={(e) => {
                    setControlFields(field, e.target.value);
                    onControlFieldChange(
                      field as keyof ControlFields,
                      e.target.value,
                    );
                  }}
                  displayEmpty
                  IconComponent={KeyboardArrowDown}
                >
                  <MenuItem value="" disabled>
                    Select {field}
                  </MenuItem>
                  {availableOptions(field).map((column) => (
                    <MenuItem key={column} value={column}>
                      {column}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CsvTypeSelection;
