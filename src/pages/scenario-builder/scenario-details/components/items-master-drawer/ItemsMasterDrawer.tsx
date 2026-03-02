import { Box, Drawer } from "@mui/material";
import { useRef, useState } from "react";
import DrawerActionHeader from "./components/DrawerActionHeader";
import DrawerHeader from "./components/DrawerHeader";
import ItemsMasterGrid from "./tree-grid";

interface ItemsMasterDrawerProps {
  open: boolean;
  onClose: () => void;
}

const ItemsMasterDrawer = ({ open, onClose }: ItemsMasterDrawerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const gridRef = useRef<{ getSelectedIds: () => string[] } | null>(null);

  const handleClose = (
    _event: {},
    reason: "backdropClick" | "escapeKeyDown",
  ) => {
    if (reason === "backdropClick") return;
    onClose();
  };

  const handleAddItem = () => {
    const ids = gridRef.current?.getSelectedIds() || [];
    console.log("Add Item clicked. Selected IDs:", ids);
  };

  const handleAddAsGroup = () => {
    const ids = gridRef.current?.getSelectedIds() || [];
    console.log("Add as Group clicked. Selected IDs:", ids);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      sx={{
        zIndex: 3000,
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
          onAddItem={handleAddItem}
          onAddAsGroup={handleAddAsGroup}
        />

        {open && <ItemsMasterGrid ref={gridRef} searchTerm={searchTerm} />}
      </Box>
    </Drawer>
  );
};

export default ItemsMasterDrawer;
