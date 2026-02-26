import { Close as CloseIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import React, { useMemo, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  CSV_TYPE_OPTIONS,
  UPLOAD_STEPS,
} from "../../constants/upload.constants";
import AttributeConfigStep, {
  type AttributeConfigStepRef,
} from "./steps/AttributeConfigStep";
import SetControlFieldStep, {
  type SetControlFieldStepRef,
} from "./steps/SetControlFieldStep";
import SystemFieldMappingStep from "./steps/SystemFieldMappingStep";
import UploadFileStep from "./steps/UploadFileStep";
import type { ItemsMasterUploadModalProps, UploadFormValues } from "./types";

const UploadFileModal: React.FC<ItemsMasterUploadModalProps> = ({
  open,
  onClose,
  onImportComplete,
}) => {
  const step1Ref = useRef<SetControlFieldStepRef>(null);
  const step3Ref = useRef<AttributeConfigStepRef>(null);

  const methods = useForm<UploadFormValues>({
    defaultValues: {
      activeStep: 0,
      headers: [],
      systemFields: [],
      file: null,
      uploadId: "",
      csvType: "item",
      controlFields: { item: "", supplier: "", customer: "" },
      systemFieldMapping: {},
      attributeConfiguration: {},
      saveAsTemplate: false,
      templateName: "",
      selectedTemplate: "",
    },
  });

  const { watch, setValue, reset } = methods;
  const { activeStep, headers } = watch();

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleNext = () => {
    if (activeStep === 1) {
      step1Ref.current?.handleNext();
    } else if (activeStep === 2) {
      // Step 3 to 4: Initialize Attribute Config
      const formValues = watch();
      const mappedHeaderNames = Object.values(formValues.systemFieldMapping);
      const attributes = headers.filter((h) => !mappedHeaderNames.includes(h));

      const initialAttrConfig: Record<
        string,
        { dataType: string; mandatory: boolean }
      > = {};
      attributes.forEach((attr) => {
        initialAttrConfig[attr] = { dataType: "Text", mandatory: false };
      });
      setValue("attributeConfiguration", initialAttrConfig);
      setValue("activeStep", 3);
    } else {
      setValue("activeStep", activeStep + 1);
    }
  };

  const handleBack = () => setValue("activeStep", activeStep - 1);

  const isNextDisabled = useMemo(() => {
    const val = watch();
    if (activeStep === 0) return !val.file || !val.uploadId;
    if (activeStep === 1) {
      const currentFields =
        CSV_TYPE_OPTIONS.find((opt) => opt.value === val.csvType)?.fields || [];
      return !currentFields.every((f) => !!val.controlFields[f]);
    }
    if (activeStep === 2) {
      return Object.values(val.systemFieldMapping).some((v) => v === "");
    }
    return false;
  }, [activeStep, watch()]);

  const isPending = step1Ref.current?.isPending || step3Ref.current?.isPending;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ py: 2, px: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Stepper activeStep={activeStep} sx={{ flexGrow: 1 }}>
            {UPLOAD_STEPS.map((label: string) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <IconButton onClick={handleClose} size="small" sx={{ ml: 2 }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider sx={{ borderColor: "#D2D2D2" }} />

      <DialogContent sx={{ px: 3, py: 1 }}>
        <FormProvider {...methods}>
          {activeStep === 0 && (
            <UploadFileStep onHeadersFetched={(h) => setValue("headers", h)} />
          )}
          {activeStep === 1 && <SetControlFieldStep ref={step1Ref} />}
          {activeStep === 2 && <SystemFieldMappingStep />}
          {activeStep === 3 && (
            <AttributeConfigStep
              ref={step3Ref}
              onImportComplete={onImportComplete}
              handleClose={handleClose}
            />
          )}
        </FormProvider>
      </DialogContent>

      <DialogActions
        sx={{ px: 3, pb: 2, pt: 1, justifyContent: "flex-start", gap: 1 }}
      >
        {activeStep === 0 ? (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={isNextDisabled || isPending}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              bgcolor: (theme) =>
                theme.palette.brand?.divider || "primary.main",
              "&:hover": {
                bgcolor: (theme) =>
                  theme.palette.brand?.divider || "primary.dark",
              },
            }}
          >
            Upload
          </Button>
        ) : (
          <>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={isPending}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                color: (theme) =>
                  theme.palette.brand?.divider || "primary.main",
                borderColor: (theme) =>
                  theme.palette.brand?.divider || "primary.main",
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={
                activeStep < 3
                  ? handleNext
                  : () => step3Ref.current?.handleImport()
              }
              disabled={(activeStep < 3 && isNextDisabled) || isPending}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                bgcolor: (theme) =>
                  theme.palette.brand?.divider || "primary.main",
                "&:hover": {
                  bgcolor: (theme) =>
                    theme.palette.brand?.divider || "primary.dark",
                },
              }}
            >
              {isPending ? (
                <CircularProgress size={20} color="inherit" />
              ) : activeStep < 3 ? (
                "Map Data"
              ) : (
                "Import to Item Master"
              )}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default UploadFileModal;
