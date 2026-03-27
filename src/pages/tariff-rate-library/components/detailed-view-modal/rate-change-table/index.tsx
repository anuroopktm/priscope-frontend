import React from "react";
import { Box, Button, MenuItem, Select, Typography } from "@mui/material";
import { HotTable } from "@handsontable/react";
import "handsontable/styles/handsontable.css";
import "handsontable/styles/ht-theme-main.css";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import exportIcon from "@/assets/rate-libraries/export-data.svg";

interface RateChangeTableProps {
  rateChanges: {
    updatedCurrency: string;
    rate: string;
    updatedBy: string;
    updatedOn: string;
  }[];
  onExport?: () => void;
}

export const RateChangeTable: React.FC<RateChangeTableProps> = ({
  rateChanges,
  onExport,
}) => {
  const data = rateChanges.map((item) => [
    item.rate,
    item.updatedBy,
    item.updatedOn,
  ]);

  const hasData = rateChanges?.length > 0;

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: "white",
          borderBottom: "1px solid #e0e0e0",
          py: 1,
          mb: 1,
        }}
      >
        {/* Title */}
        <Typography sx={{ fontWeight: 600, fontSize: "14px", paddingY: "8px" }}>
          Rate Change
        </Typography>

        {/* Controls (hide if no data) */}
        {hasData && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: "120px",
              }}
            >
              <Typography sx={{ fontSize: "14px" }}>Last</Typography>
              <Select
                size="small"
                defaultValue={20}
                sx={{
                  fontSize: "14px",
                  height: "32px",
                  borderRadius: "8px",
                  paddingRight: "8px",
                }}
                IconComponent={() => <KeyboardArrowDownRoundedIcon />}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </Box>

            <Button
              variant="contained"
              onClick={onExport}
              sx={{
                backgroundColor: "#144a75",
                textTransform: "none",
                fontSize: "14px",
                borderRadius: "8px",
                px: 2,
                py: 1,
                "&:hover": {
                  backgroundColor: "#0f3655",
                },
              }}
              startIcon={
                <img src={exportIcon} alt="Export" width={16} height={16} />
              }
            >
              Export to Excel
            </Button>
          </Box>
        )}
      </Box>

      {/* Body */}
      <Box>
        {hasData ? (
          <HotTable
            data={data}
            colHeaders={["  Updated Rate", "Updated By", "Updated On"]}
            rowHeaders={false}
            dropdownMenu={true}
            stretchH="all"
            height={300}
            licenseKey="non-commercial-and-evaluation"
            className="ht-theme-main"
            readOnly={true}
          />
        ) : (
          <Box
            sx={{
              height: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "text.secondary",
              fontSize: "14px",
            }}
          >
            No rate change data available
          </Box>
        )}
      </Box>
    </Box>
  );
};
