import AddIcon from "@mui/icons-material/Add";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Box,
  Button,
  Chip,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import DeleteConfirmModal from "../../../list-scenarios/components/DeleteConfirmModal";
import { AggregatorDrawerLayout } from "../../tree-grid/config/aggregator-drawer-layout";
import { TariffDrawerLayout } from "../../tree-grid/config/tariff-drawer-layout";
import { useTreeGridInit } from "../../tree-grid/hooks/useTreeGridInit";
import FreightDrawer from "./FreightDrawer";
import TariffDrawer from "./TariffDrawer";

interface CostAggregatorDrawerProps {
  onClose: () => void;
  onUpdate: (items: any[]) => void;
  title?: string;
  initialItems?: any[];
}

interface AggregatorSection {
  id: string;
  type: "Freight" | "Tariff" | "Custom";
  title: string;
  items: any[];
}

const drawerGridContainerBaseId = "TreeGridContainer_";

const renderSelectButton = (
  rowId: string,
  gridId: string,
  col: string,
  name: any = "Select",
) => {
  const isSelected = name !== "Select" && name != null;
  const nameStr = typeof name === "string" ? name : String(name || "");
  return `
      <div style="display: flex; align-items: center; gap: 8px; height: 100%; padding: 0 8px;">
        <button 
          onclick="window.handleOpenFreightSelection && window.handleOpenFreightSelection('${rowId}', '${gridId}', '${col}')"
          style="background: #E0F2FE; border: 1px solid #BAE6FD; border-radius: 4px; color: #0369A1; font-size: 10.5px; font-weight: 600; cursor: pointer; padding: 1px 10px; min-width: 60px; height: 22px; transition: all 0.2s;"
          onmouseover="this.style.background='#BAE6FD'"
          onmouseout="this.style.background='#E0F2FE'"
        >
          ${isSelected ? "Change" : "Select"}
        </button>
        ${isSelected ? `<span style="font-size: 13px; color: #1e3a8a; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${nameStr}</span>` : ""}
      </div>
    `;
};

const renderSelectedValue = (
  value: any,
  rowId: string,
  gridId: string,
  isPercentage: boolean = false,
) => {
  let formattedValue: string;
  if (typeof value === "number") {
    formattedValue = isPercentage
      ? `${value.toFixed(2)}%`
      : `$${value.toFixed(2)}`;
  } else {
    formattedValue = value != null ? String(value) : "";
  }

  return `
    <div 
      onclick="window.handleOpenFreightSelection && window.handleOpenFreightSelection('${rowId}', '${gridId}', 'A')"
      style="display: flex; align-items: center; justify-content: flex-end; gap: 12px; height: 100%; padding: 0 12px; cursor: pointer;"
    >
      <div style="background: #E0F2FE; border-radius: 4px; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; color: #0369A1;">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 2v6h-6"></path>
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
          <path d="M3 22v-6h6"></path>
          <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
        </svg>
      </div>
      <span style="font-size: 13px; color: #1e293b; font-weight: 600;">${formattedValue}</span>
    </div>
  `;
};

const AggregatorGrid = ({
  id,
  data,
  type,
  onDataChange,
}: {
  id: string;
  data: any;
  type: string;
  onDataChange?: () => void;
}) => {
  const containerId = drawerGridContainerBaseId + id;
  const layout =
    type === "Tariff" ? TariffDrawerLayout : AggregatorDrawerLayout;
  useTreeGridInit(id, containerId, layout, data, (_grid) => {
    (window as any).TGAddEvent("OnAfterValueChanged", id, (_grid: any) => {
      onDataChange?.();
    });
  });
  return (
    <Box
      id={containerId}
      sx={{ height: "auto", width: "650px", minHeight: "68px" }}
    />
  );
};

const CostAggregatorDrawer = ({
  onClose,
  onUpdate,
  title = "Cost aggregator",
  initialItems = [],
}: CostAggregatorDrawerProps) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<{
    rowId: string;
    sectionId: string;
  } | null>(null);
  const [isFreightDrawerOpen, setIsFreightDrawerOpen] = useState(false);
  const [isTariffDrawerOpen, setIsTariffDrawerOpen] = useState(false);
  const [targetGridId, setTargetGridId] = useState<string | null>(null);
  const [targetRowId, setTargetRowId] = useState<string | null>(null);
  const [totalCost, setTotalCost] = useState(0);

  const [sections, setSections] = useState<AggregatorSection[]>(() => {
    const initialSectionId = "initial";
    if (initialItems.length > 0) {
      const mappedItems = initialItems.map((item) => ({
        ...item,
        A: renderSelectedValue(item.cost, item.id, initialSectionId),
        B: item.B || "Base UOM",
        C: item.cost,
      }));

      // Add trailing select row
      mappedItems.push({
        id: `empty_${Date.now()}`,
        A: renderSelectButton(`empty_${Date.now()}`, initialSectionId, "A"),
        B: "Base UOM",
        C: 0,
      });

      return [
        {
          id: initialSectionId,
          type: "Freight",
          title: "Freight",
          items: mappedItems,
        },
      ];
    } else {
      return [];
    }
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const calculateTotal = () => {
    let total = 0;
    sections.forEach((section) => {
      const grid = (window as any).Grids?.[section.id];
      if (grid) {
        let row = grid.GetFirst();
        while (row) {
          if (row.Kind === "Data" && !row.Deleted) {
            // For Freight, cost is in column C. For Tariff, cost is in column D.
            const costCol = section.type === "Tariff" ? "D" : "C";
            const costValue = grid.GetValue(row, costCol);

            // Only sum rows that have a non-zero cost or are explicitly "Change" rows
            if (costValue !== 0 || grid.GetValue(row, "A").includes("Change")) {
              total += Number(costValue) || 0;
            }
          }
          row = grid.GetNext(row);
        }
      }
    });
    setTotalCost(total);
  };

  useEffect(() => {
    calculateTotal();
  }, [sections]);

  const openTemplate = Boolean(anchorEl);

  const sectionsRef = useRef(sections);
  useEffect(() => {
    sectionsRef.current = sections;
  }, [sections]);

  const handleTemplateClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleTemplateClose = () => {
    setAnchorEl(null);
  };

  // Global handlers
  useEffect(() => {
    (window as any).handleDeleteAggregatorRow = (
      rowId: string,
      sectionId: string,
    ) => {
      setRowToDelete({ rowId, sectionId });
      setDeleteModalOpen(true);
    };
    (window as any).handleOpenFreightSelection = (
      rowId: string,
      gridId: string,
      col: string,
    ) => {
      setTargetGridId(gridId);
      setTargetRowId(rowId);

      const section = sectionsRef.current.find((s: any) => s.id === gridId);
      if (section?.type === "Tariff") {
        if (col === "B") {
          // Logic for Scenario Builder Column selection
          // This will be handled in the next step
          (window as any).startScenarioColumnSelection &&
            (window as any).startScenarioColumnSelection(rowId, gridId);
          return;
        }
        setIsTariffDrawerOpen(true);
      } else {
        setIsFreightDrawerOpen(true);
      }
    };

    (window as any).finishScenarioColumnSelection = (
      colCaption: string,
      colName: string,
      rowId: string,
      gridId: string,
    ) => {
      const grid = (window as any).Grids?.[gridId];
      if (grid) {
        const row = grid.GetRowById(rowId);
        if (row) {
          grid.SetValue(row, "B", colCaption, 1);
          // Optionally store colName as an attribute if needed for calculation logic
          grid.SetAttribute(row, "B", "SourceColumn", colName, 1);
          grid.RefreshRow(row);
        }
      }
    };

    return () => {
      delete (window as any).handleDeleteAggregatorRow;
      delete (window as any).handleOpenFreightSelection;
    };
  }, []);

  const handleDeleteConfirm = () => {
    if (rowToDelete) {
      const grid = (window as any).Grids?.[rowToDelete.sectionId];
      if (grid) {
        const row = grid.GetRowById(rowToDelete.rowId);
        if (row) {
          grid.DeleteRow(row, 2);
          calculateTotal();
        }
      }
    }
    setDeleteModalOpen(false);
    setRowToDelete(null);
  };

  const handleAddSection = (type: "Freight" | "Tariff" | "Custom") => {
    const id = `grid_${Date.now()}`;
    const newSection: AggregatorSection = {
      id,
      type,
      title: type,
      items: [
        type === "Tariff"
          ? {
              id: "row1",
              A: renderSelectButton("row1", id, "A"),
              B: renderSelectButton("row1", id, "B"),
              C: "Base UOM",
              D: 0,
            }
          : {
              id: "row1",
              A: renderSelectButton("row1", id, "A"),
              B: "Base UOM",
              C: 0,
            },
      ],
    };
    setSections([...sections, newSection]);
  };

  const handleFreightSelect = (selectedRates: any[]) => {
    if (targetGridId && targetRowId && selectedRates.length > 0) {
      const grid = (window as any).Grids?.[targetGridId];
      if (grid) {
        const targetRow = grid.GetRowById(targetRowId);

        selectedRates.forEach((rate, index) => {
          let row;
          if (index === 0 && targetRow) {
            row = targetRow;
          } else {
            // Find the current Select button row if any
            let last = grid.GetLast();
            while (last && last.Visible === 0) last = grid.GetPrev(last);

            const isLastSelect =
              last && grid.GetValue(last, "A")?.includes(">Select</button>");

            if (isLastSelect) {
              // Insert before the Select row
              const prev = grid.GetPrev(last);
              row = grid.AddRow(null, prev, 1);
            } else {
              // Append at the end
              row = grid.AddRow(null, null, 1);
            }
          }

          if (row) {
            grid.SetValue(
              row,
              "A",
              renderSelectedValue(rate.cost, row.id, targetGridId),
              1,
            );
            grid.SetAttribute(row, "A", "CleanName", rate.name, 1);
            grid.SetValue(row, "C", rate.cost, 1);
            grid.SetValue(row, "B", "Base UOM", 1);
            grid.RefreshRow(row);
          }
        });

        // Ensure exactly one Select button remains at the bottom
        let finalLast = grid.GetLast();
        while (finalLast && finalLast.Visible === 0)
          finalLast = grid.GetPrev(finalLast);

        const isFinalLastSelect =
          finalLast &&
          grid.GetValue(finalLast, "A")?.includes(">Select</button>");

        if (!isFinalLastSelect) {
          const emptyRow = grid.AddRow(null, null, 1);
          if (emptyRow) {
            grid.SetValue(
              emptyRow,
              "A",
              renderSelectButton(emptyRow.id, targetGridId, "A"),
              1,
            );
            grid.SetValue(emptyRow, "B", "Base UOM", 1);
            grid.SetValue(emptyRow, "C", 0, 1);
            grid.RefreshRow(emptyRow);
          }
        }

        grid.Calculate();
        calculateTotal();
      }
    }
    setIsFreightDrawerOpen(false);
  };

  const handleTariffSelect = (selectedTariffs: any[]) => {
    if (targetGridId && targetRowId && selectedTariffs.length > 0) {
      const grid = (window as any).Grids?.[targetGridId];
      if (grid) {
        const targetRow = grid.GetRowById(targetRowId);

        selectedTariffs.forEach((rate, index) => {
          let row;
          if (index === 0 && targetRow) {
            row = targetRow;
          } else {
            // Find the current Select button row if any
            let last = grid.GetLast();
            while (last && last.Visible === 0) last = grid.GetPrev(last);

            const isLastSelect =
              last && grid.GetValue(last, "A")?.includes(">Select</button>");

            if (isLastSelect) {
              // Insert before the Select row
              const prev = grid.GetPrev(last);
              row = grid.AddRow(null, prev, 1);
            } else {
              // Append at the end
              row = grid.AddRow(null, null, 1);
            }
          }

          if (row) {
            grid.SetValue(
              row,
              "A",
              renderSelectedValue(rate.cost, row.id, targetGridId, true),
              1,
            );
            grid.SetAttribute(row, "A", "CleanName", rate.name, 1);
            grid.SetValue(row, "D", rate.cost, 1);
            grid.SetValue(row, "C", "Base UOM", 1);
            grid.RefreshRow(row);
          }
        });

        // Ensure exactly one Select button remains at the bottom
        let finalLast = grid.GetLast();
        while (finalLast && finalLast.Visible === 0)
          finalLast = grid.GetPrev(finalLast);

        const isFinalLastSelect =
          finalLast &&
          grid.GetValue(finalLast, "A")?.includes(">Select</button>");

        if (!isFinalLastSelect) {
          const emptyRow = grid.AddRow(null, null, 1);
          if (emptyRow) {
            grid.SetValue(
              emptyRow,
              "A",
              renderSelectButton(emptyRow.id, targetGridId, "A"),
              1,
            );
            grid.SetValue(
              emptyRow,
              "B",
              renderSelectButton(emptyRow.id, targetGridId, "B"),
              1,
            );
            grid.SetValue(emptyRow, "C", "Base UOM", 1);
            grid.SetValue(emptyRow, "D", 0, 1);
            grid.RefreshRow(emptyRow);
          }
        }

        grid.Calculate();
        calculateTotal();
      }
    }
    setIsTariffDrawerOpen(false);
  };

  const handleDone = () => {
    const allRows: any[] = [];
    sections.forEach((section) => {
      const grid = (window as any).Grids?.[section.id];
      if (grid) {
        let row = grid.GetFirst();
        while (row) {
          if (row.Kind === "Data" && !row.Deleted) {
            const isTariff = section.type === "Tariff";
            const costCol = isTariff ? "D" : "C";
            const costValueRaw = grid.GetValue(row, costCol);
            const costValue =
              typeof costValueRaw === "object" ? 0 : Number(costValueRaw) || 0;

            // Get clean name from attribute
            const cleanNameRaw = grid.GetAttribute(row, "A", "CleanName");
            const cleanName =
              typeof cleanNameRaw === "string" ? cleanNameRaw : null;

            const colAValue = grid.GetValue(row, "A");
            const isChangeRow =
              typeof colAValue === "string" && colAValue.includes("Change");

            // Only include rows that have a selected rate or valid name
            if (cleanName || isChangeRow) {
              allRows.push({
                id: String(row.id),
                name: cleanName || "Cost Item",
                currency: "USD",
                cost: costValue,
                costPerUnit: costValue,
                costFor: String(
                  grid.GetValue(row, isTariff ? "C" : "B") || "Base UOM",
                ),
              });
            }
          }
          row = grid.GetNext(row);
        }
      }
    });
    onUpdate(allRows);
    onClose();
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        overflowY: "auto",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1,
          flexShrink: 0,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", color: "#1a365d" }}
        >
          {title}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: "#64748b" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Calculate Buttons Section */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderTop: 1,
          borderColor: "grey.200",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: "bold", color: "#1a365d" }}
            >
              Calculate - Cost aggregator
            </Typography>

            <Stack direction="row" spacing={1}>
              <Chip
                label="Freight"
                onClick={() => handleAddSection("Freight")}
                onDelete={() => {}}
                deleteIcon={
                  <AddIcon style={{ fontSize: 16, color: "#1a365d" }} />
                }
              />
              <Chip
                label="Tariff"
                onClick={() => handleAddSection("Tariff")}
                onDelete={() => {}}
                deleteIcon={
                  <AddIcon style={{ fontSize: 16, color: "#1a365d" }} />
                }
              />
              <Chip
                label="Custom"
                onClick={() => handleAddSection("Custom")}
                onDelete={() => {}}
                deleteIcon={
                  <AddIcon style={{ fontSize: 16, color: "#1a365d" }} />
                }
              />
            </Stack>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              size="small"
              onClick={handleTemplateClick}
              endIcon={<KeyboardArrowDownIcon />}
            >
              Saved Template
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={openTemplate}
              onClose={handleTemplateClose}
            >
              <MenuItem onClick={handleTemplateClose}>Template 1</MenuItem>
              <MenuItem onClick={handleTemplateClose}>Template 2</MenuItem>
            </Menu>

            <Button
              size="small"
              variant="contained"
              startIcon={<BookmarkAddIcon fontSize="small" />}
            >
              Save Template
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Content Area */}
      <Box
        sx={{
          px: 3,
          pb: 1,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {sections.length === 0 ? (
          <Box
            sx={{
              height: "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "grey.50",
              borderRadius: 1,
              border: "1px dashed #cbd5e1",
              mb: 2,
            }}
          >
            <Typography variant="body2" sx={{ color: "grey.500" }}>
              Add Freight, Tariff or custom the define cost aggregator
            </Typography>
          </Box>
        ) : (
          sections.map((section) => (
            <Box
              key={section.id}
              sx={{ display: "flex", flexDirection: "column", gap: 1 }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: "bold", color: "#1a365d" }}
                >
                  {section.title}
                </Typography>
                <IconButton
                  size="small"
                  sx={{ color: "grey.500" }}
                  onClick={() => {
                    setSections(sections.filter((s) => s.id !== section.id));
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
              <Box
                sx={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 1,
                  overflow: "hidden",
                  width: "fit-content",
                  bgcolor: "white",
                }}
              >
                <GridWrapper
                  section={section}
                  calculateTotal={calculateTotal}
                />
              </Box>
            </Box>
          ))
        )}
      </Box>

      {/* Total Bar */}
      <Box sx={{ px: 3, mb: 2 }}>
        <Box
          sx={{
            bgcolor: "#f1f5f9",
            borderRadius: 1,
            p: 1.5,
            border: "1px solid #e2e8f0",
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: "700", color: "#1e293b" }}
          >
            Total Cost per unit: ${totalCost.toFixed(2)}
          </Typography>
        </Box>
      </Box>

      {/* Footer Actions */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "start",
          gap: 1.5,
          bgcolor: "background.paper",
          flexShrink: 0,
          borderTop: 1,
          borderColor: "grey.100",
        }}
      >
        <Button size="small" variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button size="small" variant="contained" onClick={handleDone}>
          Done
        </Button>
      </Box>

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      <Drawer
        anchor="right"
        open={isFreightDrawerOpen}
        onClose={() => setIsFreightDrawerOpen(false)}
        sx={{ zIndex: 3000 }}
        PaperProps={{
          sx: {
            width: "90vw",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <FreightDrawer
          onClose={() => setIsFreightDrawerOpen(false)}
          onSelect={handleFreightSelect}
        />
      </Drawer>

      <Drawer
        anchor="right"
        open={isTariffDrawerOpen}
        onClose={() => setIsTariffDrawerOpen(false)}
        sx={{ zIndex: 3000 }}
        PaperProps={{
          sx: {
            width: "90vw",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <TariffDrawer
          onClose={() => setIsTariffDrawerOpen(false)}
          onSelect={handleTariffSelect}
        />
      </Drawer>
    </Box>
  );
};

const GridWrapper = ({ section, calculateTotal }: any) => {
  const memoData = useMemo(() => ({ Body: [section.items] }), []);
  return (
    <AggregatorGrid
      id={section.id}
      data={memoData}
      type={section.type}
      onDataChange={calculateTotal}
    />
  );
};

export default CostAggregatorDrawer;
