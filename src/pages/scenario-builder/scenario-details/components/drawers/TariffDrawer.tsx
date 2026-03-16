import SearchTextField from "@/components/common/SearchTextField";
import { useSearchTariffRates } from "@/services/queries/tariff/tariff.queries";
import type { TariffRate } from "@/services/queries/tariff/tariff.types";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { TariffLibraryLayout } from "../../tree-grid/config/tariff-library-layout";
import { useTreeGridInit } from "../../tree-grid/hooks/useTreeGridInit";
import DrawerHeader from "../items-master-drawer/components/DrawerHeader";

interface TariffDrawerProps {
  onClose: () => void;
  onSelect: (items: any[]) => void;
}

const tariffGridId = "TariffLibraryGrid";
const tariffGridContainerId = "TreeGrid_" + tariffGridId;

const TariffGrid = ({ data }: { data: any }) => {
  useTreeGridInit(
    tariffGridId,
    tariffGridContainerId,
    TariffLibraryLayout,
    data,
  );
  return (
    <Box id={tariffGridContainerId} sx={{ height: "100%", width: "100%" }} />
  );
};

const TariffDrawer = ({ onClose, onSelect }: TariffDrawerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: tariffRatesData, isLoading } = useSearchTariffRates({
    search: searchTerm,
  });
  const [localRows, setLocalRows] = useState<any[]>([]);

  const handleAddNewRow = () => {
    const grid = (window as any).Grids?.[tariffGridId];
    let updatedLocalRows = [...localRows];

    if (grid) {
      // Read current state from grid rows to capture any manual edits for local rows
      updatedLocalRows = updatedLocalRows.map((row) => {
        const r = grid.GetRowById(row.id);
        if (r) {
          return {
            ...row,
            country_of_origin:
              r.country_of_origin !== undefined
                ? r.country_of_origin
                : row.country_of_origin,
            country_of_destination:
              r.country_of_destination !== undefined
                ? r.country_of_destination
                : row.country_of_destination,
            hs_code: r.hs_code !== undefined ? r.hs_code : row.hs_code,
            rate: r.rate !== undefined ? r.rate : row.rate,
          };
        }
        return row;
      });
    }

    setLocalRows([
      {
        id: `local_${Date.now()}`,
        country_of_origin: "",
        country_of_destination: "",
        hs_code: "",
        rate: 0,
      },
      ...updatedLocalRows,
    ]);
  };

  const renderActionCell = (id: string) => {
    return `
            <div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">
                <button 
                    onclick="window.handleSelectTariffRow && window.handleSelectTariffRow('${id}')"
                    style="background: #E0F2FE; border: 1px solid #BAE6FD; border-radius: 4px; color: #0369A1; font-size: 11px; font-weight: 500; cursor: pointer; padding: 2px 8px; width: 60px; height: 24px;"
                >
                    Select
                </button>
            </div>
        `;
  };

  const gridData = {
    Body: [
      [
        ...localRows.map((row) => ({
          id: row.id,
          country_of_origin: row.country_of_origin,
          country_of_destination: row.country_of_destination,
          hs_code: row.hs_code,
          rate: row.rate,
          actions: renderActionCell(row.id),
        })),
        ...(tariffRatesData?.tariff_rates?.map((rate: TariffRate) => ({
          id: rate.id,
          country_of_origin: rate.country_of_origin,
          country_of_destination: rate.country_of_destination,
          hs_code: rate.hs_code,
          rate: rate.rate,
          actions: renderActionCell(rate.id),
          CanEdit: 0,
        })) || []),
      ],
    ],
  };

  // Global handler for row selection
  useEffect(() => {
    (window as any).handleSelectTariffRow = (rowId: string) => {
      const grid = (window as any).Grids?.[tariffGridId];
      if (grid) {
        const row = grid.GetRowById(rowId);
        if (row) {
          onSelect([
            {
              id: rowId,
              name: `Tariff (${row.hs_code || ""})`,
              cost: Number(row.rate) || 0,
              currency: "USD",
              source: rowId.startsWith("local_") ? "Manual" : "Tariff API",
            },
          ]);
          onClose();
        }
      }
    };
    return () => {
      delete (window as any).handleSelectTariffRow;
    };
  }, [onSelect, onClose]);

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        overflow: "hidden",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      {/* Header */}
      <DrawerHeader title="Tariff Library" onClose={onClose} />

      {/* Content Container */}
      <Box
        sx={{
          flex: 1,
          p: 3,
          pt: 0,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          bgcolor: "white",
        }}
      >
        {/* Search Bar Area */}
        <Box
          sx={{
            p: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "#E8E8E8",
            borderRadius: 0.5,
            mb: 2,
          }}
        >
          <SearchTextField
            size="small"
            onSearch={setSearchTerm}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "#E8E8E8",
                color: "text.primary",
                "& .MuiInputAdornment-root svg path": {
                  stroke: (theme: any) => theme.palette.brand.primary,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#E8E8E8 !important",
                },
              },
            }}
          />
          <Button
            size="small"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNewRow}
          >
            New
          </Button>
        </Box>

        {/* Grid Content */}
        <Box
          sx={{
            flex: 1,
            width: "100%",
            minHeight: 0,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          {isLoading ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="body2" color="textSecondary">
                Loading tariff rates...
              </Typography>
            </Box>
          ) : (
            <TariffGrid data={gridData} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default TariffDrawer;
