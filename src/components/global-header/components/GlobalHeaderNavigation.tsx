import BookOpenIcon from "@/assets/global-header/book-open.svg?react";
import ItemsMasterIcon from "@/assets/global-header/package.svg?react";
import SupplierCardIcon from "@/assets/global-header/user-settings.svg?react";
import { BuildOutlined } from "@mui/icons-material";
import { Box, Button, MenuItem, Select, Stack } from "@mui/material";
import { useState } from "react";

export const GlobalHeaderNavigation = () => {
  const [rateLib, setRateLib] = useState("rate-libraries");
  const [builder, setBuilder] = useState("builder");

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Button variant="contained" startIcon={<ItemsMasterIcon />}>
        Items Master
      </Button>

      <Select
        value={rateLib}
        onChange={(e) => setRateLib(e.target.value)}
        variant="filled"
        size="small"
        disableUnderline
        displayEmpty
        renderValue={() => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BookOpenIcon />
            Rate Libraries
          </Box>
        )}
      >
        <MenuItem value="rate-libraries">Rate Libraries</MenuItem>
        <MenuItem value="option-1">Option 1</MenuItem>
      </Select>

      <Button variant="contained" startIcon={<SupplierCardIcon />}>
        Supplier Card
      </Button>

      <Button variant="contained" startIcon={<SupplierCardIcon />}>
        Customer Card
      </Button>

      <Select
        value={builder}
        onChange={(e) => setBuilder(e.target.value)}
        variant="filled"
        disableUnderline
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
