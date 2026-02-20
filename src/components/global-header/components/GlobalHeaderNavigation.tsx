import {
  BuildOutlined,
  Inventory2Outlined,
  KeyboardArrowDown,
  LibraryBooksOutlined,
  ManageAccountsOutlined,
  PersonOutline,
} from "@mui/icons-material";
import { Box, Button, MenuItem, Select, Stack } from "@mui/material";
import { useState } from "react";

export const GlobalHeaderNavigation = () => {
  const [rateLib, setRateLib] = useState("rate-libraries");
  const [builder, setBuilder] = useState("builder");

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Button variant="text" startIcon={<Inventory2Outlined />}>
        Items Master
      </Button>

      <Select
        value={rateLib}
        onChange={(e) => setRateLib(e.target.value)}
        variant="standard"
        disableUnderline
        IconComponent={KeyboardArrowDown}
        displayEmpty
        renderValue={() => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LibraryBooksOutlined fontSize="small" />
            Rate Libraries
          </Box>
        )}
      >
        <MenuItem value="rate-libraries">Rate Libraries</MenuItem>
        <MenuItem value="option-1">Option 1</MenuItem>
      </Select>

      <Button startIcon={<ManageAccountsOutlined />}>Supplier Card</Button>

      <Button startIcon={<PersonOutline />}>Customer Card</Button>

      <Select
        value={builder}
        onChange={(e) => setBuilder(e.target.value)}
        variant="standard"
        disableUnderline
        IconComponent={KeyboardArrowDown}
        displayEmpty
        renderValue={() => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BuildOutlined fontSize="small" />
            Builder
          </Box>
        )}
      >
        <MenuItem value="builder">Builder</MenuItem>
        <MenuItem value="option-1">Option 1</MenuItem>
      </Select>
    </Stack>
  );
};
