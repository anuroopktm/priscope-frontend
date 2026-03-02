import { useItemMasterStore } from "../../store/useItemMasterStore";

export const handleFilterChange = () => {
  const { gridRef, setFilter } = useItemMasterStore.getState();
  const filters = gridRef?.GetFilter();
  const data = filters?.reduce(
    (acc, [key, value]) => {
      if (!acc[key]) acc[key] = [];
      if (typeof value === "string") {
        const valueArray = value.split(";").map((v) => v.trim());
        acc[key].push(...valueArray);
      } else if (typeof value === "number" || typeof value === "boolean") {
        acc[key].push(String(value));
      }
      return acc;
    },
    {} as Record<string, string[]>,
  );
  setFilter(data);
  return true;
};
