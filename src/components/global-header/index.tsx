import { AppBar, Box, Toolbar } from "@mui/material";
import { GlobalHeaderActions } from "./components/GlobalHeaderActions";
import { GlobalHeaderLogo } from "./components/GlobalHeaderLogo";
import { GlobalHeaderNavigation } from "./components/GlobalHeaderNavigation";

const GlobalHeader = () => {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar
        disableGutters
        sx={{ minHeight: "56px !important", px: 2, gap: 1 }}
      >
        <GlobalHeaderLogo />
        <GlobalHeaderNavigation />
        <Box sx={{ flexGrow: 1 }} />
        <GlobalHeaderActions />
      </Toolbar>
    </AppBar>
  );
};

export default GlobalHeader;
