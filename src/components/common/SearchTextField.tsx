import { Search } from "@mui/icons-material";
import type { TextFieldProps } from "@mui/material";
import { InputAdornment, TextField } from "@mui/material";
import debounce from "lodash.debounce";
import React, { useEffect, useMemo, useState } from "react";

interface SearchTextFieldProps extends Omit<TextFieldProps, "onChange"> {
  onSearch: (value: string) => void;
}

const SearchTextField = ({ onSearch, ...props }: SearchTextFieldProps) => {
  const [value, setValue] = useState<string>((props.value as string) || "");

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
    <TextField
      variant="outlined"
      placeholder="Search"
      size="small"
      {...props}
      value={value}
      onChange={handleChange}
      sx={{
        width: 400,
        "& .MuiOutlinedInput-root": {
          color: "background.paper",
          backgroundColor: "primary.main",
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
          <InputAdornment position="start" sx={{ mx: 1 }}>
            <Search sx={{ color: "background.paper", fontSize: 20 }} />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchTextField;
