import CloseIcon from "@mui/icons-material/Close";
import { Box, Drawer, IconButton, Typography } from "@mui/material";
import { useTreeGridInit } from "../../tree-grid/hooks/useTreeGridInit";

interface ItemsMasterDrawerProps {
  open: boolean;
  onClose: () => void;
}

const gridId = "ItemsMasterGrid";
const gridContainerId = "TreeGrid_" + gridId;

// Basic layout for Items Master
const ItemsMasterLayout = {
  Cfg: {
    CfgId: "ItemsMasterGrid",
    MainCol: "A",
    Style: "White",
    ReloadChanged: "1",
    Paging: "0",
    MaxHeight: "1",
    MinTagHeight: "500",
    RelHeight: "1",
    StretchWidth: "1",
    StretchHeight: "1",
    Toolbar: "0",
    Sorting: "0",
    Selecting: "1",
  },
  Cols: [
    { Name: "A", RelWidth: "1", Type: "Text", Caption: "Item Code" },
    { Name: "B", RelWidth: "1", Type: "Text", Caption: "Description" },
    { Name: "C", RelWidth: "1", Type: "Text", Caption: "Category" },
    {
      Name: "D",
      RelWidth: "1",
      Type: "Float",
      Format: "0.00",
      Caption: "Price",
    },
  ],
  Header: {
    A: "Item Code",
    B: "Description",
    C: "Category",
    D: "Price",
  },
};

const ItemsMasterDummyData = {
  Body: [
    [
      { id: "1", A: "ITM001", B: "Item One", C: "Electronics", D: "100.00" },
      { id: "2", A: "ITM002", B: "Item Two", C: "Hardware", D: "50.00" },
      { id: "3", A: "ITM003", B: "Item Three", C: "Software", D: "250.00" },
    ],
  ],
};

const ItemsMasterDrawer = ({ open, onClose }: ItemsMasterDrawerProps) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "90vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h6">Items Master</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, p: 2, minHeight: 0 }}>
        {open && <ItemsMasterGridContent />}
      </Box>
    </Drawer>
  );
};

const ItemsMasterGridContent = () => {
  useTreeGridInit(
    gridId,
    gridContainerId,
    ItemsMasterLayout,
    ItemsMasterDummyData,
  );

  return (
    <Box
      id={gridContainerId}
      sx={{
        width: "100%",
        height: "100%",
        borderRadius: 1,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
      }}
    />
  );
};

export default ItemsMasterDrawer;
