import CreateColumnModal from "@/pages/items-master/components/add-column-modal";
import { getErrorMessage } from "@/utils/error-helper";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import {
  Box,
  Button,
  Checkbox,
  ClickAwayListener,
  FormControlLabel,
  FormGroup,
  InputBase,
  Paper,
  Popper,
  Typography,
  useTheme,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "@/store/useToastStore";
// import { hideColumn, showColumn } from "../../tree-grid/columns/Columns";
import { useItemMasterStore } from "../../store/useItemMasterStore";
import { DEfAULT_VISIBLE_COLUMNS } from "../../constants/headers.constants";
import { useAddHeader } from "@/services/queries/item-master-refactor/item-master-refactor.queries";
import type { HeaderList } from "../../types/types";
import { useState } from "react";
import { hideColumn, showColumn } from "../../tree-grid/Columns/Columns";

export interface ColumnDropdownProps {
  headers: HeaderList[] | null;
}

const ColumnDropdown = ({ headers }: ColumnDropdownProps) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [search, setSearch] = useState("");
  const [openAddColumnModal, setOpenAddColumnModal] = useState(false);
  const showToast = useToastStore((state) => state.showToast);
  const grid = useItemMasterStore((state) => state.gridRef);
  const checkBoxList = useItemMasterStore((state) => state.checkBoxList);
  const setCheckBoxList = useItemMasterStore((state) => state.setCheckBoxList);

  const queryClient = useQueryClient();
  const { mutate: mutateAddHeader, isPending: mutateAddHeaderPending } =
    useAddHeader();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl((prev) => (prev ? null : event.currentTarget));
  };

  const open = Boolean(anchorEl);

  const filteredHeaders = headers?.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase()),
  );

  const handleOpenAddColumnModal = () => {
    setAnchorEl(null);
    setOpenAddColumnModal(true);
  };
  const handleCloseAddColumnModal = () => {
    setOpenAddColumnModal(false);
  };

  const handleColumnVisibility = (column: string, isVisible: boolean) => {
    setCheckBoxList((prev) => ({
      ...prev,
      [column]: isVisible,
    }));
    if (isVisible) {
      showColumn(grid, column);
    } else {
      hideColumn(grid, column);
    }
  };

  const handleModalSubmit = (newColumnName: {
    label: string;
    dataType: string;
  }) => {
    const { label, dataType } = newColumnName;
    const payload = {
      data_type: dataType,
      name: label,
    };
    mutateAddHeader(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["listItemMasterHeaders"],
        });
        setCheckBoxList((prev) => ({
          ...prev,
          [label]: true,
        }));
        handleCloseAddColumnModal();
        handleColumnVisibility(label, true);
        showToast("Column added successfully!", "success");
      },
      onError: (error) => {
        showToast(
          getErrorMessage(error, "Failed to add column. Please try again."),
          "error",
        );
      },
    });
    setSearch("");
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        variant="contained"
        endIcon={<KeyboardArrowDownRoundedIcon />}
      >
        Columns
      </Button>

      <Popper open={open} anchorEl={anchorEl} placement="bottom-start">
        <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
          <Paper
            sx={{
              mt: 1,
              p: 1,
              borderRadius: "16px",
              gap: "4px",
              backgroundColor: theme.palette.common.white,
              boxShadow: 3,
              minWidth: 160,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1,
                py: 0.5,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "8px",
                mb: 1,
              }}
            >
              <InputBase
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ flex: 1, fontSize: 14, paddingX: "12px" }}
              />
            </Box>

            <Box sx={{ padding: "10px", maxHeight: 300, overflowY: "auto" }}>
              <FormGroup>
                {filteredHeaders && filteredHeaders?.length > 0 ? (
                  filteredHeaders?.map((header) => {
                    const isDefault = DEfAULT_VISIBLE_COLUMNS.includes(
                      header.label,
                    );
                    return (
                      <FormControlLabel
                        key={header.label}
                        control={
                          <Checkbox
                            disabled={isDefault}
                            checked={!!checkBoxList[header.label]}
                            onChange={(e) =>
                              handleColumnVisibility(
                                header.label,
                                e.target.checked,
                              )
                            }
                          />
                        }
                        label={header.label}
                        sx={{
                          color: isDefault
                            ? theme.palette.text.secondary
                            : theme.palette.text.primary,
                          opacity: isDefault ? 0.6 : 1,
                          fontSize: "14px",
                          fontWeight: 400,
                        }}
                      />
                    );
                  })
                ) : (
                  <Box
                    sx={{
                      textAlign: "center",
                      fontSize: 13,
                      py: 1,
                      mx: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography sx={{ fontSize: 16 }}>{search}</Typography>
                    <Typography
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenAddColumnModal();
                      }}
                      sx={{
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "14px",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Create new
                    </Typography>
                  </Box>
                )}
              </FormGroup>
            </Box>
          </Paper>
        </ClickAwayListener>
      </Popper>

      <CreateColumnModal
        open={openAddColumnModal}
        onClose={() => setOpenAddColumnModal(false)}
        onSubmit={handleModalSubmit}
        dataTypeOptions={["Integer", "String"]}
        defaultLabel={search}
        loading={mutateAddHeaderPending}
      />
    </>
  );
};

export default ColumnDropdown;
