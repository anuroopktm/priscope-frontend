import { Box } from "@mui/material";
import { recordTransformers } from "@/utils/transformRequestsRecord";
import { LabeledRecord } from "./labeled-record";
import { PlainRecord } from "./plain-record";

interface Props {
  requestInfo: any;
  requestAction: string;
}

export const RequestContent = ({ requestInfo, requestAction }: Props) => {
  const transformer =
    recordTransformers["item_master"] || recordTransformers.default;

  if (!requestInfo?.length) return null;

  switch (requestAction) {
    case "update": {
      const { old_record, new_record } = requestInfo[0];

      return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <LabeledRecord
            title="Previous Record"
            record={transformer(old_record)}
          />
          <LabeledRecord
            title="Updated Record"
            record={transformer(new_record)}
          />
        </Box>
      );
    }

    case "insert": {
      const { new_record } = requestInfo[0];
      return <PlainRecord record={new_record} />;
    }

    case "bulk_status_change": {
      const records = requestInfo.map((item: any) =>
        transformer(item.new_record)
      );
      return <PlainRecord record={records} multiple />;
    }

    default: {
      const fallback =
        requestInfo[0]?.new_record || requestInfo[0]?.old_record || {};
      return <PlainRecord record={transformer(fallback)} />;
    }
  }
};