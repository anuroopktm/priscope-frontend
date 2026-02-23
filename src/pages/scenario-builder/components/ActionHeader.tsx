import {
  AddOutlined,
  BookmarkBorderOutlined,
  FilterListOutlined,
  KeyboardArrowDown,
  Search,
  StorageOutlined,
} from "@mui/icons-material";
import { Box, Button, InputAdornment, Stack, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import RequestsIcon from "@/assets/items-master/requests.svg";
import LogFileIcon from "@/assets/common/log-file-view.svg";


interface FilterProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setOpenRequestModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowFilesModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ActionHeader = ({
  searchQuery,
  setSearchQuery,
  setOpenRequestModal,
  setShowFilesModal,
}: FilterProps) => {
  const theme = useTheme();

  const handleRequestsClick = () => {
    setOpenRequestModal(true);
  };

  const handleFilesClick = () => {
    setShowFilesModal(true);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundImage: theme.palette.brand.background_gradient,
        pt: 2,
        px: 2,
      }}
    >
      {/* Left: Search Bar */}
      <TextField
        variant="outlined"
        placeholder="Search"
        size="small"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
        sx={{
          width: 250,
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ ml: 1, mr: 0.5 }}>
              <Search sx={{ color: "rgba(0, 0, 0, 0.54)", fontSize: 20 }} />
            </InputAdornment>
          ),
        }}
      />

      {/* Right: Actions */}
      <Stack direction="row" spacing={1} alignItems="center">
        <Button
          onClick={handleRequestsClick}
          sx={{
            padding: "8px 12px",
            color: theme.palette.grey[300],
            "&:hover": {
              color: "white",
              bgcolor: theme.palette.brand.hover,
            },
            textTransform: "none",
            fontWeight: 600,
          }}
          startIcon={<img src={RequestsIcon} alt={"request"} width={16} />}
        >
          Request
        </Button>
        {/* <Button startIcon={<DescriptionOutlined />}>Files</Button> */}
        <Button
          sx={{
            padding: "8px 12px",
            color: theme.palette.grey[300],
            "&:hover": {
              color: "white",
              bgcolor: "rgba(255, 255, 255, 0.1)",
            },
            textTransform: "none",
            fontWeight: 600,
          }}
          startIcon={<img src={LogFileIcon} alt="Log File" width={16} />}
          onClick={handleFilesClick}
        >
          Files
        </Button>

        {/* Columns Dropdown Mock */}
        <Button endIcon={<KeyboardArrowDown />}>Columns</Button>

        {/* Saved Filters Dropdown Mock */}
        <Button
          startIcon={<BookmarkBorderOutlined />}
          endIcon={<KeyboardArrowDown />}
        >
          Saved Filters
        </Button>

        {/* Show Filter */}
        <Button startIcon={<FilterListOutlined />}>Show Filter</Button>

        {/* Add Item */}
        <Button startIcon={<AddOutlined />}>Add Item</Button>

        {/* Import Data Dropdown */}
        <Button
          variant="contained"
          startIcon={<StorageOutlined />}
          endIcon={<KeyboardArrowDown />}
        >
          Import Data
        </Button>
      </Stack>
    </Box>
  );
};
