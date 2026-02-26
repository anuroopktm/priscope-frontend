import { useMapItemMasterFields } from "@/services/queries/item-master-refactor/item-master-refactor.queries";
import type { MapFieldsRequestBody } from "@/services/queries/item-master-refactor/item-master-refactor.types";
import { useToastStore } from "@/store/useToastStore";
import { InsertDriveFile as FileIconFilled } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React, { forwardRef, useImperativeHandle } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { DATA_TYPES } from "../../../constants/upload.constants";
import type { UploadFormValues } from "../types";

export interface AttributeConfigStepRef {
  handleImport: () => void;
  isPending: boolean;
}

const AttributeConfigStep = forwardRef<
  AttributeConfigStepRef,
  { onImportComplete?: () => void; handleClose: () => void }
>(({ onImportComplete, handleClose }, ref) => {
  const { control, setValue, handleSubmit } =
    useFormContext<UploadFormValues>();
  const config = useWatch({ control, name: "attributeConfiguration" });
  const saveAsTemplate = useWatch({ control, name: "saveAsTemplate" });
  const templateName = useWatch({ control, name: "templateName" });
  const file = useWatch({ control, name: "file" });
  const systemFields = useWatch({ control, name: "systemFields" });
  const { showToast } = useToastStore();

  const { mutate: mapFields, isPending } = useMapItemMasterFields();

  const processImport = (data: UploadFormValues) => {
    const system_fields = Object.entries(data.systemFieldMapping)
      .filter(([_, v]) => !!v)
      .map(([fieldName, headerValue]) => {
        const matchingField = systemFields.find((f) => f.name === fieldName);
        return {
          label: matchingField?.label || fieldName,
          header: headerValue,
          data_type: matchingField?.source_type,
        };
      });

    const attributes = Object.entries(data.attributeConfiguration).map(
      ([header, config]) => ({
        header,
        data_type: config.dataType.toLowerCase().replace(" ", "_"),
        is_mandatory: config.mandatory,
      }),
    );

    const payload: MapFieldsRequestBody = {
      is_template: data.saveAsTemplate,
      template_name:
        data.templateName || data.file?.name.replace(/\.[^/.]+$/, ""),
      control_fields: data.controlFields,
      system_fields,
      attributes,
      type: data.csvType,
    };

    mapFields(
      {
        upload_id: data.uploadId,
        payload,
        update_if_exists: true,
      },
      {
        onSuccess: () => {
          showToast("Import started successfully", "success");
          onImportComplete?.();
          handleClose();
        },
        onError: (err: any) =>
          showToast(err.message || "Mapping failed", "error"),
      },
    );
  };

  useImperativeHandle(ref, () => ({
    handleImport: () => {
      handleSubmit(processImport)();
    },
    isPending,
  }));

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" mb={2}>
        Attribute Configuration
      </Typography>
      <Box sx={{ border: "1px solid #eee", p: 2, borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2,
            bgcolor: "#f9f9f9",
            p: 1,
            borderRadius: 1,
          }}
        >
          <FileIconFilled color="disabled" />
          <Typography variant="body2" sx={{ flexGrow: 1 }}>
            {file?.name}
          </Typography>
          <Box sx={{ width: "40%", textAlign: "left" }}>
            <Typography variant="caption" fontWeight={600}>
              Data Type
            </Typography>
          </Box>
          <Box sx={{ width: "15%", textAlign: "center" }}>
            <Typography variant="caption" fontWeight={600}>
              Mandatory
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {Object.entries(config).map(([attr, val]) => (
            <Box
              key={attr}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {attr}
              </Typography>
              <FormControl sx={{ width: "40%" }} size="small">
                <Select
                  value={val.dataType}
                  onChange={(e) =>
                    setValue(
                      `attributeConfiguration.${attr}.dataType`,
                      e.target.value,
                    )
                  }
                >
                  {DATA_TYPES.map((t: string) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box
                sx={{
                  width: "15%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Switch
                  checked={val.mandatory}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setValue(
                      `attributeConfiguration.${attr}.mandatory`,
                      e.target.checked,
                    )
                  }
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={saveAsTemplate}
              onChange={(e) => setValue("saveAsTemplate", e.target.checked)}
            />
          }
          label="Save as Template"
        />
        {saveAsTemplate && (
          <TextField
            size="small"
            placeholder="Template Name"
            value={templateName}
            onChange={(e) => setValue("templateName", e.target.value)}
            sx={{ minWidth: 250 }}
          />
        )}
      </Box>
    </Box>
  );
});

export default AttributeConfigStep;
