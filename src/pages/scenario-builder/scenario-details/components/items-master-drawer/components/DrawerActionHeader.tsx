import AddIcon from "@/assets/actions/add.svg?react";
import SearchTextField from "@/components/common/SearchTextField";
import { useListHeaders } from "@/services/queries/item-master-refactor/item-master-refactor.queries";
import GridViewIcon from "@mui/icons-material/GridView";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
} from "@mui/material";

interface DrawerActionHeaderProps {
  onSearch: (value: string) => void;
  onAddItem?: () => void;
  onAddAsGroup?: () => void;
  selectedColumns: string[];
  onSelectedColumnsChange: (columns: string[]) => void;
  isButtonsDisabled?: boolean;
}

const DrawerActionHeader = ({
  onSearch,
  onAddItem,
  onAddAsGroup,
  selectedColumns,
  onSelectedColumnsChange,
  isButtonsDisabled,
}: DrawerActionHeaderProps) => {
  const { data: headerData } = useListHeaders({
    page_size: 1000,
    search: "",
    skip: 0,
  });

  const headers = headerData?.headers || [];

  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;
    const newSelected = typeof value === "string" ? value.split(",") : value;

    onSelectedColumnsChange(newSelected);
  };

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
      <Stack direction="row" spacing={3} sx={{ flex: 1, alignItems: "center" }}>
        <SearchTextField
          size="small"
          onSearch={onSearch}
          containerSx={{ bgcolor: "white", px: 0 }}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "white",
              color: "text.primary",
              "& .MuiInputAdornment-root svg path": {
                stroke: (theme: any) => theme.palette.brand.primary,
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#E8E8E8 !important",
              },
            },
          }}
        />
      </Stack>
      <Stack direction="row" spacing={2}>
        <FormControl sx={{ minWidth: 260 }} size="small">
          <Select
            size="small"
            multiple
            displayEmpty
            value={selectedColumns}
            onChange={handleChange}
            input={<OutlinedInput size="small" />}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <Typography variant="body2">Select Columns</Typography>;
              }
              const selectedLabels = headers
                .filter((h) => selected.includes(h.name))
                .map((h) => h.label);
              return (
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {selectedLabels.length} columns selected
                </Typography>
              );
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: 300,
                },
              },
              slotProps: {
                root: {
                  sx: { zIndex: 1600 },
                },
              },
            }}
          >
            {headers.map((header) => (
              <MenuItem
                key={header.id}
                value={header.name}
                sx={{
                  "&.Mui-selected": {
                    color: "brand.primary",
                    backgroundColor: "rgba(0,0,0,0.04)",
                  },
                  "&.Mui-selected:hover": {
                    color: "brand.primary",
                    backgroundColor: "rgba(0,0,0,0.08)",
                  },
                }}
              >
                <Checkbox
                  size="small"
                  checked={selectedColumns.indexOf(header.name) > -1}
                  sx={{ p: 0.5, mr: 1 }}
                />
                <ListItemText
                  primary={header.label}
                  primaryTypographyProps={{ variant: "body2" }}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          size="small"
          variant="outlined"
          startIcon={<GridViewIcon />}
          onClick={onAddAsGroup}
          disabled={isButtonsDisabled}
        >
          Group
        </Button>
        <Button
          size="small"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddItem}
          disabled={isButtonsDisabled}
        >
          Item
        </Button>
      </Stack>
    </Box>
  );
};

export default DrawerActionHeader;
