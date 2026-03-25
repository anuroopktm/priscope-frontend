import { Box, Drawer } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import DrawerActionHeader from "./components/DrawerActionHeader";
import DrawerHeader from "./components/DrawerHeader";
import ItemsMasterGrid from "./tree-grid";

interface ItemsMasterDrawerProps {
  open: boolean;
  onClose: () => void;
  onAddItems: (
    items: any[],
    isGroup: boolean,
    selectedHeaders: string[],
  ) => void;
}

const ItemsMasterDrawer = ({
  open,
  onClose,
  onAddItems,
}: ItemsMasterDrawerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const gridRef = useRef<{
    getSelectedIds: () => string[];
    getSelectedRows: () => any[];
  } | null>(null);

  useEffect(() => {
    if (open) {
      setSearchTerm("");
    }
  }, [open]);

  const handleClose = (
    _event: {},
    reason: "backdropClick" | "escapeKeyDown",
  ) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") return;
    onClose();
  };

  const isButtonsDisabled = false;

  const handleAddItem = () => {
    if (isButtonsDisabled) return;
    const items = gridRef.current?.getSelectedRows() || [];
    if (items.length === 0) return;
    onAddItems(items, false, selectedColumns);
  };

  const handleAddAsGroup = () => {
    if (isButtonsDisabled) return;
    const items = gridRef.current?.getSelectedRows() || [];
    if (items.length === 0) return;
    onAddItems(items, true, selectedColumns);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      sx={{
        zIndex: 1500,
      }}
      PaperProps={{
        sx: {
          width: "95vw",
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
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          onAddItem={handleAddItem}
          onAddAsGroup={handleAddAsGroup}
          selectedColumns={selectedColumns}
          onSelectedColumnsChange={setSelectedColumns}
          isButtonsDisabled={isButtonsDisabled}
        />

        {open && (
          <ItemsMasterGrid
            ref={gridRef}
            searchTerm={searchTerm}
            selectedColumns={selectedColumns}
          />
        )}
      </Box>
    </Drawer>
  );
};

export default ItemsMasterDrawer;
