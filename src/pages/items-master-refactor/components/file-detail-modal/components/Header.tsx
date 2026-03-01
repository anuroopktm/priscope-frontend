import {
  Box,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import CloseIcon from "@/assets/common/multiplication-sign.svg";
interface HeaderProps {
  alignment: "uploaded" | "downloaded";
  setAlignment: (value: "uploaded" | "downloaded") => void;
  filterOptions: { value: string; label: string }[];
  onClose: () => void;
}
const Header = ({
  alignment,
  setAlignment,
  filterOptions,
  onClose,
}: HeaderProps) => {
  const handleClose = () => {
    onClose();
    setAlignment("uploaded");
  };
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="h6" fontWeight={600}>
        Files
      </Typography>

      <Box display="flex" gap={2}>
        <ToggleButtonGroup
          value={alignment}
          exclusive
          onChange={(_, val) => val && setAlignment(val)}
          sx={{
            height: 32,
            border: "1px solid #144E72",
            "& .MuiToggleButton-root": {
              border: "none",
              color: "#144E72",
              px: 2,
              textTransform: "none",
              "&.Mui-selected": {
                backgroundColor: "#144E72",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#144E72",
                },
              },
            },
          }}
        >
          {filterOptions.map((option) => (
            <ToggleButton key={option.value} value={option.value}>
              {option.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <IconButton onClick={handleClose}>
          <img src={CloseIcon} alt="" />
        </IconButton>
      </Box>
    </Box>
  );
};
export default Header;
