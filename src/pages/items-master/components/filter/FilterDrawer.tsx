"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";

const sampleFilters = [
  {
    name: "Category",
    filterItems: [
      { name: "Clothing", checked: true },
      { name: "Electronics", checked: true },
      { name: "Eye Wear", checked: false },
    ],
  },
  {
    name: "Keyword",
    filterItems: [],
  },
  {
    name: "Customers",
    filterItems: [],
  },
];

type FilterState = {
  [sectionName: string]: {
    [itemName: string]: boolean;
  };
};

interface FilterDrawerProps {
  open: boolean;
  onClose?: () => void;
  filters?: typeof sampleFilters;
  navbarHeight?: number;
  filterHeight?: number;
  drawerWidth?: number;
}

const FilterDrawer = ({
  open,
  filters = sampleFilters,
  drawerWidth = 264,
}: FilterDrawerProps) => {
  const theme = useTheme();

  const [filterState, setFilterState] = useState<FilterState>(() => {
    const initialState: FilterState = {};
    filters.forEach((section) => {
      initialState[section.name] = section.filterItems.reduce(
        (acc: { [itemName: string]: boolean }, item) => {
          acc[item.name] = item.checked;
          return acc;
        },
        {},
      );
    });
    return initialState;
  });

  const handleCheckboxChange = (sectionName: string, itemName: string) => {
    setFilterState((prevState) => ({
      ...prevState,
      [sectionName]: {
        ...prevState[sectionName],
        [itemName]: !prevState[section.name][itemName],
      },
    }));
  };

  if (!open) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        right: 0,
        top: `${"81px" + "20px"}px`, // Align below navbar and filter
        width: drawerWidth,
        // height: `calc(100vh - ${navbarHeight + filterHeight}px - ${footerHeight}px + 30px)`, // Subtract footer height
        height: `calc(100vh - 161px)`, // Match MainContentContainer height
        bgcolor: theme.custom.surfaceBackground,
        borderLeft: "1px solid",
        borderColor: "divider",
        boxShadow: "-2px 0 8px rgba(0,0,0,0.1)",
        zIndex: 1200,
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s ease-in-out",
        borderRadius: "12px 0 0 12px",
      }}
    >
      <Box
        sx={{
          p: 2, // Add padding around the entire content
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Filter Sections */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            bgcolor: theme.custom.surfaceBackground,
          }}
        >
          {filters.map((section) => (
            <Accordion
              key={section.name}
              defaultExpanded
              disableGutters
              square
              sx={{
                bgcolor: theme.custom.surfaceBackground,
                boxShadow: "none",
                "&::before": {
                  display: "none",
                },
              }}
            >
              <AccordionSummary
                sx={{
                  flexDirection: "row-reverse",
                  borderTop: "none",
                  borderBottom: "none",
                  ".MuiAccordionSummary-content": {
                    marginLeft: 1,
                  },
                  minHeight: "unset",
                  "&.Mui-expanded": {
                    minHeight: "unset",
                  },
                }}
                expandIcon={<ExpandMoreIcon />}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {section.name}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {section.name === "Category" && (
                  <TextField
                    fullWidth
                    placeholder="Search Category"
                    size="small"
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}

                {section.filterItems.length > 0 ? (
                  <FormGroup>
                    {section.filterItems.map((item) => (
                      <FormControlLabel
                        key={item.name}
                        control={
                          <Checkbox
                            checked={
                              filterState?.[section.name]?.[item.name] || false
                            }
                            onChange={() =>
                              handleCheckboxChange(section.name, item.name)
                            }
                            size="small"
                          />
                        }
                        label={item.name}
                      />
                    ))}
                  </FormGroup>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {section.name === "Keyword"
                      ? "Enter keywords"
                      : `No ${section.name.toLowerCase()} selected`}
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* Footer Actions */}
        <Box
          sx={{
            borderTop: "1px solid",
            borderColor: "divider",
            pt: 2,
            pb: 2, // Add bottom padding to the footer
            display: "flex",
            gap: 1,
          }}
        >
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            size="small"
            sx={{ flex: 1 }}
            onClick={() => console.log("Saving filters:", filterState)}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            size="small"
            sx={{ flex: 1 }}
            onClick={() => {
              const cleared: Record<string, Record<string, boolean>> = {};
              filters.forEach((section) => {
                cleared[section.name] = {};
                section.filterItems.forEach((item) => {
                  cleared[section.name][item.name] = false;
                });
              });
              setFilterState(cleared);
            }}
          >
            Clear
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FilterDrawer;
