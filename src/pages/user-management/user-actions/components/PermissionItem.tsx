import type { ResourcePrivilege } from "@/services/user-management/user-management.types";
import { Box, Checkbox, Typography } from "@mui/material";

interface PermissionItemProps {
  privilege: ResourcePrivilege;
  checked: boolean;
  disabled?: boolean;
  onToggle: (p: ResourcePrivilege) => void;
}

const PermissionItem = ({
  privilege,
  checked,
  disabled = false,
  onToggle,
}: PermissionItemProps) => {
  const handleToggle = () => !disabled && onToggle(privilege);

  return (
    <Box
      sx={{
        mb: 3,
        display: "flex",
        alignItems: "flex-start",
        gap: 1,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <Checkbox
        checked={checked}
        disabled={disabled}
        size="small"
        onChange={handleToggle}
        sx={{ mt: -0.5 }}
      />
      <Box
        onClick={!disabled ? handleToggle : undefined}
        sx={{ userSelect: "none" }}
      >
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            color: "#1A2B44",
            textTransform: "capitalize",
          }}
        >
          {privilege.display_name.replace("_", " ")}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#7A8699",
            display: "block",
            mt: 0.2,
          }}
        >
          {privilege.description.replace("_", " ")}
        </Typography>
      </Box>
    </Box>
  );
};

export default PermissionItem;
