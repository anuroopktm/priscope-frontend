import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Divider,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import FileUploadStep from "./upload-step";
import CsvTypeSelection from "./csv-type-step";
import StyledStepper from "../../stepper";
import {
  type UploadedFile,
  type ControlFields,
  CSV_TYPE_OPTIONS,
  UPLOAD_STEPS,
} from "@/pages/items-master/constants/upload.constants";
import {
  useListSystemFields,
  useUploadItemMasterFile,
} from "@/services/queries/item-master/item-master.queries";
import { useItemMasterStore } from "../../../store/itemMasterStore";
import type { SystemFieldObject } from "@/pages/items-master/types/types";
import type { SnackbarState } from "../../columns-dropdown";
// import AppSnackbar from "@/shared/components/action-bar/AppSnackbar";
// import { SnackbarState } from "@/app/[lang]/(protected)/freight-rate-library/types";

type FileUploadModalProps = {
  open: boolean;
  onClose: () => void;
  onContinueToMapping?: (data: {
    file: UploadedFile | null;
    csvType: string;
    controlFields: ControlFields;
    headers: string[]; // Add headers to the callback
  }) => void;
  setSystemFields: React.Dispatch<
    React.SetStateAction<SystemFieldObject[] | null>
  >;
  csvType: string;
  setCsvType: React.Dispatch<React.SetStateAction<string>>;
  setSnackbar: React.Dispatch<React.SetStateAction<SnackbarState>>;
};

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
  const [fileStatus, setFileStatus] = useState<"loading" | "complete" | "">("");
  const [controlFields, setControlFields] = useState<ControlFields>({
    item: "",
    supplier: "",
    customer: "",
  });
  const [headers, setHeaders] = useState<string[]>([]); // New state for headers
  const {
    mutate: listSystemFieldsMutation,
    isPending: isPendingListSystemFields,
  } = useListSystemFields();
  const { mutate: uploadMutation, isPending: isPendingUpload } =
    useUploadItemMasterFile();
  const setUploadId = useItemMasterStore((s) => s.setUploadId);
  const handleFileUpload = (file: UploadedFile) => {
    setUploadedFile(file);
  };

  const handleFileRemove = () => {
    setUploadedFile(null);
    setHeaders([]); // Clear headers when file is removed
  };

  const handleFileStatusChange = (status: "loading" | "complete" | "") => {
    setFileStatus(status);
  };

  const handleHeadersFetched = (headers: string[]) => {
    setHeaders(headers);
  };

  const handleContinue = () => {
    if (!uploadedFile || !uploadedFile.file) return;
    uploadMutation(
      { file: uploadedFile.file },
      {
        onSuccess: (data) => {
          if (data.upload_id) {
            setUploadId(data.upload_id);
          }
          if (fileStatus === "complete" && activeStep === 0) {
            setActiveStep(1);
          }
        },
        onError: (err) => {
          handleFileStatusChange("");
        },
      },
    );
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
      headers, // Include headers in the data
    };

    const listSystemFieldsPayload = {
      type: csvType,
      search: "",
      page_size: 100,
      skip: 0,
    };

    listSystemFieldsMutation(listSystemFieldsPayload, {
      onSuccess: (res) => {
        setSystemFields(res.data);
        if (onContinueToMapping) {
          onContinueToMapping(uploadData);
        }
        setCsvType("item");
      },
      onError: (err) => {
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
    setHeaders([]); // Reset headers
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
            <StyledStepper activeStep={activeStep} steps={UPLOAD_STEPS} />
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
              fileStatus={fileStatus}
              onFileUpload={handleFileUpload}
              onFileRemove={handleFileRemove}
              onStatusChange={handleFileStatusChange}
              onHeadersFetched={handleHeadersFetched} // Pass the new callback
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
                  color: (theme) => theme.palette.primary.main,
                  borderColor: (theme) => theme.palette.brand.buttonBg,
                  "&:hover": {
                    bgcolor: (theme) => theme.palette.brand.userSubText,
                    borderColor: (theme) => theme.palette.brand.buttonBg,
                  },
                }}
              >
                Back
              </Button>
            )}
            {activeStep === 0 && (
              <Button
                type="button"
                variant="contained"
                onClick={handleContinue}
                disabled={fileStatus !== "complete" || headers.length === 0}
                sx={{ height: 40 }}
                loading={isPendingUpload}
              >
                Continue
              </Button>
            )}

            {activeStep === 1 && (
              <Button
                type="button"
                variant="contained"
                onClick={handleContinueToMapping}
                disabled={isContinueToMappingDisabled()}
                loading={isPendingListSystemFields}
                sx={{ height: 40 }}
              >
                Continue
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FileUploadModal;
