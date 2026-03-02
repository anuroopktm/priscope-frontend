import { Box, Drawer } from "@mui/material";
import { useRef, useState } from "react";
import DrawerActionHeader from "./components/DrawerActionHeader";
import DrawerHeader from "./components/DrawerHeader";
import ItemsMasterGrid from "./tree-grid";

interface ItemsMasterDrawerProps {
  open: boolean;
  onClose: () => void;
  onAddItems: (items: any[], isGroup: boolean) => void;
}

const ItemsMasterDrawer = ({
  open,
  onClose,
  onAddItems,
}: ItemsMasterDrawerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const gridRef = useRef<{
    getSelectedIds: () => string[];
    getSelectedRows: () => any[];
  } | null>(null);

  const handleClose = (
    _event: {},
    reason: "backdropClick" | "escapeKeyDown",
  ) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") return;
    onClose();
  };

  const handleAddItem = () => {
    const items = gridRef.current?.getSelectedRows() || [];
    onAddItems(items, false);
  };

  const handleAddAsGroup = () => {
    const items = gridRef.current?.getSelectedRows() || [];
    if (items.length === 0) return;
    onAddItems(items, true);
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
