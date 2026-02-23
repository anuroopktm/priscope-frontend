// import theme from "@/shared/styles/theme";
import { Close as CloseIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  DATA_MAPPING_STEPS,
  DEFAULT_ATTRIBUTE_CONFIGURATION,
  DEFAULT_SYSTEM_FIELD_MAPPING,
} from "@/pages/items-master/constants/data_mapping.constants";
import {
  createSystemFieldMapping,
  getAttributeConfigFromAvailableHeaders,
} from "../../../helpers/itemMasterHelpers";
import { useMapItemMasterFields } from "@/services/queries/item-master/item-master.queries";
import { useItemMasterStore } from "../../../store/itemMasterStore";
import type {
  AttributeConfigurationData,
  DataMappingModalProps,
  MapFieldsRequest,
  SystemFieldMappingData,
  SystemFieldObject,
} from "@/pages/items-master/types/types";
import StyledStepper from "../../stepper";
import AttributeConfiguration from "./attribute-config-step";
import SystemFieldMapping from "./system-field-step";
import { useQueryClient } from "@tanstack/react-query";
import ConfirmationDialog from "@/components/common/upload-modal/confirmation-modal";
import LoaderOverlay from "@/components/common/loader";
import type { SnackbarState } from "../../columns-dropdown";
import { theme } from "@/theme/theme";

interface DataMappingModalPropsExtended extends DataMappingModalProps {
  uploadId?: string;
  handleBack: () => void;
  systemFields: SystemFieldObject[] | null;
  csvType: string;
  setSnackbar: React.Dispatch<React.SetStateAction<SnackbarState>>;
  isSearchReplaceRef: any;
}

const DataMappingModal: React.FC<DataMappingModalPropsExtended> = ({
  open,
  onClose,
  fileName = "document_file_name.csv",
  uploadId,
  onImport,
  handleBack,
  systemFields,
  csvType,
  setSnackbar,
  isSearchReplaceRef,
}) => {
  const [activeStep, setActiveStep] = useState(2);
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [systemFieldMapping, setSystemFieldMapping] =
    useState<SystemFieldMappingData>(DEFAULT_SYSTEM_FIELD_MAPPING);
  const getAvailableHeaders = useItemMasterStore(
    (state) => state.getAvailableHeaders,
  );
  const [attributeConfiguration, setAttributeConfiguration] =
    useState<AttributeConfigurationData>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [showOverwriteModal, setShowOverwriteModal] = useState(false);

  // Get selected data from store and API mutation
  const selected = useItemMasterStore((state) => state.selected);
  const controlFields = useItemMasterStore((state) => state.controlFields);
  const uploadIdFromStore = useItemMasterStore((state) => state.uploadId);
  const resetStore = useItemMasterStore((state) => state.reset);
  const { mutate: mapFieldsMutation, isPending: isMapFieldsPending } =
    useMapItemMasterFields();
  const queryClient = useQueryClient();
  // Use upload ID from store first, fallback to prop
  const finalUploadId = uploadIdFromStore || uploadId;

  // Initialize systemFieldMapping with API data
  useEffect(() => {
    setSelectedTemplate("");
    if (systemFields && open) {
      const mapping = createSystemFieldMapping(systemFields);
      setSystemFieldMapping({
        ...mapping,
      });
    }
  }, [systemFields, open]);

  /**
   * Converts store data to API request format
   * @param uploadId - The upload ID from previous upload step
   * @param templateName - Optional template name (defaults to fileName)
   */
  const convertToApiFormat = (
    uploadIdParam: string,
    templateNameParam?: string,
    overwrite: boolean = false,
  ): MapFieldsRequest => {
    const control_fields: Record<string, string> = {};
    controlFields.forEach((item) => {
      if (item.value && item.value.trim() !== "") {
        control_fields[item.key] = item.value;
      }
    });

    const system_fields = Object.entries(systemFieldMapping)
      .filter(([_key, value]) => value && value.trim() !== "")
      .map(([fieldName, headerValue]) => {
        const matchingSystemField = systemFields?.find(
          (f) => f.name === fieldName,
        );
        return {
          label: fieldName,
          header: headerValue,
          data_type: matchingSystemField?.source_type,
        };
      });

    const attributes = Object.entries(attributeConfiguration).map(
      ([header, config]) => ({
        header,
        data_type: config.dataType || "string",
        is_mandatory: config.mandatory || false,
      }),
    );

    const payload: any = {
      is_template: saveAsTemplate,
      control_fields,
      system_fields,
      attributes,
      type: csvType,
    };

    if (saveAsTemplate) {
      payload.template_name =
        templateNameParam || templateName || fileName.replace(/\.[^/.]+$/, "");
    }

    console.log("Final API payload:", payload);
    return { payload, upload_id: uploadIdParam, update_if_exists: overwrite };
  };

  const handleSystemFieldChange = (
    field: keyof SystemFieldMappingData,
    value: string,
  ) => {
    setSystemFieldMapping((prev) => ({ ...prev, [field]: value }));
    const availableHeaders = getAvailableHeaders("");
    setAttributeConfiguration(() =>
      getAttributeConfigFromAvailableHeaders(availableHeaders),
    );
  };

  const handleAttributeConfigChange = (
    attribute: string,
    field: "dataType" | "mandatory",
    value: string | boolean,
  ) => {
    setAttributeConfiguration((prev) => ({
      ...prev,
      [attribute]: { ...prev[attribute], [field]: value },
    }));
  };

  const isSystemFieldMappingValid = () =>
    Object.values(systemFieldMapping).some((value) => value.trim() !== "");

  const resetFormState = () => {
    setActiveStep(2);
    setSaveAsTemplate(false);
    setTemplateName("");
    setSystemFieldMapping(DEFAULT_SYSTEM_FIELD_MAPPING);
    setAttributeConfiguration(DEFAULT_ATTRIBUTE_CONFIGURATION);
  };

  const handleContinue = () => {
    if (activeStep === 2) {
      if (systemFields == null) return;
      const missingRequired = systemFields
        .filter((f: any) => f.is_required)
        .filter(
          (f: any) =>
            !systemFieldMapping[f.name] ||
            systemFieldMapping[f.name].trim() === "",
        )
        .map((f: any) => f.name);

      if (missingRequired.length > 0) {
        const errorMap: Record<string, boolean> = {};
        missingRequired.forEach((name: string) => (errorMap[name] = true));
        setFieldErrors(errorMap);
        return;
      }

      setFieldErrors({});
      setActiveStep(3);
    }
  };

  const handleBackClick = () => {
    if (activeStep === 2) {
      handleBack();
    } else {
      setActiveStep((prev) => prev - 1);
    }
  };

  const handleImportClick = () => {
    setShowOverwriteModal(true);
  };
  const handleUpload = async (overwrite: boolean) => {
    try {
      if (!finalUploadId) {
        throw new Error("Upload ID is required but was not provided");
      }

      console.log("Using upload ID from store:", finalUploadId);

      const apiPayload = convertToApiFormat(
        finalUploadId,
        saveAsTemplate ? templateName : undefined,
        overwrite,
      );

      mapFieldsMutation(apiPayload, {
        onSuccess: () => {
          isSearchReplaceRef.current = true;
          queryClient.invalidateQueries({
            queryKey: ["listItems"],
            exact: false,
          });
          queryClient.invalidateQueries({
            queryKey: ["listItemMasterHeaders"],
            exact: false,
          });
          const importData = {
            systemFieldMapping,
            attributeConfiguration,
            saveAsTemplate,
          };
          onImport?.(importData);
          resetFormState();
          resetStore();
          onClose();
        },
        onError: (err) => {
          const message =
            err.status === 404 || err.status === 400
              ? "Failed to map fields"
              : "Failed to map fields";
          setSnackbar({ message, severity: "error" });
        },
      });
    } catch (error) {
      console.error("Failed to map fields:", error);
    }
  };

  const handleClose = () => {
    resetFormState();
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        // PaperProps={{ sx: { borderRadius: 12 } }}
      >
        <DialogTitle sx={{ py: 2, px: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <StyledStepper
              activeStep={activeStep}
              steps={Array.from(DATA_MAPPING_STEPS)}
            />
            <IconButton onClick={handleClose} size="small" sx={{ ml: 2 }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mt: 2 }} />
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 1 }}>
          {activeStep === 2 && (
            <SystemFieldMapping
              fileName={fileName}
              systemFieldMapping={systemFieldMapping}
              onSystemFieldChange={handleSystemFieldChange}
              saveAsTemplate={saveAsTemplate}
              onSaveAsTemplateChange={setSaveAsTemplate}
              templateName={templateName}
              onTemplateNameChange={setTemplateName}
              fieldErrors={fieldErrors}
              setSelectedTemplate={setSelectedTemplate}
              selectedTemplate={selectedTemplate}
              setSnackbar={setSnackbar}
            />
          )}
          {activeStep === 3 && (
            <AttributeConfiguration
              fileName={fileName}
              attributeConfiguration={attributeConfiguration}
              onAttributeConfigChange={handleAttributeConfigChange}
              saveAsTemplate={saveAsTemplate}
              onSaveAsTemplateChange={setSaveAsTemplate}
              templateName={templateName}
              onTemplateNameChange={setTemplateName}
              selectedTemplate={selectedTemplate}
            />
          )}
        </DialogContent>

        <DialogActions
          sx={{ px: 3, pb: 2, pt: 1, justifyContent: "space-between" }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              type="button"
              variant="outlined"
              onClick={handleBackClick}
              sx={{
                height: 40,
                borderRadius: 8,
                color: "#1A2B44",
                borderColor: "#1A2B44",
                bgcolor:"#FFFFFF",
                "&:hover": {
                  bgcolor: "#d2d2d2",
                  borderColor: "#1A2B44",
                },
              }}
            >
              Back
            </Button>

            {activeStep === 2 && (
              <Button
                type="button"
                variant="contained"
                onClick={handleContinue}
                disabled={!isSystemFieldMappingValid()}
                sx={{ height: 40, borderRadius: 8 }}
              >
                Continue
              </Button>
            )}

            {activeStep === 3 && (
              <Button
                type="submit"
                variant="contained"
                onClick={handleImportClick}
                disabled={isMapFieldsPending}
                sx={{ height: 40, borderRadius: 8 }}
              >
                {isMapFieldsPending ? "Importing..." : "Import to Item Master"}
              </Button>
            )}
          </Box>
        </DialogActions>
        <ConfirmationDialog
          open={showOverwriteModal}
          onClose={() => {
            setShowOverwriteModal(false);
            handleUpload(false);
          }}
          onConfirm={() => {
            setShowOverwriteModal(false);
            handleUpload(true);
          }}
          message="If duplicates exist, should they be overwritten?"
          confirmText="Yes"
          cancelText="No"
        />
      </Dialog>
      {isMapFieldsPending && <LoaderOverlay />}
    </>
  );
};

export default DataMappingModal;
