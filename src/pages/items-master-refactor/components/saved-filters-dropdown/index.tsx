import BookmarkIcon from "@/assets/items-master/bookmark-02 (1).svg";
import CloseIcon from "@/assets/items-master/multiplication-sign-white.svg";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import {
  Box,
  Button,
  ClickAwayListener,
  List,
  ListItem,
  ListItemText,
  Paper,
  Popper,
} from "@mui/material";
import React, { useState } from "react";
import type { SavedFiltersListFilters } from "../../helper/types";
import { useItemMasterStore } from "../../store/useItemMasterStore";
import { convertSavedFilter } from "@/pages/items-master/helpers/itemMasterTreeGridHelperFunction";
import { useListSavedFilter } from "@/services/queries/item-master-refactor/item-master-refactor.queries";

const SavedFiltersDropdown = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const gridInstance = useItemMasterStore((state) => state.gridRef);
  const setFilter = useItemMasterStore((state) => state.setFilter);

  const { data: listSavedFilters } = useListSavedFilter();

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const applySavedFilterToFilterRow = (filter: Record<string, string[]>) => {
    if (!gridInstance) return;
    const { cols, values, operators } = convertSavedFilter(filter);
    gridInstance.ChangeFilter(cols, values, operators, "false", false);
  };

  const handleSelect = (filter: SavedFiltersListFilters) => {
    setSelectedFilter(filter?.name);
    setFilter(filter?.filter);
    applySavedFilterToFilterRow(filter?.filter);
    setAnchorEl(null);
  };

  const handleClickCloseSavedFilter = () => {
    setFilter({});
    applySavedFilterToFilterRow({});
    setSelectedFilter(null);
  };

  return (
    <>
      {selectedFilter ? (
        <>
          <Button
            onClick={handleToggle}
            variant="contained"
            sx={{
              backgroundColor: "#144E72",
              color: "white",
            }}
            startIcon={
              <img src={BookmarkIcon} alt="Bookmark File" width={16} />
            }
            endIcon={
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                  handleClickCloseSavedFilter();
                }}
              >
                <img src={CloseIcon} alt="Log File" width={16} />
              </Box>
            }
          >
            {selectedFilter}
          </Button>
        </>
      ) : (
        <Button
          onClick={handleToggle}
          variant="contained"
          endIcon={<KeyboardArrowDownRoundedIcon />}
        >
          Saved Filters
        </Button>
      )}

      <Popper
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        placement="bottom-start"
      >
        <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
          <Paper
            sx={{
              mt: 1,
              p: 1,
              borderRadius: "12px",
              backgroundColor: "#fff",
              boxShadow: 4,
              minWidth: 200,
            }}
          >
            <List disablePadding>
              {listSavedFilters?.filters?.length &&
              listSavedFilters?.filters?.length > 0 ? (
                listSavedFilters?.filters
                  ?.filter((filter) => filter?.name?.trim())
                  .map((filter) => (
                    <ListItem
                      component="div"
                      key={filter?.name}
                      onClick={() => handleSelect(filter)}
                      sx={{
                        px: 2,
                        py: 1,
                        "&:hover": { backgroundColor: "#f0f0f0" },
                      }}
                    >
                      <ListItemText
                        primary={filter?.name}
                        sx={{ color: "#000" }}
                      />
                    </ListItem>
                  ))
              ) : (
                <ListItem>
                  <ListItemText primary="No saved filters" />
                </ListItem>
              )}
            </List>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  );
};

export default SavedFiltersDropdown;
