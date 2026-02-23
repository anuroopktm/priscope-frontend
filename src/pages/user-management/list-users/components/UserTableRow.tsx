import type { User } from "@/services/user-management/user-management.types";
import { Checkbox, Chip, TableCell, TableRow } from "@mui/material";

const getStatusColor = (status: "active" | "suspended" | "invited") => {
  const map: Record<string, "success" | "error" | "warning" | "default"> = {
    active: "success",
    suspended: "error",
    invited: "warning",
  };
  return map[status] || "default";
};

export const UserTableRow = ({
  row,
  selected,
  onSelect,
  onClick,
}: {
  row: User;
  selected: boolean;
  onSelect: (checked: boolean) => void;
  onClick: () => void;
}) => {
  return (
    <TableRow
      hover
      sx={{ cursor: "pointer" }}
      selected={selected}
      onClick={onClick}
    >
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(!selected);
          }}
        />
      </TableCell>
      <TableCell>{row.name}</TableCell>
      <TableCell>{row.email}</TableCell>
      <TableCell>{row.job_designation}</TableCell>
      <TableCell>
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
