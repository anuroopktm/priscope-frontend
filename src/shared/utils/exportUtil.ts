import { UseMutateFunction } from "@tanstack/react-query";
import { ExportRequest, ExportResponse } from "../types/exportServices.types";

interface ExportOptions {
  createExport: UseMutateFunction<ExportResponse, unknown, ExportRequest, unknown>;
  showSnackBar: (args: { message: string; severity: "success" | "error" }) => void;
  ids: string[];
  moduleName: string;
  featureName: string;
  fileType?: "csv" | "xlsx" | "pdf";
  filter?: Record<string, any>;
  options?: Record<string, any>;
}

export const handleExportRates = ({
  createExport,
  showSnackBar,
  ids,
  moduleName,
  featureName,
  fileType = "csv",
  filter = {},
  options = {},
}: ExportOptions) => {
  if (!ids || ids.length === 0) {
    showSnackBar({ message: "No rows available for export", severity: "error" });
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
      showSnackBar({
        message: `Export successful`,
        severity: "success",
      });
    },
    onError: () => {
      showSnackBar({
        message: "Export failed. Please try again.",
        severity: "error",
      });
    },
  });
};
