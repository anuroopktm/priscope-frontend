import { Box } from "@mui/material";
import { useCallback } from "react";
import { ActionHeader } from "./components/ActionHeader";
import { TreeGridLayout } from "./constant/tree-grid-layout";
import JsonData from "./constant/tree-grid-sample-data.json";
import { useTreeGridInit } from "./hooks/use-tree-grid-init";

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

const ScenarioBuilderPage = () => {
  // Optional: Function to attach event handlers after initialization
  const handleGridReady = useCallback((grid: TGrid) => {
    const G = grid as any;
    G.OnValueChanged = (_grid: TGrid, _row: TRow, col: string, val: any) => {
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

  console.log("gridInstance", gridInstance);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 1,
        overflow: "hidden",
        bgcolor: "brand.background",
      }}
    >
      <ActionHeader selectedRows={[]} />

      <Box
        sx={{
          flex: 1,
          p: 2,
        }}
      >
        <Box
          id="ScenarioGrid"
          sx={{
            width: "100%",
            height: "calc(100vh - 144px)",
          }}
        />
      </Box>
    </Box>
  );
};

export default ScenarioBuilderPage;
