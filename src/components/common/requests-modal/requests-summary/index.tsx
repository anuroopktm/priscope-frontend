import { Box } from "@mui/material";
import { recordTransformers } from "@/utils/transformRequestsRecord";
import { LabeledRecord } from "../labeled-record";
import { PlainRecord } from "../plain-record";

export const RequestSummary = ({
  requestInfo,
  requestAction,
  sourceModule,
  module,
}: {
  requestInfo: any;
  requestAction: string;
  sourceModule: string;
  module: string;
}) => {
  const transformer =
    recordTransformers[sourceModule] || recordTransformers.default;

  // CASE: update → labelled Previous and Updated
  if (requestAction === "update") {
    const { old_record, new_record } = requestInfo?.[0] || {};
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
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

  // CASE: insert → single box, no label
  if (requestAction === "insert") {
    const { new_record } = requestInfo?.[0] || {};
    return (
      <PlainRecord
        record={module === "item_master" ? new_record : transformer(new_record)}
        module={module}
      />
    );
  }

  // CASE: bulk status change → all inside one box, no labels per record
  if (requestAction === "bulk_status_change") {
    return (
      <PlainRecord
        record={requestInfo.map((item: any) => transformer(item.new_record))}
        multiple
      />
    );
  }

  // fallback → no label, single box
  const infoObject =
    requestInfo?.[0]?.new_record || requestInfo?.[0]?.old_record || {};
  return <PlainRecord record={transformer(infoObject)} />;
};
