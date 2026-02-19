import { Button, ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledMenuButton = styled(Button)(({ theme }) => ({
  color: theme.palette.sidebar.text,
  textTransform: "none",
  borderRadius: 16,
  padding: "6px 16px",
  minHeight: 32,
  fontSize: theme.typography.body2.fontSize,
  fontWeight: 400,
  "&:hover": {
    backgroundColor: theme.palette.sidebar.hover,
  },
  "&.active": {
    backgroundColor: theme.palette.sidebar.highlight,
    color: theme.palette.sidebar.active,
    fontWeight: 600,
  },
}));

interface MenuButtonProps extends Omit<ButtonProps, "variant"> {
  isActive?: boolean;
}

export default function MenuButton({
  isActive,
  children,
  ...props
}: MenuButtonProps) {
  return (
    <StyledMenuButton {...props} className={isActive ? "active" : ""}>
      {children}
    </StyledMenuButton>
  );
}
