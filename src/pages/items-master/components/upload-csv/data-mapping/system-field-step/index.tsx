import theme from "@/shared/styles/theme";
import { InsertDriveFile as FileIcon } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Divider,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useListTemplateHeaders, useListTemplates } from "../../../../services/itemMasterService";
import { useItemMasterStore } from "../../../../store/itemMasterStore";
import { SystemFieldMappingProps } from "../../../../types";
import { SnackbarState } from "@/app/[lang]/(protected)/freight-rate-library/types";

// Extended props to include template name handling
interface SystemFieldMappingPropsExtended extends SystemFieldMappingProps {
  templateName?: string;
  onTemplateNameChange?: (name: string) => void;
  fieldErrors?: Record<string, boolean>;
  setSelectedTemplate: React.Dispatch<React.SetStateAction<string>>;
  selectedTemplate: string;
  setSnackbar: React.Dispatch<React.SetStateAction<SnackbarState>>
}

const SystemFieldMapping: React.FC<SystemFieldMappingPropsExtended> = ({
  fileName,
  systemFieldMapping,
  onSystemFieldChange,
  saveAsTemplate,
  onSaveAsTemplateChange,
  templateName = "",
  onTemplateNameChange,
  fieldErrors,
  setSelectedTemplate,
  selectedTemplate,
  setSnackbar
}) => {

  const getAvailableHeaders = useItemMasterStore(
    (state) => state.getAvailableHeaders
  );
  const setSelectedField = useItemMasterStore((state) => state.setSelected);
  const clearFields = useItemMasterStore((state) => state.clearFields);
  const selected = useItemMasterStore((state) => state.selected);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError} = useListTemplates();
  const { mutate: listTemplateHeaders, isPending: islistTemplateHeadersPending } = useListTemplateHeaders();
  const handleFieldChange =
    (field: string) => (event: SelectChangeEvent<string>) => {
      if (fieldErrors?.[field]) {
        fieldErrors[field] = false;
      }

      const selectedValue = event.target.value;

      setSelectedField(field, selectedValue, "system");
      onSystemFieldChange(field, selectedValue);
    };

  const handleTemplateSelect = (event: SelectChangeEvent<string>) => {
    const templateValue = event.target.value;
    clearFields(Object.keys(systemFieldMapping));

    listTemplateHeaders(
      {
        payload: {
          search: "",
          page_size: 100,
          skip: 0
        }, template_id: templateValue
      },
      {
        onSuccess: (response) => {
          setSelectedTemplate(templateValue);
          const { headers } = response;

          const updatedMapping = { ...systemFieldMapping };

          headers.forEach((header) => {
            const fieldLabel = header.label;
            const headerName = header.name;

            if (updatedMapping.hasOwnProperty(fieldLabel)) {
              const availableHeaders = getAvailableHeaders("");
              if (availableHeaders.includes(headerName)) {
                updatedMapping[fieldLabel] = headerName;
                setSelectedField(fieldLabel, headerName, "system");
              }
            }
          });

          Object.entries(updatedMapping).forEach(([field, name]) => {
            onSystemFieldChange(field, name);
          });
        },
        onError: (err) => {
          const message = err.status === 404 ?
                err.body.detail[0].msg ||
                err.body.detail : "Failed to fetch template headers"
            setSnackbar({ message, severity: "error" });
        }
      }
    );
  };



 const templates = data?.pages.flatMap((page) => page.templates) ?? [];

  return (
    <Box>
      {/* Template Selection */}
      <Box sx={{ marginBottom: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography
          variant="subtitle1"
          sx={{
            color: theme.custom.textColor,
            fontWeight: 600,
            fontSize: "20px",
          }}
        >
          System Field Configuration
        </Typography>
        <FormControl sx={{ minWidth: 272 }}>
          <Select
            value={selectedTemplate}
            onChange={handleTemplateSelect}
            displayEmpty
            size="small"
            MenuProps={{
              PaperProps: {
                style: { maxHeight: 200 },
                onScroll: (event: any) => {
                  const bottom =
                    event.target.scrollHeight - event.target.scrollTop ===
                    event.target.clientHeight;

                  if (bottom && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                  }
                },
              },
            }}
            disabled={islistTemplateHeadersPending}
          >
            <MenuItem value="" disabled>
              <Typography color={theme.custom.subTextColor}>
                Select Template
              </Typography>
            </MenuItem>
            {templates.map((template) => (
              <MenuItem key={template.id} value={template.id}>
                {template.name}
              </MenuItem>
            ))}
            {isFetchingNextPage && (
              <MenuItem disabled sx={{display: "flex", justifyContent: "center"}}>
                  <CircularProgress size={20} />
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </Box>

      {/* Header */}
      <Box sx={{ border: 1, padding: 2, borderRadius: "8px", borderColor: "#E8E8E8" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: theme.custom.textColor,
              fontWeight: 600,
              fontSize: "20px",
            }}
          >
            System Field
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mr: 30,
              p: 1,
              borderRadius: 1,
            }}
          >
            <FileIcon
              sx={{
                color: theme.custom.subTextColor,
                fontSize: 40,
                alignSelf: "flex-start",
              }}
            />
            <Typography variant="body2" sx={{ fontSize: 16, color: "black" }}>
              {fileName}
            </Typography>
          </Box>
        </Box>

        {islistTemplateHeadersPending ? 
            <Box sx={{ display: "flex", justifyContent: "center"}}>
              <CircularProgress />
            </Box> : 
            (<Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {Object.keys(systemFieldMapping).map((fieldName) => {
              const availableHeaders = getAvailableHeaders(fieldName);
              const currentValue = systemFieldMapping[fieldName] || "";
              const hasError = fieldErrors?.[fieldName];
              return (
                <Box
                  key={fieldName}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ minWidth: "120px", color: theme.custom.textColor }}
                  >
                    {fieldName}
                  </Typography>

                  <FormControl sx={{ minWidth: "400px" }} error={hasError}>
                    <Select
                      value={currentValue}
                      onChange={handleFieldChange(fieldName)}
                      displayEmpty
                    >
                      <MenuItem value="">
                        <Typography color="grey.500">
                          Select {fieldName}
                        </Typography>
                      </MenuItem>
                      {availableHeaders.map((column) => (
                        <MenuItem key={column} value={column}>
                          {column}
                        </MenuItem>
                      ))}
                    </Select>
                    {hasError && (
                      <Typography variant="caption" color="error">
                        This field is required
                      </Typography>
                    )}
                  </FormControl>
                </Box>
              );
            })}
          </Box>)}
        <Divider sx={{ mt: 2, mb: 1 }} />
      </Box>
    </Box>
  );
};

export default SystemFieldMapping;