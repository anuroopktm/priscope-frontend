import googleIcon from "@/assets/login/google.svg";
import linkedinIcon from "@/assets/login/linkedin.svg";
import microsoftIcon from "@/assets/login/microsoft.svg";
import { IconButton, Stack } from "@mui/material";

const providers = [
  { icon: googleIcon, name: "Google" },
  { icon: microsoftIcon, name: "Microsoft" },
  { icon: linkedinIcon, name: "LinkedIn" },
];

const SocialAuthButtons = () => {
  return (
    <Stack direction="row" spacing={2} justifyContent="center">
      {providers.map(({ icon, name }) => (
        <IconButton variant="action" key={name} sx={{ borderRadius: 1 }}>
          <img src={icon} alt={name} width={24} height={24} />
        </IconButton>
      ))}
    </Stack>
  );
};

export default SocialAuthButtons;
