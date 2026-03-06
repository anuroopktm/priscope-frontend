import { Box } from "@mui/material";
import { useShallow } from "zustand/react/shallow";
import { handleAggregatorUpdate } from "../actions/aggregatorHandlers";
import { useScenarioStore } from "../store/useScenarioStore";
import ComponentAggregatorDrawer from "./drawers/ComponentAggregatorDrawer";
import CostAggregatorDrawer from "./drawers/CostAggregatorDrawer";
import MarginMarkupDrawer from "./drawers/MarginMarkupDrawer";

interface ScenarioDrawersProps {
  gridId: string;
}

const ScenarioDrawers = ({ gridId }: ScenarioDrawersProps) => {
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

  if (!isAggregatorDrawerOpen || !activeCell) return null;

  const handleUpdate = (items: any[]) =>
    handleAggregatorUpdate({ gridId }, items);

  const handleClose = () => {
    setIsAggregatorDrawerOpen(false);
    setActiveCell(null);
  };

  return (
    <Box
      sx={{
        flex: 0.5,
        minHeight: 0,
        width: "100%",
        px: 2,
        transition: "flex 0.3s ease-in-out",
      }}
    >
      {activeCell.type === "Cost" ? (
        <CostAggregatorDrawer
          initialItems={activeCell.items}
          mainRowId={activeCell.rowId}
          onClose={handleClose}
          onUpdate={handleUpdate}
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
        />
      )}
    </Box>
  );
};

export default ScenarioDrawers;
