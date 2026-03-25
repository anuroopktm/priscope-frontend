import SearchIcon from "@/assets/actions/search.svg?react";
import type { TextFieldProps } from "@mui/material";
import { Box, Button, InputAdornment, TextField } from "@mui/material";
import debounce from "lodash.debounce";
import React, { useEffect, useMemo, useState } from "react";

interface SearchTextFieldProps extends Omit<TextFieldProps, "onChange"> {
  onSearch: (value: string) => void;
  onAdvancedSearchClick?: () => void;
  width?: string | number;
  containerSx?: object;
}

const SearchTextField = ({
  onSearch,
  onAdvancedSearchClick,
  width,
  containerSx,
  ...props
}: SearchTextFieldProps) => {
  const [value, setValue] = useState<string>((props.value as string) || "");

  useEffect(() => {
    setValue((props.value as string) || "");
  }, [props.value]);

  const debouncedSearch = useMemo(
    () =>
      debounce((searchValue: string) => {
        onSearch(searchValue);
      }, 500),
    [onSearch],
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    debouncedSearch(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        width: width || "auto",
        backgroundColor: "brand.tertiary",
        borderRadius: 1,
        px: 1,
        ...containerSx,
      }}
    >
      <TextField
        variant="outlined"
        placeholder="Search"
        size="small"
        {...props}
        value={value}
        onChange={handleChange}
        sx={{
          width: width || 400,
          "& .MuiOutlinedInput-root": {
            color: "background.paper",
            backgroundColor: "transparent",
            pl: 0.5,
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          },
          ...props.sx,
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ mr: 1 }}>
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      {onAdvancedSearchClick && (
        <Button
          variant="text"
          size="small"
          onClick={onAdvancedSearchClick}
          sx={{
            color: "white",
            "&:hover": {
              bgcolor: "transparent",
              textDecoration: "underline",
              textUnderlineOffset: 2,
            },
          }}
        >
          Advanced Search
        </Button>
      )}
    </Box>
  );
};

export default SearchTextField;
