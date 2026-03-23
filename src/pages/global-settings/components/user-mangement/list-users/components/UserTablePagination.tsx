import { Box, Pagination, Typography } from "@mui/material";

export const UserTablePagination = ({
  count = 10,
  page = 1,
  rowsPerPage = 10,
  onPageChange,
}: {
  count?: number;
  page?: number;
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
}) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "flex-end",
      mt: 2,
      alignItems: "center",
      gap: 2,
    }}
  >
    <Typography variant="body2" sx={{ color: "text.secondary" }}>
      Rows per page: {rowsPerPage}
    </Typography>
    <Pagination
      count={count}
      page={page}
      onChange={(_, p) => onPageChange?.(p)}
      shape="rounded"
      size="small"
    />
  </Box>
);
