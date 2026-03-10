import SearchTextField from "@/components/common/SearchTextField";
import { useSearchFreightRates } from "@/services/queries/freight/freight.queries";
import type { FreightRate } from "@/services/queries/freight/freight.types";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { FreightDrawerLayout } from "../../tree-grid/config/freight-drawer-layout";
import { useTreeGridInit } from "../../tree-grid/hooks/useTreeGridInit";
import DrawerHeader from "../items-master-drawer/components/DrawerHeader";

interface FreightDrawerProps {
  onClose: () => void;
  onSelect: (items: any[]) => void;
}

const freightGridId = "FreightDrawerGrid";
const freightGridContainerId = "TreeGrid_" + freightGridId;

const FreightGrid = ({ data }: { data: any }) => {
  useTreeGridInit(
    freightGridId,
    freightGridContainerId,
    FreightDrawerLayout,
    data,
  );
  return (
    <Box id={freightGridContainerId} sx={{ height: "100%", width: "100%" }} />
  );
};

const FreightDrawer = ({ onClose, onSelect }: FreightDrawerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: freightRatesData, isLoading } = useSearchFreightRates({
    search: searchTerm,
  });
  const renderActionCell = (id: string, isSelected: boolean = false) => {
    if (isSelected) {
      return `
                <div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; color: #059669;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
            `;
    }
    return `
            <div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">
                <button 
                    onclick="window.handleSelectFreightRow && window.handleSelectFreightRow('${id}')"
                    style="background: #E0F2FE; border: 1px solid #BAE6FD; border-radius: 4px; color: #0369A1; font-size: 11px; font-weight: 500; cursor: pointer; padding: 2px 8px; width: 60px; height: 24px;"
                >
                    Select
                </button>
            </div>
        `;
  };

  const gridData = {
    Body: [
      freightRatesData?.freight_rates?.map((rate: FreightRate) => ({
        id: rate.id,
        port_of_origin: rate.port_of_origin,
        port_of_destination: rate.port_of_destination,
        container_type: rate.container_type || "20 ft",
        currency: rate.currency,
        rate: rate.rate,
        actions: renderActionCell(rate.id, false),
      })) || [],
    ],
  };

  // Global handler for row selection
  useEffect(() => {
    (window as any).handleSelectFreightRow = (rowId: string) => {
      const rate = freightRatesData?.freight_rates?.find(
        (r: FreightRate) => r.id === rowId,
      );
      if (rate) {
        onSelect([
          {
            id: rate.id,
            name: `Freight (${rate.port_of_origin} - ${rate.port_of_destination})`,
            cost: rate.rate,
            currency: rate.currency,
            source: "Freight API",
          },
        ]);
        onClose();
      }
    };
    return () => {
      delete (window as any).handleSelectFreightRow;
    };
  }, [freightRatesData, onSelect, onClose]);

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
      <DrawerHeader title="Freight Library" onClose={onClose} />

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
                  stroke: (theme) => theme.palette.brand.primary,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#E8E8E8 !important",
                },
              },
            }}
          />
          <Button size="small" variant="contained" startIcon={<AddIcon />}>
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
                Loading freight rates...
              </Typography>
            </Box>
          ) : (
            <FreightGrid data={gridData} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FreightDrawer;
