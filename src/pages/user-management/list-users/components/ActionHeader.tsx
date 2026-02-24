import SearchTextField from "@/components/common/SearchTextField";
import {
  AddOutlined,
  DeleteOutline,
  EditOutlined,
  KeyboardArrowDown,
} from "@mui/icons-material";
import { Box, Button, Stack, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const ActionHeader = ({
  onSearch,
  selectedCount = 0,
  onDelete,
  onStatusUpdate,
  loading,
}: {
  onSearch?: (val: string) => void;
  selectedCount?: number;
  onDelete?: () => void;
  onStatusUpdate?: () => void;
  loading?: boolean;
}) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleNavigate = () => navigate("/user-management/create-user");
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        pt: 2,
        px: 2,
      }}
    >
      <SearchTextField
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onSearch?.(e.target.value)
        }
      />

      <Stack direction="row" spacing={1} alignItems="center">
        {selectedCount > 0 && (
          <>
            <Button
              variant="outlined"
              startIcon={<DeleteOutline />}
              onClick={onDelete}
              disabled={loading}
              sx={{ color: theme.palette.error.contrastText }}
            >
              Delete Selection ({selectedCount})
            </Button>
            <Button
              variant="outlined"
              startIcon={<EditOutlined />}
              onClick={onStatusUpdate}
              disabled={loading}
            >
              Bulk Status Update ({selectedCount})
            </Button>
          </>
        )}
        <Button endIcon={<KeyboardArrowDown />}>Status Filter</Button>
        <Button
          variant="contained"
          startIcon={<AddOutlined />}
          onClick={handleNavigate}
        >
          Add New User
        </Button>
      </Stack>
    </Box>
  );
};

export default ActionHeader;
