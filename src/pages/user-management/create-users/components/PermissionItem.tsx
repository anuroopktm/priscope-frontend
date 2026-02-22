import { Box, Checkbox, Typography } from "@mui/material";

interface PermissionItemProps {
  label: string;
  desc: string;
  checked: boolean;
  handleChange: () => void;
}

const PermissionItem = ({
  label,
  desc,
  checked,
  handleChange,
}: PermissionItemProps) => (
  <Box
    onClick={handleChange}
    sx={{
      mb: 3,
      display: "flex",
      alignItems: "flex-start",
      gap: 1,
      cursor: "pointer",
    }}
  >
    <Checkbox
      checked={checked}
      onChange={handleChange}
      size="small"
      sx={{ mt: -0.5 }}
    />
    <Box>
      <Typography
        variant="body1"
        sx={{ fontWeight: 600, color: "#1A2B44", textTransform: "capitalize" }}
      >
        {label.replace("_", " ")}
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "#7A8699", display: "block", mt: 0.2 }}
      >
        {desc}
      </Typography>
    </Box>
  </Box>
);

export default PermissionItem;
