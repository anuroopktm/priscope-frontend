import {
  AddOutlined,
  BookmarkBorderOutlined,
  DescriptionOutlined,
  FilterListOutlined,
  KeyboardArrowDown,
  Search,
  StorageOutlined,
} from "@mui/icons-material";
import { Box, Button, InputAdornment, Stack, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";

export const ActionHeader = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  // Select states for dropdowns if needed, for UI just use buttons for visual match
  // Or implement Selects to show functionality

  // Common Select Style for header items if we convert them to Select components
  // For now using Button visually to match the "Action Header" requirement

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundImage: theme.palette.brand.background_gradient,
        pt: 2,
        px: 2,
      }}
    >
      {/* Left: Search Bar */}
      <TextField
        variant="outlined"
        placeholder="Search"
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          width: 250,
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ ml: 1, mr: 0.5 }}>
              <Search sx={{ color: "rgba(0, 0, 0, 0.54)", fontSize: 20 }} />
            </InputAdornment>
          ),
        }}
      />

      {/* Right: Actions */}
      <Stack direction="row" spacing={1} alignItems="center">
        {/* Files */}
        <Button startIcon={<DescriptionOutlined />}>Files</Button>

        {/* Columns Dropdown Mock */}
        <Button endIcon={<KeyboardArrowDown />}>Columns</Button>

        {/* Saved Filters Dropdown Mock */}
        <Button
          startIcon={<BookmarkBorderOutlined />}
          endIcon={<KeyboardArrowDown />}
        >
          Saved Filters
        </Button>

        {/* Show Filter */}
        <Button startIcon={<FilterListOutlined />}>Show Filter</Button>

        {/* Add Item */}
        <Button startIcon={<AddOutlined />}>Add Item</Button>

        {/* Import Data Dropdown */}
        <Button
          variant="contained"
          startIcon={<StorageOutlined />}
          endIcon={<KeyboardArrowDown />}
        >
          Import Data
        </Button>
      </Stack>
    </Box>
  );
};
