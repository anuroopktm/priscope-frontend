import SearchTextField from "@/components/common/SearchTextField";
import { AddOutlined, KeyboardArrowDown } from "@mui/icons-material";
import { Box, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const ActionHeader = ({
  onSearch,
  onStatus,
}: {
  onSearch?: (val: string) => void;
  onStatus?: (val: string) => void;
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
        px: 2,
      }}
    >
      <SearchTextField
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onSearch?.(e.target.value)
        }
      />

      <Stack direction="row" spacing={1} alignItems="center">
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
