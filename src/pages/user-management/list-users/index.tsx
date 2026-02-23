import {
  useBulkDeleteUsers,
  useBulkStatusUpdate,
  useGetUsers,
} from "@/services/user-management/user-management.queries";
import type { User } from "@/services/user-management/user-management.types";
import { useToastStore } from "@/store/useToastStore";
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
import { useNavigate } from "react-router-dom";
import { ActionHeader } from "./components/ActionHeader";
import StatusUpdateModal from "./components/StatusUpdateModal";
import { UserTableHead } from "./components/UserTableHead";
import { UserTablePagination } from "./components/UserTablePagination";
import { UserTableRow } from "./components/UserTableRow";

const UserManagementListUsersPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);

  const [pageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);

  const { data, isLoading } = useGetUsers({
    page_size: pageSize,
    search,
    skip: (page - 1) * pageSize,
    tenant_id: import.meta.env.VITE_TENANT_ID,
  });

  const { mutate: bulkDelete, isPending: isDeleting } = useBulkDeleteUsers();
  const { mutate: bulkStatusUpdate, isPending: isUpdating } =
    useBulkStatusUpdate();

  const users = data?.users || [];
  const totalCount = data?.count || 0;
  const pageCount = Math.ceil(totalCount / pageSize);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(users.map((user) => user.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const handleRowClick = (id: string) => {
    navigate(`/user-management/user-details/${id}`);
  };

  const handleDelete = () => {
    if (selectedIds.length === 0) return;

    bulkDelete(
      { user_ids: selectedIds },
      {
        onSuccess: (response) => {
          showToast(
            response.message || "Users deleted successfully",
            "success",
          );
          setSelectedIds([]);
        },
        onError: (error) => {
          showToast(
            error.response?.data?.detail || "Failed to delete users",
            "error",
          );
        },
      },
    );
  };

  const handleBulkStatusUpdate = (value: string) => {
    if (selectedIds.length === 0) return;

    bulkStatusUpdate(
      {
        status: value,
        user_ids: selectedIds,
      },
      {
        onSuccess: (response) => {
          showToast(response.message, "success");
          setShowStatusModal(false);
          setSelectedIds([]);
        },
        onError: (error) => {
          showToast(
            error.response?.data?.detail || "Failed to update status",
            "error",
          );
        },
      },
    );
  };

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
        selectedCount={selectedIds.length}
        onDelete={handleDelete}
        onStatusUpdate={() => setShowStatusModal(true)}
        loading={isDeleting || isUpdating}
        onSearch={(val) => {
          setSearch(val);
          setPage(1);
        }}
      />

      <Box sx={{ p: 2, flex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            flexDirection: "column",
            p: 2,
            height: "calc(100vh - 144px)",
          }}
        >
          <TableContainer sx={{ borderRadius: 2, border: "1px solid #E8E8E8" }}>
            <Table stickyHeader>
              <UserTableHead
                onSelectAll={handleSelectAll}
                checked={
                  users.length > 0 && selectedIds.length === users.length
                }
                indeterminate={
                  selectedIds.length > 0 && selectedIds.length < users.length
                }
              />
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
                  users.map((row: User) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      selected={selectedIds.includes(row.id)}
                      onSelect={(checked) => handleSelectRow(row.id, checked)}
                      onClick={() => handleRowClick(row.id)}
                    />
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

      <StatusUpdateModal
        open={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onChange={handleBulkStatusUpdate}
        isLoading={isUpdating}
      />
    </Box>
  );
};

export default UserManagementListUsersPage;
