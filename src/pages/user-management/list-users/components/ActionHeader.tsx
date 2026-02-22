import SearchTextField from "@/components/common/SearchTextField";
import { AddOutlined, KeyboardArrowDown } from "@mui/icons-material";
import { Box, Button, Stack } from "@mui/material";

export const ActionHeader = ({
  onSearch,
  onStatus,
}: {
  onSearch?: (val: string) => void;
  onStatus?: (val: string) => void;
}) => {
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
        <Button variant="contained" startIcon={<AddOutlined />}>
          Add New User
        </Button>
      </Stack>
    </Box>
  );
};

export default ActionHeader;
