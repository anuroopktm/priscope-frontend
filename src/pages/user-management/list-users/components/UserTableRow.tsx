import type { User } from "@/services/user-management/user-management.types";
import { Checkbox, Chip, TableCell, TableRow, useTheme } from "@mui/material";

const getStatusColor = (status: "active" | "suspended" | "invited") => {
  const map: Record<string, "success" | "error" | "warning" | "default"> = {
    active: "success",
    suspended: "error",
    invited: "warning",
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
      <TableCell>{row.email}</TableCell>
      <TableCell>{row.job_designation}</TableCell>
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
