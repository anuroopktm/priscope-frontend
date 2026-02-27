import AddIcon from "@/assets/actions/add.svg?react";
import SearchTextField from "@/components/common/SearchTextField";
import GridViewIcon from "@mui/icons-material/GridView";
import { Box, Button, Stack } from "@mui/material";

interface DrawerActionHeaderProps {
  onSearch: (value: string) => void;
  onAddItem?: () => void;
  onAddAsGroup?: () => void;
}

const DrawerActionHeader = ({
  onSearch,
  onAddItem,
  onAddAsGroup,
}: DrawerActionHeaderProps) => {
  return (
    <Box
      sx={{
        p: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: "#E8E8E8",
        borderRadius: 0.5,
        mb: 2,
      }}
    >
      <SearchTextField
        size="small"
        onSearch={onSearch}
        sx={{
          "& .MuiOutlinedInput-root": {
            bgcolor: "#E8E8E8",
            color: "text.primary",
            "& .MuiInputAdornment-root svg path": {
              stroke: (theme) => theme.palette.brand.primary,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#E8E8E8 !important",
            },
          },
        }}
      />
      <Stack direction="row" spacing={1.5}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<GridViewIcon />}
          onClick={onAddAsGroup}
          sx={{
            borderColor: "primary.main",
            color: "primary.main",
            bgcolor: "white",
          }}
        >
          Add as Group
        </Button>
        <Button
          size="small"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddItem}
        >
          Add Item
        </Button>
      </Stack>
    </Box>
  );
};

export default DrawerActionHeader;
