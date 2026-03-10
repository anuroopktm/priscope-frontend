import { getErrorMessage } from "@/utils/error-helper";
import type { MutateOptions } from "@tanstack/react-query";
import type { ExportItemMasterRowPayload } from "../helpers/types";

interface HandleItemMasterExportParams {
  selectedExport: boolean;
  selectedRows: string[];
  setShowLoader: React.Dispatch<React.SetStateAction<boolean>>;
  showToast: (
    message: string,
    type?: "success" | "error" | "warning" | "info",
  ) => void;
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedExport: React.Dispatch<React.SetStateAction<boolean>>;
  gridInstance: React.MutableRefObject<TGrid | null>;
  itemMasterExportRowMutate: (
    payload: ExportItemMasterRowPayload,
    options?: MutateOptions<any, any, ExportItemMasterRowPayload>,
  ) => void;

  DownloadExportFile: (
    exportId: string,
    options?: MutateOptions<any, any, string>,
  ) => void;
}
export const handleItemMasterExport = ({
  selectedExport,
  selectedRows,
  setShowLoader,
  showToast,
  gridInstance,
  setSelectedRows,
  setSelectedExport,
  itemMasterExportRowMutate,
  DownloadExportFile,
}: HandleItemMasterExportParams) => {
  if (!selectedExport && (!selectedRows || selectedRows.length === 0)) return;
  setShowLoader(true);
  const payload: ExportItemMasterRowPayload = {
    module_name: "item_master",
    feature_name: "main",
    file_type: "csv",
    parameters: {
      ids: selectedExport ? ["all"] : selectedRows,
      filter: {},
      options: {},
    },
  };
  itemMasterExportRowMutate(payload, {
    onSuccess: (response) => {
      setShowLoader(false);
      showToast("Rows exported successfully!", "success");
      gridInstance?.current?.ClearSelection();
      setSelectedRows([]);
      setSelectedExport(false);
      DownloadExportFile(response?.export_id, {
        onSuccess: (res) => {
          if (res?.download_url) {
            const link = document.createElement("a");
            link.href = res.download_url;
            link.setAttribute("download", "export_file.csv");
            document.body.appendChild(link);
            link.click();
            link.remove();
          }
        },
        onError: (error) => {
          showToast(getErrorMessage(error, "Failed to download file"), "error");
        },
      });
    },
    onError: (error) => {
      setShowLoader(false);
      showToast(getErrorMessage(error, "Failed to export rows"), "error");
    },
  });
};
