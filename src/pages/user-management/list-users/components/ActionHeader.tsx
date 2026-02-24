import AddIcon from "@/assets/actions/add.svg?react";
import DeleteIcon from "@/assets/actions/delete.svg?react";
import StatusFilter from "@/assets/user-management/status-filter.svg?react";
import StatusUpdate from "@/assets/user-management/status-update.svg?react";
import SearchTextField from "@/components/common/SearchTextField";
import { Box, Button, MenuItem, Select, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const ActionHeader = ({
  status,
  loading,
  selectedCount = 0,
  onSearch,
  onDelete,
  onStatusChange,
  onStatusUpdate,
}: {
  status: string | undefined;
  loading: boolean;
  selectedCount: number;
  onSearch: (val: string) => void;
  onDelete: () => void;
  onStatusChange: (status: string) => void;
  onStatusUpdate: () => void;
}) => {
  const navigate = useNavigate();

  const handleNavigate = () => navigate("/user-management/create-user");
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        pt: 2,
      }}
    >
      <SearchTextField onSearch={onSearch} />

      <Stack direction="row" spacing={1} alignItems="center">
        {selectedCount > 0 && (
          <>
            <Button
              variant="contained"
              startIcon={<DeleteIcon />}
              onClick={onDelete}
              disabled={loading}
              sx={{ color: "error.contrastText" }}
            >
              Delete Selection ({selectedCount})
            </Button>
            <Button
              variant="contained"
              startIcon={<StatusUpdate />}
              onClick={onStatusUpdate}
              disabled={loading}
            >
              Bulk Status Update ({selectedCount})
            </Button>
          </>
        )}

        <Select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          variant="filled"
          disableUnderline
          displayEmpty
          renderValue={() => (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <StatusFilter />
              Status Filter
            </Box>
          )}
        >
          <MenuItem value={undefined}>All</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="suspended">Suspended</MenuItem>
          <MenuItem value="invited">Invited</MenuItem>
        </Select>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNavigate}
        >
          Add New User
        </Button>
      </Stack>
    </Box>
  );
};

export default ActionHeader;
