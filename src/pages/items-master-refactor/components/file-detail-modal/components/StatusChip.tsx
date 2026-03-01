
import { Chip } from "@mui/material";

interface statusProps {
  status: string;
}
const StatusChip = ({ status }: statusProps) => {
  const success = status === "Success";

  return (
    <Chip
      label={success ? "Success" : "Failed"}
      size="small"
      sx={{
        backgroundColor: success ? "#1FC16B1A" : "#FB37481A",
        color: success ? "#1FC16B" : "#D00416",
        fontSize: 12,
      }}
    />
  );
};
export default StatusChip;
