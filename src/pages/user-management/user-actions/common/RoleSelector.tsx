import {
  Box,
  Skeleton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

interface RoleSelectorProps {
  value: string;
  onChange: (val: string) => void;
  roles: { id: string; name: string }[];
  loading?: boolean;
  disabled?: boolean;
}

const RoleSelector = ({
  value,
  onChange,
  roles,
  loading,
  disabled,
}: RoleSelectorProps) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ color: "brand.primary" }}>
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
          disabled={disabled}
          onChange={(_, val) => val !== null && onChange(val)}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            "& .MuiToggleButtonGroup-grouped": {
              border: "1px solid #D2D2D2",
              borderRadius: "20px !important",
              ml: "0 !important",
            },
          }}
        >
          {roles.map((r) => (
            <ToggleButton
              key={r.id}
              value={r.id}
              sx={(theme) => ({
                px: 3,
                py: 0.5,
                textTransform: "none",
                fontSize: "14px",
                color: "#777777",
                "&.Mui-selected": {
                  color: "brand.primary",
                  bgcolor: "transparent",
                  border: `1px solid ${theme.palette.brand.primary} !important`,
                },
              })}
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
