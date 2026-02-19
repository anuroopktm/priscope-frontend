import { Box, useTheme } from "@mui/material";
import { ActionHeader } from "../scenario-builder/components/ActionHeader";
import { useTreeGridInit } from "../scenario-builder/hooks/use-tree-grid-init";
import { useCallback } from "react";
import { TreeGridLayout } from "../scenario-builder/constant/tree-grid-layout";
import JsonData from "../scenario-builder/constant/tree-grid-sample-data.json";

// Enum definition for Category
const categoryEnum =
  "|Education|Vehicles|Business Industry|Home & Living|Essentials|Mobiles|Property|Electronics";
const categoryOptions = categoryEnum.split("|").filter(Boolean);

const generateData = (): any[] => {
  const rawRows = (JsonData.Body as any[]).flat();

  return rawRows.map((r: any) => ({
    id: r.id.toString(),
    SKU: r.Name,
    UPC: r.Phone,
    // Map random category for demo purposes to show off the select
    Category:
      categoryOptions[Math.floor(Math.random() * categoryOptions.length)],
    Description: r.Address,
    Supplier: r.Owner,
    Customer: r.Town,
    IsSelected: r.Type,
  }));
};

const ItemsMasterPage = () => {
  const theme = useTheme();
  // Optional: Function to attach event handlers after initialization
  const handleGridReady = useCallback((grid: TGrid) => {
    const G = grid as any;
    G.OnValueChanged = (grid: TGrid, row: TRow, col: string, val: any) => {
      console.log(`Cell ${col} updated to:`, val);
    };
  }, []);

  // Initialize the grid using the dedicated hook
  const gridInstance = useTreeGridInit(
    "ScenarioGrid",
    TreeGridLayout,
    generateData(),
    handleGridReady,
  );

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 1,
        overflow: "hidden",
        bgcolor: theme.palette.brand.background,
      }}
    >
      <ActionHeader />

      <Box
        sx={{
          flex: 1,
          overflow: "hidden",
          p: 2,
        }}
      >
        <Box
          id="ScenarioGrid"
          sx={{
            width: "100%",
            height: "100%",
          }}
        />
      </Box>
    </Box>
  );
};

export default ItemsMasterPage;
