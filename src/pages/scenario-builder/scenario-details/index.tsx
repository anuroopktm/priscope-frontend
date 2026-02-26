import { useGetScenario } from "@/services/queries/scenario-builder/scenario-builder.queries";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { useTreeGridInit } from "../tree-grid/hooks/useTreeGridInit";
import ActionHeader from "./components/ActionHeader";
import { ScenarioDetailsLayout } from "./tree-grid/config/details-layout";
import { ScenarioDetailsDummyData } from "./tree-grid/utils/dummy-data";

const gridId = "ScenarioGridDetails";
const gridContainerId = "TreeGrid_" + gridId;

const ScenarioDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: scenario } = useGetScenario(id);

  useTreeGridInit(
    gridId,
    gridContainerId,
    ScenarioDetailsLayout,
    ScenarioDetailsDummyData,
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        bgcolor: "brand.background",
      }}
    >
      <ActionHeader title={scenario?.name} />

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          p: 2,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            borderRadius: 1,
            p: 2,
            bgcolor: "background.paper",
          }}
        >
          <Box
            id={gridContainerId}
            sx={{
              height: "100%",
              width: "100%",
              borderRadius: 1,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ScenarioDetailsPage;
