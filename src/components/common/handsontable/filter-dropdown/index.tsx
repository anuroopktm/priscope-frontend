"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  Typography,
  InputBase,
  useTheme,
} from "@mui/material";
import SearchIcon from "@/assets/rate-libraries/search-01.svg";

interface FilterDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number };
  columnValues: (string | number)[];
  selectedValues: Set<string | number>;
  onFilterChange: (values: Set<string | number>) => void;
  columnName: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  isOpen,
  onClose,
  position,
  columnValues,
  selectedValues,
  onFilterChange,
}) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredValues = columnValues.filter((value) =>
    value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSelectAll = () => {
    const newSelected = new Set(filteredValues);
    onFilterChange(newSelected);
  };

  const handleClearAll = () => {
    const newSelected = new Set<string | number>();
    onFilterChange(newSelected);
  };

  const handleValueToggle = (value: string | number) => {
    const newSelected = new Set(selectedValues);
    if (newSelected.has(value)) {
      newSelected.delete(value);
    } else {
      newSelected.add(value);
    }
    onFilterChange(newSelected);
  };

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay for closing on click outside */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 9998,
        }}
        onClick={onClose}
      />
      {/* Popup container */}
      <Box
        sx={{
          position: "absolute",
          top: position.top + 8,
          left: Math.max(0, position.left - 234),
          zIndex: 9999,
          bgcolor: theme.palette.background.paper,
          border: 1,
          borderColor: "#BBBBBB",
          borderRadius: 8,
          boxShadow: 3,
          width: 248,
          maxHeight: 330,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Search Header */}
        <Box sx={{ padding: "8px", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              border: 1,
              borderColor: "#BBBBBB",
              borderRadius: 4,
              padding: "8px 12px",
              "&:focus-within": {
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            <img src={SearchIcon} alt="Search" width={16} />
            <InputBase
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search"
              sx={{
                fontSize: "0.875rem",
                flex: 1,
                // color:  "#144E72",
                "& input": {
                  padding: 0,
                },
              }}
            />
          </Box>
        </Box>

        {/* Select/Clear All */}
        <Box
          sx={{
            padding: "0px 8px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={handleSelectAll}
            size="small"
            variant="text"
            sx={{ fontWeight: 600, color: "#144E72" }}
          >
            Select all
          </Button>
          <Button
            onClick={handleClearAll}
            size="small"
            variant="text"
            sx={{ fontWeight: 600, color: "#144E72" }}
          >
            Clear all
          </Button>
        </Box>

        {/* Options List */}
        <Box
          sx={{
            maxHeight: 200,
            overflowY: "auto",
            flex: 1,
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,0.3)",
              borderRadius: "0px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "rgba(0,0,0,0.5)",
            },
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(0,0,0,0.3) transparent",
          }}
        >
          {filteredValues.length === 0 ? (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Typography sx={{ fontSize: "0.875rem", color: "#858585" }}>
                No results found
              </Typography>
            </Box>
          ) : (
            filteredValues.map((value, index) => (
              <Box
                key={`${value}-${index}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#f9f9f9" },
                }}
                onClick={() => handleValueToggle(value)}
              >
                <Checkbox
                  checked={selectedValues.has(value)}
                  onChange={() => handleValueToggle(value)}
                  size="small"
                  sx={{
                    p: 0,
                    pl: 1,
                    mr: 1.5,
                    borderRadius: 0,
                    color: "#144E72",
                    "&.Mui-checked": {
                      color: "#144E72",
                    },
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    color: "#1A2B44",
                    flex: 1,
                  }}
                >
                  {value === "" || value === null
                    ? "(Empty)"
                    : value.toString()}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </Box>
    </>
  );
};
