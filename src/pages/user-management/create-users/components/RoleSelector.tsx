import {
  Box,
  Skeleton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";

interface RoleSelectorProps {
  value: string;
  onChange: (value: string) => void;
  roles: { id: string; name: string }[];
  loading?: boolean;
}

const RoleSelector = ({
  value,
  onChange,
  roles,
  loading,
}: RoleSelectorProps) => {
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, color: "#1A2B44" }}>
        Permissions
      </Typography>
      <Typography variant="body1" sx={{ color: "#7A8699", mb: 2 }}>
        Choose any of the roles given below or choose custom access.
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Skeleton
            variant="rounded"
            width={80}
            height={32}
            sx={{ borderRadius: "20px" }}
          />
          <Skeleton
            variant="rounded"
            width={120}
            height={32}
            sx={{ borderRadius: "20px" }}
          />
          <Skeleton
            variant="rounded"
            width={100}
            height={32}
            sx={{ borderRadius: "20px" }}
          />
        </Box>
      ) : (
        <ToggleButtonGroup
          value={value}
          exclusive
          onChange={(_event, newValue) => onChange(newValue)}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            "& .MuiToggleButtonGroup-grouped": {
              border: "1px solid #D2D2D2 !important",
              borderRadius: "20px !important",
              ml: "0 !important",
            },
          }}
        >
          {roles.map((r) => (
            <ToggleButton
              key={r.id}
              value={r.id}
              sx={{
                px: 3,
                py: 0.5,
                textTransform: "none",
                fontSize: "14px",
                color: "#777777",
                "&.Mui-selected": {
                  color: theme.palette.brand.primary,
                  bgcolor: "transparent",
                  border: `1px solid ${theme.palette.brand.primary} !important`,
                },
              }}
            >
              {r.name}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}
    </Box>
  );
};

export default RoleSelector;
