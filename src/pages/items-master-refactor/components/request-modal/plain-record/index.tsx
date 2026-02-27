import { Box } from "@mui/material";
import { RecordGrid } from "../record-grid";
import { recordItemMasterModal } from "@/pages/items-master/helpers/itemMasterTreeGridHelperFunction";

export const PlainRecord = ({
  record,
  multiple = false,
  module,
}: {
  record: any;
  multiple?: boolean;
  module?: string;
}) => {
  if (!record) return null;
  return (
    <Box
      sx={{
        backgroundColor: "white",
        border: "1px solid",
        borderColor: "#E8E8E8",
        borderRadius: 1,
        p: 2,
        overflow: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
        "-ms-overflow-style": "none",
      }}
    >
      {module === "item_master" ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {recordItemMasterModal(record?.items).map((rec: any, idx: number) => (
            <Box
              key={idx}
              sx={{
                borderBottom:
                  idx < record.length - 1 ? "1px solid #E8E8E8" : "none",
                pb: idx < record.length - 1 ? 2 : 0,
              }}
            >
              <RecordGrid record={rec} />
            </Box>
          ))}
        </Box>
      ) : multiple ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {record.map((rec: any, idx: number) => (
            <Box
              key={idx}
              sx={{
                borderBottom:
                  idx < record.length - 1 ? "1px solid #E8E8E8" : "none",
                pb: idx < record.length - 1 ? 2 : 0,
              }}
            >
              <RecordGrid record={rec} />
            </Box>
          ))}
        </Box>
      ) : (
        <RecordGrid record={record} />
      )}
    </Box>
  );
};
