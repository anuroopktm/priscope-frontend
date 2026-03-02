import { InsertDriveFile as FileIcon } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { DATA_TYPES } from "@/pages/items-master/constants/data_mapping.constants";
import type { AttributeConfigurationProps } from "@/pages/items-master-refactor/types/types";
import { theme } from "@/theme/theme";

const AttributeConfiguration: React.FC<AttributeConfigurationProps> = ({
  fileName,
  attributeConfiguration,
  onAttributeConfigChange,
  saveAsTemplate,
  onSaveAsTemplateChange,
  onTemplateNameChange,
  templateName,
  selectedTemplate,
}) => {
  const isDefaultTemplateSelected = selectedTemplate.length > 0;
  const handleDataTypeChange =
    (attribute: string) => (event: SelectChangeEvent<string>) => {
      onAttributeConfigChange(attribute, "dataType", event.target.value);
    };

  const handleMandatoryChange =
    (attribute: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      onAttributeConfigChange(attribute, "mandatory", event.target.checked);
    };

  const handleSaveAsTemplateChange = (checked: boolean) => {
    onSaveAsTemplateChange(checked);
    if (!checked && onTemplateNameChange) {
      onTemplateNameChange("");
    }
  };

  const handleTemplateNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const name = event.target.value;
    if (onTemplateNameChange) {
      onTemplateNameChange(name);
    }
  };

  return (
    <Box>
      {/* Header with Search */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 600,
            fontSize: 24,
          }}
        >
          Attribute Configuration
        </Typography>
      </Box>

      {/* File Info Row */}
      <Box
        sx={{
          padding: "12px",
          border: 1,
          borderColor: "#E8E8E8",
          borderRadius: "8px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: 1.5,
            bgcolor: "grey.50",
            borderRadius: 1,
            mb: 2,
          }}
        >
          {/* File icon and name */}
          <Box sx={{ display: "flex", alignItems: "center", flex: 1, gap: 1 }}>
            <FileIcon
              sx={{ color: theme.palette.brand.subTextColor, fontSize: 28 }}
            />
            <Typography variant="body2" sx={{ fontSize: 16, color: "black" }}>
              {fileName}
            </Typography>
          </Box>

          {/* Headers */}
          <Box sx={{ width: "45%", textAlign: "left" }}>
            <Typography
              variant="body2"
              fontWeight={600}
              color={theme.palette.primary.main}
            >
              Data Type
            </Typography>
          </Box>
          <Box sx={{ width: "15%", textAlign: "center" }}>
            <Typography
              variant="body2"
              fontWeight={600}
              color={theme.palette.primary.main}
            >
              Mandatory
            </Typography>
          </Box>
        </Box>

        {/* Attribute Rows */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {Object.entries(attributeConfiguration).map(
            ([attributeName, config]) => (
              <Box
                key={attributeName}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {/* Attribute Name */}
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 500,
                      wordBreak: "break-word",
                    }}
                  >
                    {attributeName}
                  </Typography>
                </Box>

                {/* Data Type Dropdown */}
                <Box sx={{ width: "45%" }}>
                  <FormControl fullWidth size="medium">
                    <Select
                      variant={"outlined"}
                      value={config.dataType}
                      onChange={handleDataTypeChange(attributeName)}
                    >
                      {DATA_TYPES.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* Mandatory Switch */}
                <Box
                  sx={{
                    width: "15%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Switch
                    checked={config.mandatory}
                    onChange={handleMandatoryChange(attributeName)}
                    size="medium"
                  />
                </Box>
              </Box>
            ),
          )}
        </Box>
      </Box>
      <Divider sx={{ mt: 2, mb: 1 }} />

      {/* Save as Template */}
      {!isDefaultTemplateSelected && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={saveAsTemplate}
                onChange={(e) => handleSaveAsTemplateChange(e.target.checked)}
                size="small"
              />
            }
            label={
              <Typography variant="body2" color={theme.palette.primary.main}>
                Save as Template
              </Typography>
            }
          />

          {saveAsTemplate && (
            <TextField
              placeholder="Enter template name"
              value={templateName}
              onChange={handleTemplateNameChange}
              sx={{ minWidth: 400, m: 1 }}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default AttributeConfiguration;
