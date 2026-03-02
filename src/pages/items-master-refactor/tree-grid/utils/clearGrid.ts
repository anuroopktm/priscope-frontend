import { useItemMasterStore } from "../../store/useItemMasterStore";

export const handleClearAllFilters = () => {
  const { gridRef, setFilter } = useItemMasterStore.getState();

  if (gridRef) {
    gridRef.ChangeFilter("", "", "", "0", 0);
  }

  setFilter({});
};
