import { Box, Typography } from "@mui/material";

export const RecordGrid = ({ record }: { record: any }) => {
  if (!record) return null;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(${Object.keys(record).length}, 1fr)`,
        gap: 2,
        "& > *:not(:last-child)": {
          borderRight: "1px solid",
          borderColor: "#E8E8E8",
          pr: 2,
        },
      }}
    >
      {Object.entries(record).map(([key, value]) => (
        <Box key={key} sx={{ display: "flex", flexDirection: "column" }}>
          <Typography
            variant="body2"
            sx={{
              color: "#8E8E8E",
              fontWeight: 500,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {key.replace(/_/g, " ")}:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: "black",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {String(value)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};