import {
  Checkbox,
  TableCell,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";

const COLUMNS = ["Name", "Position", "Start Date", "Status"];

export const UserTableHead = () => {
  const theme = useTheme();

  return (
    <TableHead sx={{ bgcolor: "#F2F2F2" }}>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox />
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
