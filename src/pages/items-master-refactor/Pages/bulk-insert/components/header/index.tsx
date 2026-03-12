import ColumnDropdown from "@/pages/items-master-refactor/components/columns-dropdown";
import CancelIcon from "@/assets/items-master/multiplication-sign-circle.svg";
import SaveIcon from "@/assets/items-master/bookmark-02.svg";
import { Box, Button } from "@mui/material";
import type { HeaderList } from "@/pages/items-master-refactor/types/types";

const BulkInsertHeader = ({
  headers,
  handleCancel,
  handleSave,
}: {
  headers: HeaderList[] | null;
  handleCancel: () => void;
  handleSave: () => void;
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        pt: 2,
        px: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: 1,
        }}
      >
        <ColumnDropdown headers={headers} />
        <Button
          variant="contained"
          onClick={handleCancel}
          startIcon={<img src={CancelIcon} alt="Cancel" width={16} />}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          startIcon={<img src={SaveIcon} alt="Save" width={16} />}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default BulkInsertHeader;
