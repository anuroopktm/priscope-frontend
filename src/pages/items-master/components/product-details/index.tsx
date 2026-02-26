// Product Details Drawer Component
// This component displays a right-side drawer with detailed product information.
// It overlays the main UI and is used in the Item Master table for row details.

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Box, Chip, Typography } from "@mui/material";
import React from "react";

// Props for the drawer: open state, item data, and close handler
interface ItemDetailsDrawerProps {
  open: boolean;
  item: any; // For now, use any to allow hardcoded fields
  onClose: () => void;
}

// Hardcoded suppliers and customers for demo purposes
const suppliers = [
  "Gillette",
  "Louis Vuitton",
  "Louis Vuitton",
  "Louis Vuitton",
  "Louis Vuitton",
  "Louis Vuitton",
  "Louis Vuitton",
  "Louis Vuitton",
  "Louis Vuitton",
];
const customers = [
  "Gillette",
  "Louis Vuitton",
  "Louis Vuitton",
  "Louis Vuitton",
  "Louis Vuitton",
  "Louis Vuitton",
  "Louis Vuitton",
  "Louis Vuitton",
  "Louis Vuitton",
];

// Hardcoded product details for demo
const details = [
  { label: "Size", value: "MD" },
  { label: "Fit", value: "Slim Fit" },
  { label: "Pattern", value: "Solid" },
  { label: "Sleeve", value: "Full Sleeve" },
  { label: "Color", value: "Yellow" },
  { label: "Occation", value: "Formal" },
  { label: "Fabric", value: "Cotton" },
  { label: "Collar", value: "Spread Collar" },
  { label: "Length", value: "Regular" },
];

// Main Drawer Component
const ItemDetailsDrawer: React.FC<ItemDetailsDrawerProps> = ({
  open,
  onClose,
}) => {
  // If not open, render nothing
  if (!open) return null;
  return (
    <>
      {/* Overlay: darkens the rest of the UI and closes drawer on click */}
      <Box
        onClick={onClose}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          bgcolor: "rgba(0,0,0,0.5)",
          zIndex: 1300,
          animation: "fadeIn 0.3s ease-in-out",
          "@keyframes fadeIn": {
            "0%": { opacity: 0 },
            "100%": { opacity: 1 },
          },
        }}
      />
      {/* Drawer: main container for product details */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "584px",
          height: "100vh",
          bgcolor: "#fff",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
          borderTopLeftRadius: 24, // Radius/3
          p: 3,
          zIndex: 1400,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          overflowY: "auto",
          animation: "slideIn 0.3s ease-out",
          "@keyframes slideIn": {
            "0%": { transform: "translateX(100%)" },
            "100%": { transform: "translateX(0%)" },
          },
        }}
      >
        {/* Header: contains back arrow, title, edit, and view full details button */}
        <Box
          sx={{
            width: "536px",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 4, // theme.spacing(4)
            opacity: 1,
            borderBottom: "1px solid #D2D2D2",
            transform: "rotate(0deg)",
            mx: "auto",
          }}
        >
          {/* Left: Back arrow and title */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Custom styled back button */}
            <Box
              onClick={onClose}
              sx={{
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #1A2B441A",
                borderRadius: "12px",
                background: "#FFFFFF",
                cursor: "pointer",
                mr: 1,
                transition: "background 0.2s, border 0.2s",
                "&:hover": {
                  background: "#F3F6F9",
                  borderColor: "#D2D2D2",
                },
              }}
            >
              {/* Bold, rounded left arrow */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 8H4M4 8L8 4M4 8L8 12"
                  stroke="#1A2B44"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Box>
            <Typography variant="h6" fontWeight={600} sx={{ fontSize: 20 }}>
              Product details
            </Typography>
          </Box>
          {/* Right: Edit icon and 'View full details' button */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Edit icon button */}
            <Box
              sx={{
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #144E72",
                borderRadius: "12px",
                background: "#fff",
                cursor: "pointer",
                transition: "background 0.2s",
                "&:hover": {
                  background: "#F9FAFB",
                },
              }}
            >
              <EditOutlinedIcon sx={{ fontSize: 20, color: "#1A2B44" }} />
            </Box>
          </Box>
        </Box>
        {/* Main content area: product info, suppliers, customers, and details */}
        <Box
          sx={{
            width: 536,
            height: "auto",
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            opacity: 1,
            transform: "rotate(0deg)",
            justifyContent: "flex-start",
          }}
        >
          {/* SKU, UPC, Category row */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 1 }}>
            <Typography sx={{ fontWeight: 400, fontSize: 14 }}>
              SKU:{" "}
              <Box component="span" sx={{ fontWeight: 700 }}>
                SHRT-YLW-MD
              </Box>
            </Typography>
            <Typography sx={{ fontWeight: 400, fontSize: 14 }}>
              UPC:{" "}
              <Box component="span" sx={{ fontWeight: 700 }}>
                886590056951
              </Box>
            </Typography>
            <Typography sx={{ fontWeight: 400, fontSize: 14 }}>
              Category:{" "}
              <Box component="span" sx={{ fontWeight: 700 }}>
                Clothing
              </Box>
            </Typography>
          </Box>
          {/* Product title */}
          <Typography sx={{ fontWeight: 600, fontSize: "20px", mb: 2 }}>
            Classic cotton shirt for everyday comfort
          </Typography>
          {/* Suppliers section: chips for each supplier */}
          <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
            <Typography sx={{ fontWeight: 500, minWidth: 90 }}>
              Supplier:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {suppliers.map((s, i) => (
                <Chip
                  key={i}
                  label={s}
                  sx={{
                    bgcolor: "#3B9EDC1A",
                    color: "#1A2B44",
                    fontWeight: 400,
                    fontSize: "12px",
                    borderRadius: "16px",
                    px: 2,
                    py: 0.5,
                    border: "none",
                    "& .MuiChip-label": {
                      px: 1,
                    },
                  }}
                  size="small"
                />
              ))}
            </Box>
          </Box>
          {/* Customers section: chips for each customer */}
          <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
            <Typography sx={{ fontWeight: 500, minWidth: 90 }}>
              Customers:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {customers.map((c, i) => (
                <Chip
                  key={i}
                  label={c}
                  sx={{
                    bgcolor: "#3B9EDC1A",
                    color: "primary.main",
                    fontWeight: 400,
                    fontSize: "12px",
                    borderRadius: "16px",
                    px: 2,
                    py: 0.5,
                    border: "none",
                    "& .MuiChip-label": {
                      px: 1,
                    },
                  }}
                  size="small"
                />
              ))}
            </Box>
          </Box>
          {/* Product details list: size, fit, etc. */}
          <Box>
            {details.map((d, i) => (
              <Box key={i} sx={{ display: "flex", mb: 1 }}>
                <Typography
                  sx={{ minWidth: 90, color: "primary.main", fontWeight: 400 }}
                >
                  {d.label}:
                </Typography>
                <Typography
                  sx={{ fontWeight: 700, color: "primary.main", ml: 1 }}
                >
                  {d.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ItemDetailsDrawer;
