export const handleFilterChange = (
  grid: TGrid,
  setFilter: React.Dispatch<React.SetStateAction<Record<string, string[]>>>,
) => {
  const filters = grid?.GetFilter();
  console.log(filters, "filterssssssssssssssssss");
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
  console.log(data, "datassssssssssssssss in filter");
  setFilter(data);
  return true;
};
