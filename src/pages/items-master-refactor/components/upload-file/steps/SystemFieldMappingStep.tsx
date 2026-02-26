import {
  useListTemplateHeaders,
  useListTemplates,
} from "@/services/queries/item-master-refactor/item-master-refactor.queries";
import { InsertDriveFile as FileIconFilled } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { UploadFormValues } from "../types";

const SystemFieldMappingStep = () => {
  const { control, setValue } = useFormContext<UploadFormValues>();
  const mapping = useWatch({ control, name: "systemFieldMapping" });
  const selectedTemplate = useWatch({ control, name: "selectedTemplate" });
  const file = useWatch({ control, name: "file" });
  const headers = useWatch({ control, name: "headers" });
  const systemFields = useWatch({ control, name: "systemFields" });

  const {
    data: templatesData,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useListTemplates();
  const { mutate: listTemplateHeaders, isPending } = useListTemplateHeaders();

  const handleTemplateSelect = (templateId: string) => {
    setValue("selectedTemplate", templateId);
    listTemplateHeaders(
      {
        template_id: templateId,
        payload: { search: "", page_size: 100, skip: 0 },
      },
      {
        onSuccess: (res: any) => {
          const newMapping = { ...mapping };
          res.headers.forEach((h: any) => {
            if (
              newMapping.hasOwnProperty(h.label) &&
              headers.includes(h.name)
            ) {
              newMapping[h.label] = h.name;
            }
          });
          setValue("systemFieldMapping", newMapping);
        },
      },
    );
  };

  const templates = templatesData?.pages.flatMap((p) => p.templates) || [];

  return (
    <Box sx={{ mt: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">System Field Configuration</Typography>
        <FormControl sx={{ minWidth: 200 }} size="small">
          <Select
            value={selectedTemplate}
            onChange={(e) => handleTemplateSelect(e.target.value)}
            displayEmpty
            MenuProps={{
              PaperProps: {
                style: { maxHeight: 200 },
                onScroll: (event: React.UIEvent<HTMLDivElement>) => {
                  const bottom =
                    event.currentTarget.scrollHeight -
                      event.currentTarget.scrollTop ===
                    event.currentTarget.clientHeight;

                  if (bottom && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                  }
                },
              },
            }}
          >
            <MenuItem value="">Select Template</MenuItem>
            {templates.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {t.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ border: "1px solid #eee", p: 2, borderRadius: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            System Field
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FileIconFilled color="disabled" />
            <Typography variant="body2">{file?.name}</Typography>
          </Box>
        </Box>

        {isPending ? (
          <CircularProgress sx={{ display: "block", mx: "auto" }} />
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {systemFields.map((field) => (
              <Box
                key={field.name}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body2" sx={{ minWidth: 120 }}>
                  {field.label}
                </Typography>
                <FormControl sx={{ minWidth: 300 }} size="small">
                  <Select
                    value={mapping[field.name] || ""}
                    onChange={(e) =>
                      setValue(
                        `systemFieldMapping.${field.name}`,
                        e.target.value,
                      )
                    }
                    displayEmpty
                  >
                    <MenuItem value="">Select {field.label}</MenuItem>
                    {headers.map((h) => (
                      <MenuItem key={h} value={h}>
                        {h}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SystemFieldMappingStep;
