"use client";

import { SnackbarState } from "@/app/[lang]/(protected)/freight-rate-library/types";
import { FILE_FILTER_OPTIONS } from "@/shared/constants/file-modal.constants";
import { useProgressStore } from "@/shared/store/progress.store";
import { Alert, Snackbar } from "@mui/material";
import { useState } from "react";
import FileDetailsModal from "../file-detail-modal";
import LoaderOverlay from "../loader";
import ProgressCard from "./ProgressCard";

export default function ProgressPortal() {
  const events = useProgressStore((s) => s.events);
  const [showLoader, setShowLoader] = useState(false)
  const [snackbar, setSnackBar] = useState<SnackbarState>({
    message: null,
    severity: "info",
  })
  
  const [showFilesModal, setShowFilesModal] = useState<boolean>(false);
  const [module, setModule] = useState<string>("")
  const [activeTab, setActiveTab] = useState<"uploaded" | "downloaded">("uploaded");

  // if (!events.length) return null;
  
  function getFileFilterOptions(module: string) {
    return module === "fx_rate"
      ? FILE_FILTER_OPTIONS.filter((opt) => opt.value === "downloaded")
      : FILE_FILTER_OPTIONS;
  }
  const handleSnackBarClose = () => {
    setSnackBar({ severity: "info", message: null });
  };
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-3 z-[209]">
      {snackbar.message && (
        <Snackbar
          open
          autoHideDuration={6000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          onClose={handleSnackBarClose}
        >
          <Alert
            severity={snackbar.severity}
            sx={{ width: "100%" }}
            onClose={handleSnackBarClose}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      )}
      {events.map((event) => (
        // <Collapse key={event.upload_id}>
        <ProgressCard event={event} setShowFilesModal={setShowFilesModal} setModule={setModule} setActiveTab={setActiveTab} />
        //</Collapse> 
      ))}
      {showFilesModal && (
        <FileDetailsModal module={module} onClose={setShowFilesModal} filterOptions={getFileFilterOptions(module)} showLoader={setShowLoader} showSnackBar={setSnackBar} defaultTab={activeTab} />
      )}
      {showLoader && <LoaderOverlay />}
    </div>
  );
}
