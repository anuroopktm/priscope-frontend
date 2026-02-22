import { Box, Paper, useTheme } from "@mui/material";
import { useState } from "react";
import ActionHeader from "./components/ActionHeader";
import BasicInfoSection from "./components/BasicInfoSection";
import FooterActions from "./components/FooterActions";
import PermissionsSection from "./components/PermissionsSection";

const UserManagementCreateUserPage = () => {
  const theme = useTheme();
  const [role, setRole] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const handleRoleChange = (newRole: string | null) => {
    setRole(newRole);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        bgcolor: theme.palette.brand.background,
      }}
    >
      <ActionHeader />

      <Box sx={{ p: 2, flex: 1 }}>
        <Paper
          elevation={0}
          sx={{ p: 2, height: "calc(100vh - 144px)", overflowY: "auto" }}
        >
          <BasicInfoSection />

          <PermissionsSection
            role={role}
            onRoleChange={handleRoleChange}
            checked={checked}
            onCheckChange={setChecked}
          />

          <FooterActions />
        </Paper>
      </Box>
    </Box>
  );
};

export default UserManagementCreateUserPage;
