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
import type { SavedFiltersListFilters } from "../../helpers/types";
import { useListSavedFilter } from "@/services/queries/item-master/item-master.queries";

type Props = {
  saveFilterJson: React.Dispatch<
    React.SetStateAction<Record<string, string[]>>
  >;
  applySavedFilterToFilterRow: (filter: Record<string, string[]>) => void;
};

const SavedFiltersDropdown = ({
  saveFilterJson,
  applySavedFilterToFilterRow,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const { data: listSavedFilters } = useListSavedFilter();

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleSelect = (filter: SavedFiltersListFilters) => {
    setSelectedFilter(filter?.name);
    saveFilterJson(filter?.filter);
    applySavedFilterToFilterRow(filter?.filter);
    setAnchorEl(null);
  };

  const handleClickCloseSavedFilter = () => {
    saveFilterJson({});
    applySavedFilterToFilterRow({});
    setSelectedFilter(null);
  };

  return (
    <>
      {selectedFilter ? (
        <>
          <Button
            onClick={handleToggle}
            sx={{
              padding: "8px 12px",
              backgroundColor: "primary.main",
              color: "white",
              "&:hover": {
                color: "white",
                bgcolor: "primary.main",
              },
              textTransform: "none",
              fontWeight: 600,
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
          sx={{
            padding: "8px 12px",
            color: "grey.300",
            "&:hover": {
              color: "white",
              bgcolor: "rgba(255, 255, 255, 0.1)",
            },
            textTransform: "none",
            fontWeight: 600,
          }}
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
