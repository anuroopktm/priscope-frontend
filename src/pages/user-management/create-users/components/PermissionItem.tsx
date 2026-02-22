import { Box, Checkbox, Typography } from "@mui/material";

interface PermissionItemProps {
  label: string;
  desc: string;
  checked: boolean;
  handleChange: (v: boolean) => void;
}

const PermissionItem = ({
  label,
  desc,
  checked,
  handleChange,
}: PermissionItemProps) => (
  <Box
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
      onChange={(_e, v) => handleChange(v)}
      size="small"
      sx={{ mt: -0.5 }}
    />
    <Box>
      <Typography variant="body2" sx={{ fontWeight: 600, color: "#1A2B44" }}>
        {label}
      </Typography>
      <Typography
        variant="caption"
        sx={{ color: "#7A8699", display: "block", mt: 0.2 }}
      >
        {desc}
      </Typography>
    </Box>
  </Box>
);

export default PermissionItem;
