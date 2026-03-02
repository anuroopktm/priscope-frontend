import { Box, Typography } from "@mui/material";
import { RecordGrid } from "../record-grid";

export const LabeledRecord = ({ title, record }: { title: string; record: any }) => {
  if (!record) return null;

  return (
    <Box>
      <Typography
        sx={{
          width: "fit-content",
          fontWeight: 400,
          fontSize: 10,
          bgcolor: "#E8E8E8",
          p: 1,
          borderTopLeftRadius: 1,
          borderTopRightRadius: 1,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          backgroundColor: "white",
          border: "1px solid",
          borderColor: "#E8E8E8",
          borderRadius: 1,
          borderTopLeftRadius: 0,
          p: 2,
          overflow: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          "-ms-overflow-style": "none",
        }}
      >
        <RecordGrid record={record} />
      </Box>
    </Box>
  );
};