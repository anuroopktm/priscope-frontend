import { Button } from "@mui/material";
import CancelIcon from "@/assets/items-master/multiplication-sign-circle.svg";
import SaveIcon from "@/assets/items-master/bookmark-02.svg";
import ColumnDropdown, { type ColumnDropdownProps } from "../columns-dropdown";
import { theme } from "@/theme/theme";

const AddNewGridFilter = ({
  selectedColumns,
  setSelectedColumns,
  headerList,
  onCancel,
  onSave,
  handleColumnVisibility,
}: ColumnDropdownProps & { onCancel: () => void; onSave: () => void }) => {
  return (
    <>
      <ColumnDropdown
        handleColumnVisibility={handleColumnVisibility}
        selectedColumns={selectedColumns}
        setSelectedColumns={setSelectedColumns}
        headerList={headerList}
      />
      <Button
        onClick={onCancel}
        sx={{
          padding: "8px 12px",
          color: theme.palette.grey[300],
          "&:hover": {
            color: "white",
            bgcolor: "rgba(255, 255, 255, 0.1)",
          },
          textTransform: "none",
          fontWeight: 600,
        }}
        startIcon={<img src={CancelIcon} alt="Cancel" width={16} />}
      >
        Cancel
      </Button>
      <Button
        onClick={onSave}
        variant="contained"
        sx={{
          padding: "8px 12px",
          bgcolor:"#FFFFF",
          "&:hover": { bgcolor: theme.palette.primary.dark },
          textTransform: "none",
          borderRadius: "8px",
          fontWeight: 600,
        }}
        startIcon={<img src={SaveIcon} alt="Save" width={16} />}
      >
        Save
      </Button>
    </>
  );
};

export default AddNewGridFilter;
