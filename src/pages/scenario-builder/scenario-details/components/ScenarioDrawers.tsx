import { Box } from "@mui/material";
import { useShallow } from "zustand/react/shallow";
import { handleAggregatorUpdate } from "../actions/aggregatorHandlers";
import { useScenarioStore } from "../store/useScenarioStore";
import ComponentAggregatorDrawer from "./drawers/ComponentAggregatorDrawer";
import CostAggregatorDrawer from "./drawers/CostAggregatorDrawer";
import MarginMarkupDrawer from "./drawers/MarginMarkupDrawer";

interface ScenarioDrawersProps {
  gridId: string;
  scenarioId?: string;
  onSaveAsDraft?: () => void;
}

const ScenarioDrawers = ({
  gridId,
  scenarioId,
  onSaveAsDraft,
}: ScenarioDrawersProps) => {
  const {
    isAggregatorDrawerOpen,
    setIsAggregatorDrawerOpen,
    activeCell,
    setActiveCell,
  } = useScenarioStore(
    useShallow((state) => ({
      isAggregatorDrawerOpen: state.isAggregatorDrawerOpen,
      setIsAggregatorDrawerOpen: state.setIsAggregatorDrawerOpen,
      activeCell: state.activeCell,
      setActiveCell: state.setActiveCell,
    })),
  );

  const handleUpdate = (items: any[]) => {
    handleAggregatorUpdate({ gridId }, items);
    setTimeout(() => {
      onSaveAsDraft?.();
    }, 100);
  };

  const handleClose = () => {
    setIsAggregatorDrawerOpen(false);
    setActiveCell(null);
  };

  return (
    <>
      {isAggregatorDrawerOpen && activeCell && (
        <Box
          sx={{
            flexShrink: 0,
            maxHeight: 380,
            height: "auto",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            px: 2,
            transition: "all 0.3s ease-in-out",
          }}
        >
          {activeCell.type === "Cost" ? (
            <CostAggregatorDrawer
              initialItems={activeCell.items}
              mainRowId={activeCell.rowId}
              onClose={handleClose}
              onUpdate={handleUpdate}
              scenarioId={scenarioId}
              cellId={`${activeCell.rowId}_${activeCell.col}`}
            />
          ) : activeCell.type === "Margin" || activeCell.type === "Markup" ? (
            <MarginMarkupDrawer
              type={activeCell.type as "Margin" | "Markup"}
              initialItems={activeCell.items}
              mainRowId={activeCell.rowId}
              onClose={handleClose}
              onUpdate={handleUpdate}
            />
          ) : (
            <ComponentAggregatorDrawer
              initialItems={activeCell.items}
              onClose={handleClose}
              onUpdate={handleUpdate}
              scenarioId={scenarioId}
              cellId={`${activeCell.rowId}_${activeCell.col}`}
              mainRowId={activeCell.rowId}
            />
          )}
        </Box>
      )}
    </>
  );
};

export default ScenarioDrawers;
