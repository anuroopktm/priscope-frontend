import { Box } from "@mui/material";
import { RecordGrid } from "../record-grid";
import { recordItemMasterModal } from "@/pages/items-master-refactor/helper";

export const PlainRecord = ({
  record,
  module,
}: {
  record: any;
  module?: string;
}) => {
  console.log(record, "record", module);
  if (!record || module !== "item_master") return null;
  console.log(record, "record");
  return (
    <Box
      sx={{
        backgroundColor: "white",
        border: "1px solid #E8E8E8",
        borderRadius: 1,
        p: 2,
        overflow: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
        "-ms-overflow-style": "none",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {recordItemMasterModal(record?.items).map((rec: any, idx: number) => (
          <Box
            key={idx}
            sx={{
              borderBottom:
                idx < recordItemMasterModal(record?.items).length - 1
                  ? "1px solid #E8E8E8"
                  : "none",
              pb: idx < recordItemMasterModal(record?.items).length - 1 ? 2 : 0,
            }}
          >
            <RecordGrid record={rec} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};
