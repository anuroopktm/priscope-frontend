import { CircularProgress, Alert } from "@mui/material";
import React, { useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, Box } from "@mui/material";
import { DetailsModalHeader } from "./detail-modal-header";
import { RateChangeTable } from "./rate-change-table";
import {
  useFreightRateChanges,
  useFreightRateHistory,
} from "../../services/freightRateService";
import CustomTimeline from "./timeline";
import { useCreateExport } from "@/services/queries/common/common.queries";
import formatDate from "@/utils/formatDate";
import { handleExportRates } from "@/utils/exportUtils";

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rowData: (string | number)[];
  showToast: (message: string, severity: "success" | "error") => void;
  showLoader: (loading: boolean) => void;
}

export const DetailsModal: React.FC<DetailsModalProps> = ({
  isOpen,
  onClose,
  rowData,
  showToast,
  showLoader,
}) => {
  const { mutate: createExport, isPending: isExporting } = useCreateExport();
  const freightRateId = rowData?.[rowData.length - 2] as string;
  const {
    data: historyData,
    isLoading: loadingHistory,
    isError: errorHistory,
  } = useFreightRateHistory(freightRateId, {
    skip: 0,
    limit: 10,
    search: "",
  });

  const {
    data: rateChangesData,
    isLoading: loadingChanges,
    isError: errorChanges,
  } = useFreightRateChanges(freightRateId, { skip: 0, limit: 10 });

  // Loader & Error states
  const loading = loadingHistory || loadingChanges;
  const error = errorHistory || errorChanges;

  // Transform API data if success
  const rateChanges =
    rateChangesData?.freight_rate_changes?.map((item: any) => ({
      updatedCurrency: item.currency,
      rate: item.rate.toString(),
      updatedBy: item.changed_by?.name ?? "Unknown",
      updatedOn: formatDate(item.changed_at),
    })) ?? [];

  const timelineData =
    historyData?.freight_changes?.map((item: any) => {
      let actionType: "rate" | "validity" | "comment" | undefined;
      let action = "";
      let from = "";
      let to = "";

      if (item.updated_fields?.rate) {
        actionType = "rate";
        action = "rate";
        from = item.updated_fields.rate.old_value;
        to = item.updated_fields.rate.new_value;
      } else if (
        item.updated_fields?.valid_from ||
        item.updated_fields?.valid_to
      ) {
        actionType = "validity";
        action = "validity";
        from = item.updated_fields.valid_from?.old_value ?? "";
        to = item.updated_fields.valid_to?.new_value ?? "";
      } else if (item.comment) {
        actionType = "comment";
        action = "comment";
      }

      return {
        user: item.changed_by?.name ?? "Unknown",
        date: formatDate(item.changed_at),
        action,
        actionType,
        from,
        to,
        description: item.comment ?? undefined,
      };
    }) ?? [];

  useEffect(() => {
    if (isExporting) {
      showLoader(true);
    } else {
      showLoader(false);
    }
  }, [isExporting]);

  const handleExportFreightRateChanges = () => {
    const ids =
      rateChangesData?.freight_rate_changes?.map((row: any) => row.id) ?? [];

    handleExportRates({
      createExport,
      showToast,
      ids,
      moduleName: "freight_rate",
      featureName: "audit",
      fileType: "csv",
    });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth={false}
      PaperProps={{
        sx: {
          width: "100vw",
          height: "70vh",
          alignSelf: "start",
          mt: 17,
          borderRadius: 8,
          gap: "16px",
          p: "24px",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Header stays visible */}
      <DialogTitle sx={{ p: 0 }}>
        <DetailsModalHeader
          onClose={onClose}
          origin={rowData?.[0] as string}
          destination={rowData?.[1] as string}
          containerType={rowData?.[2] as string}
        />
      </DialogTitle>

      <DialogContent
        sx={{
          p: 0,
          flex: 1,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Show loader, error, or content */}
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error" sx={{ width: "100%" }}>
            Failed to load data. Please try again later.
          </Alert>
        ) : (
          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
            gap={2}
            sx={{ height: "100%", width: "100%" }}
          >
            {/* Rate Change Table */}
            <Box
              sx={{
                overflowY: "auto",
                height: "100%",
                border: "1px solid #e0e0e0",
                borderRadius: 8,
                p: 2,
                pt: 0,
                bgcolor: "white",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              <RateChangeTable
                rateChanges={rateChanges}
                onExport={handleExportFreightRateChanges}
              />
            </Box>

            {/* Timeline */}
            <Box
              sx={{
                overflowY: "auto",
                height: "100%",
                border: "1px solid #e0e0e0",
                borderRadius: 8,
                p: 2,
                pt: 0,
                bgcolor: "white",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              <CustomTimeline timelineData={timelineData} />
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
