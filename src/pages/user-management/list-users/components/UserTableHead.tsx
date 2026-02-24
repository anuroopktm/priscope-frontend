import {
  Checkbox,
  TableCell,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";

const COLUMNS = ["Name", "Email", "Job Role", "Status"];

export const UserTableHead = ({
  onSelectAll,
  checked,
  indeterminate,
}: {
  onSelectAll: (checked: boolean) => void;
  checked: boolean;
  indeterminate?: boolean;
}) => {
  const theme = useTheme();

  return (
    <TableHead sx={{ bgcolor: "#F2F2F2" }}>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            checked={checked}
            indeterminate={indeterminate}
            onChange={(e) => onSelectAll(e.target.checked)}
          />
        </TableCell>
        {COLUMNS.map((col) => (
          <TableCell
            key={col}
            sx={{ color: theme.palette.brand.primary, fontWeight: 500 }}
          >
            {col}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
