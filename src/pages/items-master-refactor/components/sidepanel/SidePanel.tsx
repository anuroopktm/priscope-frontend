import { Box } from "@mui/material";

const SidePanel = ({
  isOpen,
  width,
  children,
}: {
  isOpen: boolean;
  width: number;
  children: React.ReactNode;
}) => {
  return (
    <Box
      sx={{
        width: isOpen ? width : 0,
        transition: "width 0.3s ease",
        overflow: "hidden",
        height: "100%",
        marginLeft: isOpen ? 1 : 0,
        background: "white",
        color: "black",
        display: "flex",
        flexDirection: "column",
        borderRadius: "8px 0 0 8px",
        boxShadow: isOpen ? "0px 0px 8px rgba(0,0,0,0.1)" : "none",
        zIndex: 2,
      }}
    >
      {children}
    </Box>
  );
};

export default SidePanel;
