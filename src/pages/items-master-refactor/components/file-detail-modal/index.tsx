import { mapExports } from "@/constants/file-modal-helpers";
import {
  useGetExportedFile,
  useGetModuleImportErrorFile,
  useListExport,
  useListModuleImports,
} from "@/services/queries/common/common.queries";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import UploadedTab from "./components/UploadedTab";
import DownloadedTab from "./components/DownloadedTab";
import { transformUploads } from "../../filesTransformUploads";
import type { ExportedFile } from "../../types/types";

export interface FileDetailsModalProps {
  open?: boolean;
  onClose: any;
  showToast: any;
  showLoader?: any;
  module: string;
  filterOptions: { value: string; label: string }[];
  defaultTab?: "uploaded" | "downloaded";
}
const FileDetailsModal: React.FC<FileDetailsModalProps> = ({
  open,
  onClose,
  showLoader,
  showToast,
  module,
  filterOptions,
  defaultTab = "uploaded",
}) => {
  const [alignment, setAlignment] = useState(defaultTab);
  const isUploaded = alignment === "uploaded";
  const isDownloaded = alignment === "downloaded";
  const [exportedData, setExportedData] = useState<ExportedFile[]>([]);

  const {
    data: uploads,
    isPending: isUploadsLoading,
    isError: isUploadsError,
  } = useListModuleImports(module, {
    enabled: open && alignment === "uploaded",
  });

  const {
    mutate: listExports,
    isPending: isExportsLoading,
    isError: isExportsError,
  } = useListExport();

  const { mutate: downloadExportFile, isPending: isDownloadPending } =
    useGetExportedFile();

  const { mutate: downloadErrorFile, isPending: isErrorFilePending } =
    useGetModuleImportErrorFile();

  const isDownloading = isDownloadPending || isErrorFilePending;

  useEffect(() => {
    showLoader?.(isDownloading);
  }, [isDownloading]);

  useEffect(() => {
    if (open && isDownloaded) {
      listExports(
        { modules: [module] },
        {
          onSuccess: (res) => {
            const data = mapExports(res);
            setExportedData(data);
          },
          onError: () => {
            showToast({
              message: "Failed to fetch exported files",
              severity: "error",
            });
          },
        },
      );
    }
  }, [open, isDownloaded, module, listExports]);

  const uploadData = useMemo(() => transformUploads(uploads), [uploads]);

  if (!open) return null;

  return (
    <>
      <Dialog
        open={open}
        onClose={() => onClose(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            height: "75vh",
            maxWidth: "771px",
            borderRadius: 1,
          },
        }}
      >
        <DialogTitle>
          <Header
            alignment={alignment}
            setAlignment={setAlignment}
            filterOptions={filterOptions}
            onClose={() => onClose(false)}
          />
        </DialogTitle>

        <DialogContent sx={{ overflow: "auto", p: 0 }}>
          {isUploaded && (
            <UploadedTab
              data={uploadData}
              loading={isUploadsLoading}
              error={isUploadsError}
              module={module}
              onDownloadError={downloadErrorFile}
            />
          )}

          {isDownloaded && (
            <DownloadedTab
              data={exportedData}
              loading={isExportsLoading}
              error={isExportsError}
              onDownload={(id) =>
                downloadExportFile(id, {
                  onSuccess: (res) => {
                    if (res?.download_url) {
                      const link = document.createElement("a");
                      link.href = res.download_url;
                      link.click();
                    }
                  },
                  onError: () =>
                    showToast({
                      message: "Failed to download file",
                      severity: "error",
                    }),
                })
              }
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
export default FileDetailsModal;
