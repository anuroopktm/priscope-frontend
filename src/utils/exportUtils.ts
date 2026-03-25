import type { ExportRequest, ExportResponse } from "@/services/queries/common/types/exportServices.types";
import type { UseMutateFunction } from "@tanstack/react-query";

interface ExportOptions {
  createExport: UseMutateFunction<ExportResponse, unknown, ExportRequest, unknown>;
  showToast: (message: string, severity: "success" | "error") => void;
  ids: string[];
  moduleName: string;
  featureName: string;
  fileType?: "csv" | "xlsx" | "pdf";
  filter?: Record<string, any>;
  options?: Record<string, any>;
}

export const handleExportRates = ({
  createExport,
  showToast,
  ids,
  moduleName,
  featureName,
  fileType = "csv",
  filter = {},
  options = {},
}: ExportOptions) => {
  if (!ids || ids.length === 0) {
    showToast("No rows available for export", "error");
    return;
  }

  const payload: ExportRequest = {
    module_name: moduleName,
    feature_name: featureName,
    file_type: fileType,
    parameters: { ids, filter, options },
  };

  createExport(payload, {
    onSuccess: () => {
      showToast(`Export successful`, "success");
    },
    onError: () => {
      showToast("Export failed. Please try again.", "error");
    },
  });
};
