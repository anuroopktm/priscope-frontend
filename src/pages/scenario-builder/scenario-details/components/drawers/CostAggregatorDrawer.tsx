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
import { CustomDrawerLayout } from "../../tree-grid/config/custom-drawer-layout";
import { TariffDrawerLayout } from "../../tree-grid/config/tariff-drawer-layout";
import { useTreeGridInit } from "../../tree-grid/hooks/useTreeGridInit";
import CustomCalculationModal from "../modals/CustomCalculationModal";
import CustomCostModal from "../modals/CustomCostModal";
import FreightDrawer from "./FreightDrawer";
import TariffDrawer from "./TariffDrawer";

interface CostAggregatorDrawerProps {
  onClose: () => void;
  onUpdate: (items: any[]) => void;
  title?: string;
  initialItems?: any[];
  mainRowId?: string;
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

  if (!isSelected) {
    return `
      <div style="display: flex; align-items: center; gap: 8px; height: 100%; padding: 0 8px;">
        <button 
          onclick="window.handleOpenFreightSelection && window.handleOpenFreightSelection('${rowId}', '${gridId}', '${col}')"
          style="background: #E0F2FE; border: 1px solid #BAE6FD; border-radius: 4px; color: #0369A1; font-size: 10.5px; font-weight: 600; cursor: pointer; padding: 1px 10px; min-width: 60px; height: 22px; transition: all 0.2s;"
          onmouseover="this.style.background='#BAE6FD'"
          onmouseout="this.style.background='#E0F2FE'"
        >
          Select
        </button>
      </div>
    `;
  }

  console.log(
    "renderSelectButton running - isSelected:",
    isSelected,
    "name:",
    name,
  );
  return `
    <div 
      onclick="window.handleOpenFreightSelection && window.handleOpenFreightSelection('${rowId}', '${gridId}', '${col}')"
      style="display: flex; align-items: center; justify-content: flex-start; gap: 12px; height: 100%; padding: 0 12px; cursor: pointer;"
      data-scenario-selected="true"
    >
      <div style="background: #E0F2FE; border-radius: 4px; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; color: #0369A1;">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 2v6h-6"></path>
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
          <path d="M3 22v-6h6"></path>
          <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
        </svg>
      </div>
      <span style="font-size: 13px; color: #1e3a8a; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${nameStr}</span>
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
      data-scenario-selected="true"
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

const renderCalculatorIcon = (rowId: string, gridId: string) => {
  return `
      <div 
        onclick="window.handleOpenCalculation && window.handleOpenCalculation('${rowId}', '${gridId}')"
        style="display: flex; align-items: center; justify-content: center; height: 100%; cursor: pointer;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
            <line x1="8" y1="6" x2="16" y2="6"></line>
            <line x1="16" y1="14" x2="16" y2="18"></line>
            <line x1="8" y1="10" x2="8" y2="10.01"></line>
            <line x1="12" y1="10" x2="12" y2="10.01"></line>
            <line x1="16" y1="10" x2="16" y2="10.01"></line>
            <line x1="8" y1="14" x2="8" y2="14.01"></line>
            <line x1="12" y1="14" x2="12" y2="14.01"></line>
            <line x1="8" y1="18" x2="8" y2="18.01"></line>
            <line x1="12" y1="18" x2="12" y2="18.01"></line>
        </svg>
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
    type === "Tariff"
      ? TariffDrawerLayout
      : type === "Custom"
        ? CustomDrawerLayout
        : AggregatorDrawerLayout;
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
  mainRowId,
}: CostAggregatorDrawerProps) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<{
    rowId: string;
    sectionId: string;
  } | null>(null);
  const [isFreightDrawerOpen, setIsFreightDrawerOpen] = useState(false);
  const [isTariffDrawerOpen, setIsTariffDrawerOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isCalculationModalOpen, setIsCalculationModalOpen] = useState(false);
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
            // For Freight, cost is in column C. For Tariff, cost is in column D. For Custom, cost is in column A.
            const costCol =
              section.type === "Tariff"
                ? "D"
                : section.type === "Custom"
                  ? "A"
                  : "C";
            const costValue = grid.GetValue(row, costCol);

            // Only sum rows that have a non-zero cost or have a selected value
            const colAValue = String(grid.GetValue(row, "A") || "");
            const colBValue = String(grid.GetValue(row, "B") || "");
            const isDataSelected =
              colAValue.includes("data-scenario-selected") ||
              colBValue.includes("data-scenario-selected") ||
              colAValue.includes("SVG") ||
              colBValue.includes("SVG");

            if (costValue !== 0 || isDataSelected) {
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

  // Bridge for global handlers to access latest state
  const handlersBridgeRef = useRef({
    calculateTotal,
    sections,
  });

  useEffect(() => {
    handlersBridgeRef.current = { calculateTotal, sections };
  }, [calculateTotal, sections]);

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

      const section = handlersBridgeRef.current.sections.find(
        (s: any) => s.id === gridId,
      );
      if (section?.type === "Tariff") {
        if (col === "B") {
          // Logic for Scenario Builder Column selection
          (window as any).startScenarioColumnSelection &&
            (window as any).startScenarioColumnSelection(rowId, gridId);
          return;
        }
        setIsTariffDrawerOpen(true);
      } else {
        setIsFreightDrawerOpen(true);
      }
    };

    const recalculateTariffRow = (grid: any, row: any) => {
      const rate = parseFloat(grid.GetAttribute(row, "A", "RateValue")) || 0;
      const sourceValue =
        parseFloat(grid.GetAttribute(row, "B", "SourceValue")) || 0;
      const costPerUnit = (rate / 100) * sourceValue;
      grid.SetValue(row, "D", costPerUnit, 1);
    };

    (window as any).finishScenarioColumnSelection = (
      _colCaption: string,
      colName: string,
      rowId: string,
      gridId: string,
      value: any,
    ) => {
      const grid = (window as any).Grids?.[gridId];
      if (grid) {
        const row = grid.GetRowById(rowId);
        if (row) {
          const formattedValue =
            typeof value === "number" ? `$${value.toFixed(2)}` : String(value);
          grid.SetValue(
            row,
            "B",
            renderSelectButton(rowId, gridId, "B", formattedValue),
            1,
          );
          grid.SetAttribute(row, "B", "SourceColumn", colName, 1);
          grid.SetAttribute(row, "B", "SourceValue", value, 1);

          recalculateTariffRow(grid, row);
          grid.RefreshRow(row);
          handlersBridgeRef.current.calculateTotal();
        }
      }
    };

    (window as any).handleOpenCalculation = (rowId: string, gridId: string) => {
      setTargetGridId(gridId);
      setTargetRowId(rowId);
      setIsCalculationModalOpen(true);
    };

    return () => {
      delete (window as any).handleDeleteAggregatorRow;
      delete (window as any).handleOpenFreightSelection;
      delete (window as any).finishScenarioColumnSelection;
      delete (window as any).handleOpenCalculation;
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

  const handleAddSection = (
    type: "Freight" | "Tariff" | "Custom",
    customTitle?: string,
  ) => {
    const id = `grid_${Date.now()}`;
    const newSection: AggregatorSection = {
      id,
      type,
      title: customTitle || type,
      items: [
        type === "Tariff"
          ? {
              id: "row1",
              A: renderSelectButton("row1", id, "A"),
              B: renderSelectButton("row1", id, "B"),
              C: "Base UOM",
              D: 0,
            }
          : type === "Custom"
            ? {
                id: "row1",
                A: 0,
                B: renderCalculatorIcon("row1", id),
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
            grid.SetAttribute(row, "A", "RateValue", rate.cost, 1);

            const sourceValue =
              parseFloat(grid.GetAttribute(row, "B", "SourceValue")) || 0;
            const costPerUnit = (rate.cost / 100) * sourceValue;
            grid.SetValue(row, "D", costPerUnit, 1);

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
        // First pass: count valid data rows (excluding the trailing Select row)
        let dataRowCount = 0;
        let row = grid.GetFirst();
        while (row) {
          if (row.Kind === "Data" && !row.Deleted) {
            const colAValue = String(grid.GetValue(row, "A") || "");
            const isSelectRow =
              colAValue.includes("Select") &&
              !colAValue.includes("data-scenario-selected");
            if (!isSelectRow) {
              dataRowCount++;
            }
          }
          row = grid.GetNext(row);
        }

        // Second pass: process rows
        let currentItemIndex = 1;
        row = grid.GetFirst();
        while (row) {
          if (row.Kind === "Data" && !row.Deleted) {
            const isTariff = section.type === "Tariff";
            const isFreight = section.type === "Freight";
            const isCustom = section.type === "Custom";
            const costCol = isTariff ? "D" : isCustom ? "A" : "C";
            const costValueRaw = grid.GetValue(row, costCol);
            const costValue =
              typeof costValueRaw === "object" ? 0 : Number(costValueRaw) || 0;

            const colAValue = String(grid.GetValue(row, "A") || "");
            const isSelectRow =
              colAValue.includes("Select") &&
              !colAValue.includes("data-scenario-selected");

            if (isSelectRow) {
              row = grid.GetNext(row);
              continue;
            }

            // Get clean name from attribute
            const cleanNameRaw = grid.GetAttribute(row, "A", "CleanName");
            const cleanName =
              typeof cleanNameRaw === "string" ? cleanNameRaw : null;

            // For Custom, we use the section title
            // For Tariff/Freight, we use the specified naming logic
            let finalName = "";
            if (isCustom) {
              finalName = section.title;
            } else if (isTariff || isFreight) {
              const typeName = isTariff ? "Tariff" : "Freight";
              if (currentItemIndex === 1) {
                finalName = typeName;
              } else {
                finalName = `${typeName} ${currentItemIndex}`;
              }
              currentItemIndex++;
            } else {
              finalName = cleanName || "Cost Item";
            }

            allRows.push({
              id: String(row.id),
              name: finalName,
              currency: "USD",
              cost: costValue,
              costPerUnit: costValue,
              costFor: String(
                isCustom
                  ? "Base UOM"
                  : grid.GetValue(row, isTariff ? "C" : "B") || "Base UOM",
              ),
            });
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
        <IconButton
          onClick={() => {
            (window as any).clearScenarioColumnHighlights &&
              (window as any).clearScenarioColumnHighlights();
            onClose();
          }}
          size="small"
          sx={{ color: "#64748b" }}
        >
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
                onClick={() => setIsCustomModalOpen(true)}
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
                    const sectionToRemove = sections.find(
                      (s) => s.id === section.id,
                    );
                    if (sectionToRemove?.type === "Tariff") {
                      (window as any).clearScenarioColumnHighlights &&
                        (window as any).clearScenarioColumnHighlights();
                    }
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
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            (window as any).clearScenarioColumnHighlights &&
              (window as any).clearScenarioColumnHighlights();
            onClose();
          }}
        >
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
      <CustomCostModal
        open={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onConfirm={(label: string) => handleAddSection("Custom", label)}
      />
      <CustomCalculationModal
        open={isCalculationModalOpen}
        onClose={() => setIsCalculationModalOpen(false)}
        gridId="ScenarioGridDetails"
        targetRowId={mainRowId}
        initialValue={(() => {
          if (targetGridId && targetRowId) {
            const grid = (window as any).Grids?.[targetGridId];
            const row = grid?.GetRowById(targetRowId);
            // Prefer the stored formula attribute
            return row
              ? String(grid.GetAttribute(row, "A", "Formula") || "")
              : "";
          }
          return "";
        })()}
        onConfirm={(formula: string, label?: string) => {
          if (targetGridId && targetRowId && mainRowId) {
            const grid = (window as any).Grids?.[targetGridId];
            const mainGrid = (window as any).Grids?.["ScenarioGridDetails"];
            if (grid && mainGrid) {
              const row = grid.GetRowById(targetRowId);
              const mainRow = mainGrid.GetRowById(mainRowId);
              if (row && mainRow) {
                // Update header if label is provided
                if (label) {
                  if (grid.Header) {
                    grid.SetValue(grid.Header, "A", label, 1);
                  } else {
                    grid.SetAttribute(null, "A", "Caption", label, 1);
                  }
                  grid.Render();
                }

                // Evaluate formula
                let evalStr = formula;
                const matches = evalStr.match(/\[(.*?)\]/g);
                if (matches) {
                  matches.forEach((match) => {
                    const colName = match.slice(1, -1);
                    const val = mainGrid.GetValue(mainRow, colName) || 0;
                    evalStr = evalStr.replace(match, String(val));
                  });
                }

                try {
                  // Basic evaluation for simple arithmetic
                  // eslint-disable-next-line no-eval
                  const result = Number(eval(evalStr)) || 0;
                  // Store the result in the cell
                  grid.SetValue(row, "A", result, 1);
                  // Preserve the formula in an attribute for re-editing
                  grid.SetAttribute(row, "A", "Formula", formula, 1);
                  calculateTotal();
                } catch (e) {
                  console.error("Formula eval failed:", e);
                  grid.SetValue(row, "A", 0, 1);
                }
              }
            }
          }
        }}
      />
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
