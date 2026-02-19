import React from "react";
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export interface DropdownMenuItem {
  id: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface DropdownMenuProps {
  label: string;
  items: DropdownMenuItem[];
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ label, items }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (onClick: () => void) => {
    onClick();
    handleClose();
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        aria-controls={open ? "dropdown-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        sx={{height:32
        }}
      >
        {label}
      </Button>
      <Menu
        id="dropdown-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {items.map((item) => (
          <MenuItem
            key={item.id}
            onClick={() => handleItemClick(item.onClick)}
            disabled={item.disabled}
          >
            {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default DropdownMenu;
