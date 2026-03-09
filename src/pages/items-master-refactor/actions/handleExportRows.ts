import { useToastStore } from "@/store/useToastStore";
import { getErrorMessage } from "@/utils/error-helper";
import type { MutateOptions } from "@tanstack/react-query";
import type { ExportItemMasterRowPayload } from "../helper/types";
import { useItemMasterStore } from "../store/useItemMasterStore";

interface HandleItemMasterExportParams {
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
  itemMasterExportRowMutate,
  DownloadExportFile,
}: HandleItemMasterExportParams) => {
  const store = useItemMasterStore.getState();
  const showToast = useToastStore.getState().showToast;

  const {
    selectedExport,
    selectedRows,
    setSelectedRows,
    setSelectedExport,
    gridRef,
  } = store;

  if (!selectedExport && (!selectedRows || selectedRows.length === 0)) return;

  //   setLoading(true);

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
      showToast("Rows exported successfully!", "success");
      gridRef?.ClearSelection();
      setSelectedRows([]);
      //   setLoading(false);
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
          //   setLoading(false);
          showToast(getErrorMessage(error, "Failed to download file"), "error");
        },
      });
    },
    onError: (error) => {
      //   setLoading(false);
      showToast(getErrorMessage(error, "Failed to export rows"), "error");
    },
  });
};
