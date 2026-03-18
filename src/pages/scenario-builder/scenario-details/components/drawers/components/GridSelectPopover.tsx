import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  ClickAwayListener,
  InputAdornment,
  Divider,
  Portal,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

interface Option {
  id: string;
  label: string;
}

interface GridSelectPopoverProps {
  anchor: { top: number; left: number; width: number; height: number };
  options: Option[];
  onSelect: (value: string, id?: string) => void;
  onClose: () => void;
  showCreateNew?: boolean;
  onCreateNew?: (value: string) => void;
  placeholder?: string;
}

export const GridSelectPopover = ({
  anchor,
  options,
  onSelect,
  onClose,
  showCreateNew = false,
  onCreateNew,
  placeholder = "Search...",
}: GridSelectPopoverProps) => {
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      (option.label || "").toLowerCase().includes((search || "").toLowerCase()),
    );
  }, [options, search]);

  const showCreateOption =
    showCreateNew &&
    search.trim() !== "" &&
    !options.some(
      (opt) =>
        (opt.label || "").toLowerCase() === (search || "").trim().toLowerCase(),
    );

  return (
    <Portal>
      <Box
        sx={{
          position: "fixed",
          top: anchor.top + anchor.height + 4,
          left: anchor.left,
          minWidth: Math.max(anchor.width, 220),
          zIndex: 9999,
        }}
      >
        <ClickAwayListener onClickAway={onClose}>
          <Paper
            elevation={4}
            sx={{
              borderRadius: "8px",
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              maxHeight: "300px",
              boxShadow: "0px 8px 16px rgba(0,0,0,0.1)",
            }}
          >
            <Box sx={{ p: 0.75 }}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                placeholder={placeholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon
                        sx={{ color: "text.secondary", fontSize: 16 }}
                      />
                    </InputAdornment>
                  ),
                  sx: {
                    fontSize: "12px",
                    height: "32px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "divider",
                    },
                  },
                }}
              />
            </Box>

            <List sx={{ p: 0, overflow: "auto", flex: 1 }} dense>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <ListItem key={option.id} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        onSelect(option.label, option.id);
                        onClose();
                      }}
                      sx={{
                        py: 0.5,
                        px: 1.5,
                        "&:hover": {
                          bgcolor: "primary.light",
                          color: "primary.contrastText",
                        },
                      }}
                    >
                      <ListItemText
                        primary={option.label}
                        primaryTypographyProps={{
                          fontSize: "12px",
                          fontWeight: 500,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))
              ) : !showCreateOption ? (
                <Box sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    No results found
                  </Typography>
                </Box>
              ) : null}

              {showCreateOption && (
                <>
                  <Divider />
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => {
                        onCreateNew?.(search.trim());
                        onClose();
                      }}
                      sx={{
                        py: 1,
                        px: 2,
                        color: "primary.main",
                        "&:hover": { bgcolor: "grey.50" },
                      }}
                    >
                      <AddIcon sx={{ fontSize: 18, mr: 1 }} />
                      <ListItemText
                        primary={`Create "${search}"`}
                        primaryTypographyProps={{
                          fontSize: "12px",
                          fontWeight: 500,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                </>
              )}
            </List>
          </Paper>
        </ClickAwayListener>
      </Box>
    </Portal>
  );
};
