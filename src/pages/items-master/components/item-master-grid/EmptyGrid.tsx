import TreeGrid from "@/shared/components/treegrid";
import { TreeGridProps } from "@/shared/types/treegrid.types";
import React from "react";
interface CustomTreeGridProps extends TreeGridProps {}
const AddNewGrid: React.FC<CustomTreeGridProps> = (Props) => {
  return <TreeGrid {...Props} />;
};

export default AddNewGrid;
