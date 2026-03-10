"use client";

import React, { useEffect, useState } from "react";
import DataMappingModal from "./data-mapping";
import FileUploadModal from "./file-upload";
import UploadSnackbar from "./toast";

import type { SystemFieldObject } from "@/pages/items-master-refactor/types/types";
import type {
  ControlFields,
  UploadedFile,
} from "../../constants/upload.constants";
import type { SnackbarState } from "../columns-dropdown";

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
  setSnackbar: React.Dispatch<React.SetStateAction<SnackbarState>>;
  isSearchReplaceRef: any;
};

const CompleteUploadFlow: React.FC<CompleteUploadFlowProps> = ({
  open,
  onClose,
  onImportComplete,
  onViewLog,
  setSnackbar,
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
        setSnackbar={setSnackbar}
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
        setSnackbar={setSnackbar}
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
