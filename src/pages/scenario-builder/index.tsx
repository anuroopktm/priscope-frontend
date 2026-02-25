import { useListScenarios } from "@/services/queries/scenario-builder/scenario-builder.queries";
import { Box } from "@mui/material";
import { useMemo, useState } from "react";
import { ActionHeader } from "./components/ActionHeader";
import { ScenarioGridLayout } from "./tree-grid/config/layout";
import { useTreeGridInit } from "./tree-grid/hooks/useTreeGridInit";
import { mapScenariosToGridBody } from "./tree-grid/utils/data-mapper";

const gridId = "ScenarioGrid";
const gridContainerId = "TreeGrid_" + gridId;

const ScenarioBuilderPage = () => {
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);

  const { data: scenariosData } = useListScenarios({
    search: searchTerm,
    filter: {},
    page_size: 20,
    skip: 0,
  });

  const gridData = useMemo(() => {
    if (!scenariosData) return null;
    return mapScenariosToGridBody(scenariosData?.scenarios);
  }, [scenariosData]);

  console.log("gridData", gridData);

  useTreeGridInit(gridId, gridContainerId, ScenarioGridLayout, gridData);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 1,
        overflow: "hidden",
        bgcolor: "brand.background",
        height: "100%",
      }}
    >
      <ActionHeader onSearch={setSearchTerm} />

      <Box
        sx={{
          flex: 1,
          p: 2,
          display: "flex",
          flexDirection: "column",
          minHeight: 0, // Ensure flex child can shrink/fill correctly
        }}
      >
        <Box
          id={gridContainerId}
          sx={{
            width: "100%",
            height: "calc(100vh - 160px)", // Adjusted slightly
            backgroundColor: "background.paper",
            borderRadius: 1,
          }}
        />
      </Box>
    </Box>
  );
};

export default ScenarioBuilderPage;
