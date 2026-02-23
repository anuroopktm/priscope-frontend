import type { User } from "@/services/user-management/user-management.types";
import { Checkbox, Chip, TableCell, TableRow, useTheme } from "@mui/material";

const getStatusColor = (status: "ACTIVE" | "SUSPENDED" | "INVITED") => {
  const map: Record<string, "success" | "error" | "warning" | "default"> = {
    ACTIVE: "success",
    SUSPENDED: "error",
    INVITED: "warning",
  };
  return map[status] || "default";
};

export const UserTableRow = ({ row }: { row: User }) => {
  const theme = useTheme();
  return (
    <TableRow hover>
      <TableCell padding="checkbox">
        <Checkbox />
      </TableCell>
      <TableCell>{row.name}</TableCell>
      <TableCell>{row.job_designation}</TableCell>
      <TableCell>-</TableCell>
      <TableCell sx={{ color: theme.palette.brand.primary }}>
        <Chip
          label={row.status}
          size="small"
          color={getStatusColor(row.status)}
          variant="outlined"
        />
      </TableCell>
    </TableRow>
  );
};
