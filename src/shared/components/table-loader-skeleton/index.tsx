import React from "react";
import {
  TableBody,
  TableCell,
  TableRow,
  Skeleton,
} from "@mui/material";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  columnWidths?: string[];
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 5,
  columnWidths = [],
}) => {
  // Default column widths if not provided
  const defaultWidths = ["60%", "80%", "40%", "30%", "50%"];
  const widths = columnWidths.length > 0 ? columnWidths : defaultWidths;

  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={`skeleton-row-${rowIndex}`}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={`skeleton-cell-${rowIndex}-${colIndex}`}>
              <Skeleton 
                animation="wave" 
                width={widths[colIndex] || "60%"} 
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default TableSkeleton; 