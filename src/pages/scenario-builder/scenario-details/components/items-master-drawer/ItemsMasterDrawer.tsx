import { Box, Drawer } from "@mui/material";
import { useState } from "react";
import DrawerActionHeader from "./components/DrawerActionHeader";
import DrawerHeader from "./components/DrawerHeader";
import ItemsMasterGrid from "./components/ItemsMasterGrid";

interface ItemsMasterDrawerProps {
  open: boolean;
  onClose: () => void;
}

const ItemsMasterDrawer = ({ open, onClose }: ItemsMasterDrawerProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        zIndex: 3000, // Explicitly high z-index to clear any headers or fixed elements
      }}
      PaperProps={{
        sx: {
          width: "90vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "white",
        },
      }}
    >
      <DrawerHeader title="Items Master" onClose={onClose} />

      <Box
        sx={{
          flex: 1,
          p: 3,
          pt: 0,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          bgcolor: "white",
        }}
      >
        <DrawerActionHeader
          onSearch={setSearchTerm}
          onAddItem={() => console.log("Add Item clicked")}
          onAddAsGroup={() => console.log("Add as Group clicked")}
        />

        {open && <ItemsMasterGrid searchTerm={searchTerm} />}
      </Box>
    </Drawer>
  );
};

export default ItemsMasterDrawer;
