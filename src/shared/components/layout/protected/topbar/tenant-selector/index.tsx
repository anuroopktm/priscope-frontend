"use client";
import * as React from "react";
import { Menu, MenuItem, Chip } from "@mui/material";
import { KeyboardArrowDown as ArrowDownIcon } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { TENANTS } from "@/shared/constants/tenant.constants";

const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.sidebar.highlight,
  color: theme.palette.sidebar.text,
  fontSize: theme.typography.body2.fontSize,
  fontWeight: 600,
  "& .MuiChip-deleteIcon": {
    color: theme.palette.sidebar.text,
  },
  "&:hover": {
    backgroundColor: theme.palette.sidebar.hover,
  },
}));

export default function TenantSelector() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedTenant, setSelectedTenant] = React.useState(TENANTS[0].name);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTenantSelect = (tenantName: string) => {
    setSelectedTenant(tenantName);
    handleClose();
  };

  return (
    <>
      <StyledChip
        label={selectedTenant}
        deleteIcon={<ArrowDownIcon />}
        onDelete={handleClick}
        onClick={handleClick}
      />
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {TENANTS.map((tenant) => (
          <MenuItem
            key={tenant.id}
            onClick={() => handleTenantSelect(tenant.name)}
          >
            {tenant.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
