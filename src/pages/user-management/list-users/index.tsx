import { useGetUsers } from "@/services/user-management/user-management.queries";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { ActionHeader } from "./components/ActionHeader";
import { UserTableHead } from "./components/UserTableHead";
import { UserTablePagination } from "./components/UserTablePagination";
import { UserTableRow } from "./components/UserTableRow";

const UserManagementListUsersPage = () => {
  const theme = useTheme();
  const [pageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");

  const { data, isLoading } = useGetUsers({
    page_size: pageSize,
    search,
    skip: (page - 1) * pageSize,
    status,
    // tenant_id: localStorage.getItem("tenant_id") || "",
    tenant_id: import.meta.env.VITE_TENANT_ID,
  });

  const users = data?.users || [];
  const totalCount = data?.count || 0;
  const pageCount = Math.ceil(totalCount / pageSize);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 1,
        overflow: "hidden",
        bgcolor: theme.palette.brand.background,
      }}
    >
      <ActionHeader
        onSearch={(val) => {
          setSearch(val);
          setPage(1);
        }}
        onStatus={(val) => {
          setStatus(val);
          setPage(1);
        }}
      />

      <Box sx={{ p: 2, flex: 1 }}>
        <Paper elevation={0} sx={{ p: 2, height: "calc(100vh - 144px)" }}>
          <TableContainer sx={{ borderRadius: 2, border: "1px solid #E8E8E8" }}>
            <Table>
              <UserTableHead />
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((row: any, idx: number) => (
                    <UserTableRow key={idx} row={row} />
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <UserTablePagination
            count={pageCount}
            page={page}
            rowsPerPage={pageSize}
            onPageChange={(p) => setPage(p)}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default UserManagementListUsersPage;
