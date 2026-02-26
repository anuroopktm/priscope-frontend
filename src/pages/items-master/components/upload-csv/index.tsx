"use client";

import React, { useState, useEffect } from "react";
import FileUploadModal from "./file-upload";
import DataMappingModal from "./data-mapping";
import UploadSnackbar from "./toast";

import type {
  UploadedFile,
  ControlFields,
} from "../../constants/upload.constants";
import type { SystemFieldObject } from "@/pages/items-master/types/types";
import type { ToastSeverity } from "@/store/useToastStore";

type ImportData = {
  systemFieldMapping: any;
  attributeConfiguration: any;
  saveAsTemplate: boolean;
};

type CompleteUploadFlowProps = {
  open: boolean;
  onClose: () => void;
  onImportComplete?: (data: ImportData) => void;
  onViewLog?: () => void;
  showToast: (message: string, severity?: ToastSeverity) => void;
  isSearchReplaceRef: any;
};

const CompleteUploadFlow: React.FC<CompleteUploadFlowProps> = ({
  open,
  onClose,
  onImportComplete,
  onViewLog,
  showToast,
  isSearchReplaceRef,
}) => {
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showDataMapping, setShowDataMapping] = useState(false);
  const [systemFields, setSystemFields] = useState<SystemFieldObject[] | null>(
    null,
  );
  const [uploadData, setUploadData] = useState<{
    file: UploadedFile | null;
    csvType: string;
    controlFields: ControlFields;
    uploadId?: string;
  } | null>(null);

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [csvType, setCsvType] = useState("item");
  useEffect(() => {
    if (open) {
      setShowFileUpload(true);
    }
  }, [open]);

  const handleContinueToMapping = (data: {
    file: UploadedFile | null;
    csvType: string;
    controlFields: ControlFields;
    uploadId?: string;
  }) => {
    setUploadData(data);
    setShowFileUpload(false);
    setShowDataMapping(true);
  };

  const handleBackToMapping = () => {
    setShowFileUpload(true);
    handleDataMappingClose();
  };

  const handleImport = (data: ImportData) => {
    console.log("Import process completed successfully:", data);
    setShowDataMapping(false);
    setShowSnackbar(true);
    onImportComplete?.(data);
  };

  const handleFileUploadClose = () => {
    setShowFileUpload(false);
    onClose();
  };

  const handleDataMappingClose = () => {
    setShowDataMapping(false);
    onClose();
  };

  const handleViewLog = () => {
    setShowSnackbar(false);
    onViewLog?.();
  };

  return (
    <>
      <FileUploadModal
        open={showFileUpload}
        onClose={handleFileUploadClose}
        onContinueToMapping={handleContinueToMapping}
        setSystemFields={setSystemFields}
        csvType={csvType}
        setCsvType={setCsvType}
        showToast={showToast}
      />

      <DataMappingModal
        open={showDataMapping}
        onClose={handleDataMappingClose}
        fileName={uploadData?.file?.name || "document_file_name.csv"}
        uploadId={uploadData?.uploadId}
        onImport={handleImport}
        handleBack={handleBackToMapping}
        systemFields={systemFields}
        csvType={csvType}
        showToast={showToast}
        isSearchReplaceRef={isSearchReplaceRef}
      />

      {/* External UploadSnackbar */}
      <UploadSnackbar
        open={showSnackbar}
        onClose={() => setShowSnackbar(false)}
        onMapData={handleViewLog}
      />
    </>
  );
};

export default CompleteUploadFlow;
