import CreateColumnModal from "@/components/common/add-column-modal";
import { useAddHeader } from "@/services/queries/item-master/item-master.queries";
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
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import LoaderOverlay from "../../../../components/common/loader";
import { DEFAULT_VISIBLE_COLUMNS } from "../../constants/tableHeaders.constants";
export type SnackbarState = {
  message: string | null;
  severity: AlertColor;
};
export type AlertColor = "success" | "info" | "warning" | "error";

export interface ColumnDropdownProps {
  selectedColumns: Record<string, boolean>;
  setSelectedColumns: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  headerList: string[];
  handleColumnVisibility: (label: string, checked: boolean) => void;
  setHeaderLabels?: React.Dispatch<React.SetStateAction<string[]>>;
}

const ColumnDropdown: React.FC<ColumnDropdownProps> = ({
  selectedColumns,
  setSelectedColumns,
  headerList,
  handleColumnVisibility,
  setHeaderLabels,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [search, setSearch] = useState("");
  const [showCreateColumnModal, setShowCreateColumnModal] =
    useState<boolean>(false);
  const [, setSnackbar] = useState<SnackbarState>({
    message: null,
    severity: "info",
  });

  const queryClient = useQueryClient();
  const { mutate: mutateAddHeader, isPending: mutateAddHeaderPending } =
    useAddHeader();

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleCheckboxChange = (label: string, checked: boolean) => {
    if (DEFAULT_VISIBLE_COLUMNS.includes(label)) return;

    setSelectedColumns((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
    handleColumnVisibility(label, checked);
  };
  const filteredOptions = useMemo(() => {
    return headerList
      .map((header) => header)
      .filter((col) => col.toLowerCase().includes(search.toLowerCase()));
  }, [search, headerList]);

  const handleCreateNew = () => {
    setShowCreateColumnModal(true);
  };
  const handleModalClose = () => {
    setShowCreateColumnModal(false);
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
        setHeaderLabels?.((prev) => [...prev, label]);
        setSelectedColumns((prev) => ({ ...prev, [label]: true }));
        handleColumnVisibility(label, true);
        setSnackbar({
          message: "Header added successfully!",
          severity: "success",
        });
      },
      onError: () => {
        setSnackbar({
          message: "Failed to save changes. Please try again.,",
          severity: "warning",
        });
      },
    });
    setSearch("");
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleToggle}
        sx={{
          padding: "8px 12px",
          color: "#ffffff",
          "&:hover": {
            color: "white",
            bgcolor: "rgba(255, 255, 255, 0.1)",
          },
          textTransform: "none",
          fontWeight: 600,
        }}
        endIcon={<KeyboardArrowDownRoundedIcon />}
      >
        Columns
      </Button>
      <Popper
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        placement="bottom-start"
        sx={{ zIndex: 160 }}
      >
        <ClickAwayListener
          onClickAway={() => {
            if (!showCreateColumnModal) {
              setSearch("");
              setAnchorEl(null);
            }
          }}
        >
          <Paper
            sx={{
              mt: 1,
              p: 1,
              borderRadius: "16px",
              gap: "4px",
              backgroundColor: "common.white",
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
                border: 1,
                borderStyle: "solid",
                borderColor: "divider",
                borderRadius: "8px",
                mb: 1,
              }}
            >
              <InputBase
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ flex: 1, fontSize: 14, paddingX: "12px", border: "1px" }}
              />
            </Box>
            <Box sx={{ padding: "10px", maxHeight: 300, overflowY: "auto" }}>
              <FormGroup>
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((label) => {
                    const isDefault = DEFAULT_VISIBLE_COLUMNS.includes(label);
                    return (
                      <FormControlLabel
                        key={label}
                        control={
                          <Checkbox
                            checked={!!selectedColumns[label]}
                            onChange={(_, checked) =>
                              handleCheckboxChange(label, checked)
                            }
                            disabled={isDefault}
                          />
                        }
                        label={label}
                        sx={{
                          color: isDefault ? "text.secondary" : "text.primary",
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
                      color: "text.secondary",
                      fontSize: 13,
                      py: 1,
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                    }}
                  >
                    <Typography sx={{ color: "primary.main", fontSize: 16 }}>
                      {search}
                    </Typography>
                    <Typography
                      sx={{
                        color: "brand.tertiary",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateNew();
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
      {/* <AppSnackbar
        snackbar={snackbar}
        onClose={() => setSnackbar({ message: null, severity: "info" })}
      /> */}
      {mutateAddHeaderPending && <LoaderOverlay />}
      {showCreateColumnModal && (
        <CreateColumnModal
          onClose={handleModalClose}
          dataTypeOptions={["Integer", "String"]}
          onSubmit={handleModalSubmit}
          defaultLabel={search}
        />
      )}
    </>
  );
};

export default ColumnDropdown;
