import SearchTextField from "@/components/common/SearchTextField";
import { useListCurrencies } from "@/services/queries/common/common.queries";
import {
  useCreateContainerType,
  useCreateFreightRate,
  useSearchContainerTypes,
  useSearchFreightRates,
} from "@/services/queries/freight/freight.queries";
import type { FreightRate } from "@/services/queries/freight/freight.types";
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
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FreightDrawerLayout } from "../../tree-grid/config/freight-drawer-layout";
import { useTreeGridInit } from "../../tree-grid/hooks/useTreeGridInit";
import DrawerHeader from "../items-master-drawer/components/DrawerHeader";
import { GridSelectPopover } from "./components/GridSelectPopover";

console.log("FreightDrawer.tsx module loaded");

interface FreightDrawerProps {
  onClose: () => void;
  onSelect: (items: any[]) => void;
}

const freightGridId = "FreightDrawerGrid";
const freightGridContainerId = "TreeGrid_" + freightGridId;

const FreightGrid = React.memo(
  ({ data, onInit }: { data: any; onInit?: (id: string) => void }) => {
    console.log("FreightGrid component mounting", { hasOninit: !!onInit });
    useTreeGridInit(
      freightGridId,
      freightGridContainerId,
      FreightDrawerLayout,
      data,
      (grid) => onInit?.(grid.id),
    );
    return (
      <Box
        id={freightGridContainerId}
        sx={{ height: "100%", width: "100%", overflow: "visible" }}
      />
    );
  },
);

FreightGrid.displayName = "FreightGrid";

const FreightDrawer = ({ onClose, onSelect }: FreightDrawerProps) => {
  console.log("FreightDrawer component executing/rendering");
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: freightRatesData,
    isLoading,
    refetch,
  } = useSearchFreightRates({
    search: searchTerm,
  });
  const [localRows, setLocalRows] = useState<any[]>([]);

  const [popoverPosition, setPopoverPosition] = useState<{
    top: number;
    left: number;
    height: number;
    rowId: string;
  } | null>(null);
  const [commentText, setCommentText] = useState("");

  const [dropdownPopover, setDropdownPopover] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
    column: string;
    rowId: string;
    value: string;
  } | null>(null);

  // APIs for dropdowns
  const { data: currenciesData } = useListCurrencies({
    search: "",
    page_size: 100,
    skip: 0,
  });

  const { data: containerTypesData } = useSearchContainerTypes({
    tenant_id: "6b9d182e-5d44-4dbf-8a0d-efa9bb05996e", // Using sample tenant
    search: "",
    page_size: 100,
    skip: 0,
  });

  const { mutateAsync: createContainerType } = useCreateContainerType();
  const { mutate: createRate, isPending: isCreating } = useCreateFreightRate();

  const handleClosePopover = () => {
    setPopoverPosition(null);
    setCommentText("");
  };

  const handleSaveFreightRow = (saveWithComment: boolean) => {
    if (!popoverPosition) return;
    const grid = (window as any).Grids?.[freightGridId];
    if (!grid) return;

    const rowId = popoverPosition.rowId;
    const row = grid.GetRowById(rowId);
    if (!row) return;

    const resolveAndSave = async () => {
      let containerTypeId = row.C_id;

      if (!containerTypeId && row.C) {
        const existing = containerTypesData?.container_types?.find(
          (t: any) => t.type === row.C,
        );
        if (existing) {
          containerTypeId = existing.id;
        } else {
          try {
            const newType = await createContainerType({
              type: row.C,
              description: `Standard ${row.C} container`,
              tenant_id: "6b9d182e-5d44-4dbf-8a0d-efa9bb05996e",
            });
            containerTypeId = newType.id;
          } catch (e) {
            showToast("Failed to create new container type", "error");
            return;
          }
        }
      }

      const payload = {
        action_key: "curr_rate",
        comments:
          saveWithComment && commentText.trim()
            ? [{ comment: commentText.trim(), comment_type: "row" }]
            : [],
        container_type_id:
          containerTypeId || "c3d4e5f6-7890-1234-cdef-123406789012",
        currency: row.D || "USD",
        port_of_destination: row.B || "",
        port_of_origin: row.A || "",
        rate: Number(row.E) || 0,
        source: "freight_rate",
        tenant_id: "6b9d182e-5d44-4dbf-8a0d-efa9bb05996e",
        valid_from: new Date().toISOString().split("T")[0] + "T00:00:00",
        valid_to: "2030-12-31T23:59:59",
      };

      createRate(payload, {
        onSuccess: () => {
          showToast("Freight rate saved successfully", "success");
          setLocalRows((prev) => prev.filter((r) => r.id !== rowId));
          handleClosePopover();
          refetch();
        },
        onError: () => {
          showToast("Failed to save freight rate", "error");
        },
      });
    };

    resolveAndSave();
  };

  const handleGridInit = useCallback((gridId: string) => {
    console.log("Setting up TreeGrid events for:", gridId);

    const showDropdown = (row: any, col: string) => {
      if (!row || !row.id.startsWith("local_")) return false;
      console.log("Triggering dropdown event for:", col, row.id);
      const grid = (window as any).Grids?.[gridId];
      if (!grid) return false;

      // Force any active edits (A, B, or E) to save before we process the popover
      grid.EndEdit(1);

      if (col === "C" || col === "D") {
        grid.Focus(row, col);
        const cell = grid.GetCell(row, col);
        if (cell) {
          const rect = cell.getBoundingClientRect();
          console.log("Requesting popover at rect:", rect);
          setDropdownPopover({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            column: col,
            rowId: row.id,
            value: row[col] || "",
          });
          return true;
        }
      }
      return false;
    };

    if ((window as any).TGSetEvent) {
      (window as any).TGSetEvent(
        "OnClick",
        gridId,
        (_: any, row: any, col: string) => showDropdown(row, col),
      );
      (window as any).TGSetEvent(
        "OnFocus",
        gridId,
        (_: any, row: any, col: string) => {
          showDropdown(row, col);
        },
      );
      console.log("Events registered via TGSetEvent");
    } else {
      console.warn("TGSetEvent not found on window");
    }
  }, []);

  const handleSelectOption = (value: string, id?: string) => {
    if (!dropdownPopover) return;
    const { rowId, column } = dropdownPopover;
    const grid = (window as any).Grids?.[freightGridId];
    if (grid) {
      const row = grid.GetRowById(rowId);
      if (row) {
        // Use SetValue to ensure TreeGrid processes the change correctly
        grid.SetValue(row, column, value, 1);
        if (column === "C" && id) {
          row.C_id = id;
        }

        // Sync localRows state with current grid values
        if (rowId.startsWith("local_")) {
          setLocalRows((prev) =>
            prev.map((r) =>
              r.id === rowId
                ? {
                    ...r,
                    port_of_origin: grid.GetValue(row, "A") || "",
                    port_of_destination: grid.GetValue(row, "B") || "",
                    rate: Number(grid.GetValue(row, "E")) || 0,
                    [column === "C" ? "container_type" : "currency"]: value,
                    ...(column === "C" && id ? { container_type_id: id } : {}),
                  }
                : r,
            ),
          );
        }

        // Focus away from the grid to prevent immediate re-trigger of focus/dropdown
        grid.Focus(null, null);
      }
    }
    setDropdownPopover(null);
  };

  const handleCreateNewContainerType = async (value: string) => {
    try {
      const newType = await createContainerType({
        type: value,
        description: `Standard ${value} container`,
        tenant_id: "6b9d182e-5d44-4dbf-8a0d-efa9bb05996e",
      });
      queryClient.invalidateQueries({ queryKey: ["container-types"] });
      handleSelectOption(newType.type, newType.id);
      showToast(`Created New Container Type: ${value}`, "success");
    } catch (e) {
      showToast("Failed to create container type", "error");
    }
  };

  const handleAddNewRow = () => {
    const grid = (window as any).Grids?.[freightGridId];
    let updatedLocalRows = [...localRows];

    if (grid) {
      updatedLocalRows = updatedLocalRows.map((row) => {
        const r = grid.GetRowById(row.id);
        if (r) {
          return {
            ...row,
            port_of_origin: r.A !== undefined ? r.A : row.port_of_origin,
            port_of_destination:
              r.B !== undefined ? r.B : row.port_of_destination,
            container_type: r.C !== undefined ? r.C : row.container_type,
            currency: r.D !== undefined ? r.D : row.currency,
            rate: r.E !== undefined ? r.E : row.rate,
          };
        }
        return row;
      });
    }

    const newId = `local_${Date.now()}`;
    setLocalRows([
      {
        id: newId,
        port_of_origin: "",
        port_of_destination: "",
        container_type: "20 ft",
        currency: "USD",
        rate: 0,
      },
      ...updatedLocalRows,
    ]);

    setTimeout(() => {
      const g = (window as any).Grids?.[freightGridId];
      if (g) {
        const row = g.GetRowById(newId);
        if (row) {
          const cell = g.GetCell(row, "F");
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
  const renderActionCell = (id: string, isSelected: boolean = false) => {
    if (isSelected) {
      return `<div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; color: #059669;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>`;
    }
    if (id.startsWith("local_")) return `<div style="height: 100%;"></div>`;
    return `<div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">
                <button onclick="window.handleSelectFreightRow && window.handleSelectFreightRow('${id}')"
                    style="background: #E0F2FE; border: 1px solid #BAE6FD; border-radius: 4px; color: #0369A1; font-size: 11px; font-weight: 500; cursor: pointer; padding: 2px 8px; width: 60px; height: 24px;">
                    Select
                </button>
            </div>`;
  };

  const gridData = useMemo(() => {
    return {
      Body: [
        [
          ...localRows.map((row) => ({
            id: row.id,
            A: row.port_of_origin,
            B: row.port_of_destination,
            C: row.container_type,
            D: row.currency,
            E: row.rate,
            F: renderActionCell(row.id, false),
            CanEdit: "1",
            ACanEdit: "1",
            BCanEdit: "1",
            ECanEdit: "1",
            CCanEdit: "1",
            DCanEdit: "1",
          })),
          ...(freightRatesData?.freight_rates?.map((rate: FreightRate) => ({
            id: rate.id,
            A: rate.port_of_origin,
            B: rate.port_of_destination,
            C: rate.container_type || "20 ft",
            C_id: rate.container_type,
            D: rate.currency,
            E: rate.rate,
            F: renderActionCell(rate.id, false),
            CanEdit: "0",
            ACanEdit: "0",
            BCanEdit: "0",
            ECanEdit: "0",
            CCanEdit: "0",
            DCanEdit: "0",
          })) || []),
        ],
      ],
    };
  }, [localRows, freightRatesData]);

  useEffect(() => {
    (window as any).handleSelectFreightRow = (rowId: string) => {
      const grid = (window as any).Grids?.[freightGridId];
      if (grid) {
        const row = grid.GetRowById(rowId);
        if (row) {
          onSelect([
            {
              id: rowId,
              name: `Freight (${row.A || ""} - ${row.B || ""})`,
              cost: Number(row.E) || 0,
              currency: row.D || "USD",
              source: rowId.startsWith("local_") ? "Manual" : "Freight API",
            },
          ]);
          onClose();
        }
      }
    };
    return () => {
      delete (window as any).handleSelectFreightRow;
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
      <DrawerHeader title="Freight Library" onClose={onClose} />
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
              <Typography variant="body2">Loading...</Typography>
            </Box>
          ) : (
            <FreightGrid data={gridData} onInit={handleGridInit} />
          )}

          {dropdownPopover && (
            <GridSelectPopover
              anchor={dropdownPopover}
              options={
                dropdownPopover.column === "C"
                  ? (containerTypesData?.container_types || []).map(
                      (t: any) => ({
                        id: t.id,
                        label: t.type,
                      }),
                    )
                  : (currenciesData?.currencies || []).map((c: any) => ({
                      id: c.id || c.currency || c.code,
                      label: c.currency || c.code || "",
                    }))
              }
              onSelect={handleSelectOption}
              onClose={() => setDropdownPopover(null)}
              showCreateNew={dropdownPopover.column === "C"}
              onCreateNew={handleCreateNewContainerType}
              placeholder={`Search ${
                dropdownPopover.column === "C" ? "container..." : "currency..."
              }`}
            />
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
                      onClick={() => handleSaveFreightRow(true)}
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
                      onClick={() => handleSaveFreightRow(false)}
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

export default FreightDrawer;
