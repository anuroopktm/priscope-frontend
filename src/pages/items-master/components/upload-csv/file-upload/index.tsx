import {
  type ControlFields,
  CSV_TYPE_OPTIONS,
  UPLOAD_STEPS,
  type UploadedFile,
} from "@/pages/items-master/constants/upload.constants";
import type { SystemFieldObject } from "@/pages/items-master/types/types";
import {
  useListSystemFields,
  useUploadItemMasterFile,
} from "@/services/queries/item-master/item-master.queries";
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
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import React, { useState } from "react";
import type { SnackbarState } from "../../columns-dropdown";
import CsvTypeSelection from "./csv-type-step";
import FileUploadStep from "./upload-step";

interface FileUploadModalProps {
  open: boolean;
  onClose: () => void;
  onContinueToMapping?: (uploadData: any) => void;
  setSystemFields: React.Dispatch<
    React.SetStateAction<SystemFieldObject[] | null>
  >;
  csvType: string;
  setCsvType: React.Dispatch<React.SetStateAction<string>>;
  setSnackbar: React.Dispatch<React.SetStateAction<SnackbarState>>;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({
  open,
  onClose,
  onContinueToMapping,
  setSystemFields,
  csvType,
  setCsvType,
  setSnackbar,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [fileStatus, setFileStatus] = useState<string>("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [controlFields, setControlFields] = useState<ControlFields>({
    item: "",
    supplier: "",
    customer: "",
  });

  const {
    mutate: listSystemFieldsMutation,
    isPending: isPendingListSystemFields,
  } = useListSystemFields();

  const { mutate: uploadFileMutation, isPending: isPendingUpload } =
    useUploadItemMasterFile();

  const handleFileUpload = (uploadedFileData: UploadedFile) => {
    setUploadedFile(uploadedFileData);
    setFileStatus("uploading");

    uploadFileMutation(
      { file: uploadedFileData.file },
      {
        onSuccess: () => {
          setFileStatus("success");
        },
        onError: (err) => {
          setFileStatus("error");
          setSnackbar({
            message: err.message || "Upload failed",
            severity: "error",
          });
        },
      },
    );
  };

  const handleFileRemove = () => {
    setUploadedFile(null);
    setFileStatus("");
    setHeaders([]);
  };

  const handleFileStatusChange = (status: string) => {
    setFileStatus(status);
  };

  const handleHeadersFetched = (fetchedHeaders: string[]) => {
    setHeaders(fetchedHeaders);
  };

  const handleCsvTypeChange = (value: string) => {
    setCsvType(value);
    setControlFields({ item: "", supplier: "", customer: "" });
  };

  const handleControlFieldChange = (
    field: keyof ControlFields,
    value: string,
  ) => {
    setControlFields((prev) => ({ ...prev, [field]: value }));
  };

  const getCurrentFields = (): string[] => {
    return (
      CSV_TYPE_OPTIONS.find((type) => type.value === csvType)?.fields || []
    );
  };

  const isContinueToMappingDisabled = (): boolean => {
    const requiredFields = getCurrentFields();
    return !requiredFields.every(
      (field) => controlFields[field as keyof ControlFields],
    );
  };

  const handleContinueToMapping = () => {
    const uploadData = {
      file: uploadedFile,
      csvType,
      controlFields,
      headers,
    };

    const listSystemFieldsPayload = {
      template_type: csvType,
      type: "item+supplier+customer",
      control_fields: Object.keys(controlFields).reduce(
        (acc, key) => {
          const val = controlFields[key as keyof ControlFields];
          if (val) acc[key] = val;
          return acc;
        },
        {} as Record<string, string>,
      ),
    };

    listSystemFieldsMutation(listSystemFieldsPayload, {
      onSuccess: (res) => {
        setSystemFields(res.data);
        if (onContinueToMapping) {
          onContinueToMapping(uploadData);
        }
        setCsvType("item");
      },
      onError: (err: any) => {
        const message =
          err.status === 404
            ? "Failed to fetch system fields"
            : "Failed to fetch system fields";
        setSnackbar({ message, severity: "error" });
      },
    });
  };

  const resetFormState = () => {
    setActiveStep(0);
    setUploadedFile(null);
    setFileStatus("");
    setCsvType("item");
    setControlFields({ item: "", supplier: "", customer: "" });
    setHeaders([]);
  };

  const handleClose = () => {
    resetFormState();
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            py: 2,
            px: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Stepper activeStep={activeStep}>
              {UPLOAD_STEPS.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <IconButton onClick={handleClose} size="small" sx={{ ml: 2 }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mt: 2 }} />
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 1 }}>
          {activeStep === 0 && (
            <FileUploadStep
              uploadedFile={uploadedFile}
              fileStatus={fileStatus as any}
              onFileUpload={handleFileUpload}
              onFileRemove={handleFileRemove}
              onStatusChange={handleFileStatusChange}
              onHeadersFetched={handleHeadersFetched}
              isUploadPending={isPendingUpload}
            />
          )}

          {activeStep === 1 && (
            <CsvTypeSelection
              csvType={csvType}
              controlFields={controlFields}
              onCsvTypeChange={handleCsvTypeChange}
              onControlFieldChange={handleControlFieldChange}
            />
          )}
        </DialogContent>
        <Divider
          variant="middle"
          sx={{ marginX: 3, marginTop: 1, marginBottom: 3, height: 1 }}
        />
        <DialogActions
          sx={{
            px: 3,
            pb: 2,
            pt: 1,
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            {activeStep === 1 && (
              <Button
                type="button"
                variant="outlined"
                onClick={() => setActiveStep((prev) => prev - 1)}
                disabled={isPendingListSystemFields}
                sx={{
                  height: 40,
                  bgcolor: "#fff",
                  color: (theme) => theme.palette.brand.divider,
                  borderColor: (theme) => theme.palette.brand.divider,
                  borderRadius: "8px",
                  "&:hover": {
                    bgcolor: (theme) => theme.palette.brand.hover,
                    borderColor: (theme) => theme.palette.brand.divider,
                  },
                }}
              >
                Back
              </Button>
            )}
            <Button
              type="button"
              variant="outlined"
              onClick={handleClose}
              sx={{
                height: 40,
                bgcolor: "#fff",
                color: (theme) => theme.palette.brand.divider,
                borderColor: (theme) => theme.palette.brand.divider,
                borderRadius: "8px",
                "&:hover": {
                  bgcolor: (theme) => theme.palette.brand.hover,
                  borderColor: (theme) => theme.palette.brand.divider,
                },
              }}
            >
              Cancel
            </Button>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            {activeStep === 0 && (
              <Button
                variant="contained"
                onClick={() => setActiveStep((prev) => prev + 1)}
                disabled={fileStatus !== "success"}
                sx={{
                  height: 40,
                  bgcolor: (theme) => theme.palette.brand.divider,
                  color: "#fff",
                  borderRadius: "8px",
                  "&:hover": {
                    bgcolor: (theme) => theme.palette.brand.divider,
                  },
                }}
              >
                Continue
              </Button>
            )}
            {activeStep === 1 && (
              <Button
                variant="contained"
                onClick={handleContinueToMapping}
                disabled={
                  isContinueToMappingDisabled() || isPendingListSystemFields
                }
                sx={{
                  height: 40,
                  bgcolor: (theme) => theme.palette.brand.divider,
                  color: "#fff",
                  borderRadius: "8px",
                  "&:hover": {
                    bgcolor: (theme) => theme.palette.brand.divider,
                  },
                }}
              >
                {isPendingListSystemFields
                  ? "Loading..."
                  : "Continue to Mapping"}
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FileUploadModal;
