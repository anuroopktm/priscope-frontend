import SearchTextField from "@/components/common/SearchTextField";
import {
  useCreateTariffRate,
  useSearchTariffRates,
} from "@/services/queries/tariff/tariff.queries";
import type { TariffRate } from "@/services/queries/tariff/tariff.types";
import { useToastStore } from "@/store/useToastStore";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  IconButton,
  Portal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TariffLibraryLayout } from "../../tree-grid/config/tariff-library-layout";
import { useTreeGridInit } from "../../tree-grid/hooks/useTreeGridInit";
import DrawerHeader from "../items-master-drawer/components/DrawerHeader";

interface TariffDrawerProps {
  onClose: () => void;
  onSelect: (items: any[]) => void;
}

const tariffGridId = "TariffLibraryGrid";
const tariffGridContainerId = "TreeGrid_" + tariffGridId;

const TariffGrid = ({
  data,
  onInit,
}: {
  data: any;
  onInit?: (id: string) => void;
}) => {
  useTreeGridInit(
    tariffGridId,
    tariffGridContainerId,
    TariffLibraryLayout,
    data,
    onInit,
  );
  return (
    <Box id={tariffGridContainerId} sx={{ height: "100%", width: "100%" }} />
  );
};

const TariffDrawer = ({ onClose, onSelect }: TariffDrawerProps) => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: tariffRatesData,
    isLoading,
    refetch,
  } = useSearchTariffRates({
    search: searchTerm,
  });
  const { mutate: createTariffRate, isPending: isCreating } =
    useCreateTariffRate();

  const [localRows, setLocalRows] = useState<any[]>([]);
  const [popoverPosition, setPopoverPosition] = useState<{
    top: number;
    left: number;
    height: number;
    rowId: string;
  } | null>(null);
  const [commentText, setCommentText] = useState("");

  const handleClosePopover = () => {
    setPopoverPosition(null);
    setCommentText("");
  };

  const handleSaveTariffRow = (saveWithComment: boolean) => {
    if (!popoverPosition) return;
    const grid = (window as any).Grids?.[tariffGridId];
    if (!grid) return;

    const rowId = popoverPosition.rowId;
    const row = grid.GetRowById(rowId);
    if (!row) return;

    const payload = {
      tenant_id: "6b9d182e-5d44-4dbf-8a0d-efa9bb05996e",
      country_of_origin: String(grid.GetValue(row, "country_of_origin") || ""),
      country_of_destination: String(
        grid.GetValue(row, "country_of_destination") || "",
      ),
      hs_code: String(grid.GetValue(row, "hs_code") || ""),
      rate: Number(grid.GetValue(row, "rate")) || 0,
      valid_from: new Date().toISOString(),
      valid_to: "2030-12-31T23:59:59Z",
      comments:
        saveWithComment && commentText.trim()
          ? [
              {
                comment_type: "field",
                tariff_field_key: "hs_code",
                comment: commentText.trim(),
              },
            ]
          : [],
      last_change_source: "tariff_rate",
      action_key: "hs_code",
    };

    createTariffRate(payload, {
      onSuccess: () => {
        showToast("Tariff rate saved successfully", "success");
        setLocalRows((prev) => prev.filter((r) => r.id !== rowId));
        handleClosePopover();
        refetch();
        queryClient.invalidateQueries({ queryKey: ["tariff-rates"] });
      },
      onError: (error: any) => {
        showToast(
          error?.response?.data?.detail?.[0]?.msg ||
            "Failed to save tariff rate",
          "error",
        );
      },
    });
  };

  const handleGridInit = useCallback((_gridId: string) => {
    console.log("Tariff grid initialized:", _gridId);
  }, []);

  const handleAddNewRow = () => {
    const grid = (window as any).Grids?.[tariffGridId];
    let updatedLocalRows = [...localRows];

    if (grid) {
      updatedLocalRows = updatedLocalRows.map((row) => {
        const r = grid.GetRowById(row.id);
        if (r) {
          return {
            ...row,
            country_of_origin: grid.GetValue(r, "country_of_origin") || "",
            country_of_destination:
              grid.GetValue(r, "country_of_destination") || "",
            hs_code: grid.GetValue(r, "hs_code") || "",
            rate: Number(grid.GetValue(r, "rate")) || 0,
          };
        }
        return row;
      });
    }

    const newId = `local_${Date.now()}`;
    setLocalRows([
      {
        id: newId,
        country_of_origin: "",
        country_of_destination: "",
        hs_code: "",
        rate: "",
      },
      ...updatedLocalRows,
    ]);

    setTimeout(() => {
      const g = (window as any).Grids?.[tariffGridId];
      if (g) {
        const row = g.GetRowById(newId);
        if (row) {
          const cell = g.GetCell(row, "actions");
          if (cell) {
            const rect = cell.getBoundingClientRect();
            g.EndEdit(1);
            setPopoverPosition({
              top: rect.top,
              left: rect.left,
              height: rect.height,
              rowId: newId,
            });
          }
        }
      }
    }, 400);
  };

  const renderActionCell = (id: string) => {
    if (id.startsWith("local_")) {
      return `<div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; gap: 8px;">
                <button onclick="window.handleDeleteTariffRow && window.handleDeleteTariffRow('${id}')" 
                    style="background: transparent; border: none; color: #EF4444; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 4px;"
                    title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                </button>
            </div>`;
    }
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

  const gridData = useMemo(() => {
    return {
      Body: [
        [
          ...localRows.map((row) => ({
            id: row.id,
            country_of_origin: row.country_of_origin,
            country_of_destination: row.country_of_destination,
            hs_code: row.hs_code,
            rate: row.rate,
            actions: renderActionCell(row.id),
            CanEdit: "1",
          })),
          ...(tariffRatesData?.tariff_rates?.map((rate: TariffRate) => ({
            id: rate.id,
            country_of_origin: rate.country_of_origin,
            country_of_destination: rate.country_of_destination,
            hs_code: rate.hs_code,
            rate: rate.rate,
            actions: renderActionCell(rate.id),
            CanEdit: "0",
          })) || []),
        ],
      ],
    };
  }, [localRows, tariffRatesData]);

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
    (window as any).handleDeleteTariffRow = (rowId: string) => {
      setLocalRows((prev) => prev.filter((r) => r.id !== rowId));
      setPopoverPosition(null);
    };

    return () => {
      delete (window as any).handleSelectTariffRow;
      delete (window as any).handleDeleteTariffRow;
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
        overflow: "visible",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <DrawerHeader title="Tariff Library" onClose={onClose} />
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
        <Box
          sx={{
            p: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "#E8E8E8",
            borderRadius: 1,
            mb: 2,
          }}
        >
          <SearchTextField
            size="small"
            onSearch={setSearchTerm}
            containerSx={{ bgcolor: "white", px: 0 }}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "white",
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

        <Box
          sx={{
            flex: 1,
            width: "100%",
            minHeight: 0,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            overflow: "visible",
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
            <TariffGrid data={gridData} onInit={handleGridInit} />
          )}

          {popoverPosition && (
            <Portal>
              <Box
                sx={{
                  position: "fixed",
                  top: popoverPosition.top + popoverPosition.height - 10,
                  left: Math.max(10, popoverPosition.left - 310),
                  zIndex: 1000000,
                  width: 320,
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  mt: 1.5,
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    position: "relative",
                    pr: 0,
                    pointerEvents: "auto",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Comments*
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDownCapture={(e) => {
                      e.stopPropagation();
                    }}
                    onKeyUpCapture={(e) => {
                      e.stopPropagation();
                    }}
                    placeholder="Type here..."
                    autoFocus
                    variant="standard"
                    InputProps={{
                      disableUnderline: true,
                      sx: {
                        fontSize: "13px",
                        py: 1,
                        borderTop: "1px solid #E5E7EB",
                      },
                    }}
                  />
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{
                      position: "absolute",
                      right: -90,
                      top: 0,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <IconButton
                      onClick={() => handleSaveTariffRow(true)}
                      disabled={isCreating || !commentText.trim()}
                      sx={{
                        bgcolor: "white",
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                        color: "#3B82F6",
                        "&:hover": { bgcolor: "#F3F4F6" },
                        border: "1px solid #E5E7EB",
                        width: 36,
                        height: 36,
                      }}
                    >
                      <CheckIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleSaveTariffRow(false)}
                      disabled={isCreating}
                      sx={{
                        bgcolor: "white",
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                        color: "#EF4444",
                        "&:hover": { bgcolor: "#F3F4F6" },
                        border: "1px solid #E5E7EB",
                        width: 36,
                        height: 36,
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Stack>
                </Box>
              </Box>
            </Portal>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default TariffDrawer;
