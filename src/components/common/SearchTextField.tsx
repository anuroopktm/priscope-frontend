import { Search } from "@mui/icons-material";
import { InputAdornment, TextField, useTheme } from "@mui/material";

import type { TextFieldProps } from "@mui/material";

const SearchTextField = (props: TextFieldProps) => {
    const theme = useTheme();

    return (
        <TextField
            variant="outlined"
            placeholder="Search"
            size="small"
            {...props}
            sx={{
                width: 400,
                "& .MuiOutlinedInput-root": {
                    color: theme.palette.background.paper,
                    backgroundColor: theme.palette.primary.main,
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
                        <Search
                            sx={{ color: theme.palette.background.paper, fontSize: 20 }}
                        />
                    </InputAdornment>
                ),
            }}
        />
    );
};

export default SearchTextField;
