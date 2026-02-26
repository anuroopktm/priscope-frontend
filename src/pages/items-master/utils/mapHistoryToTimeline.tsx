import type {
  TimelineUpdate,
  TimelineEntry,
} from "@/components/common/timeline";

export const mapHistoryToTimeline = (historyResponse: any): TimelineEntry[] => {
  if (!historyResponse?.history) return [];

  return historyResponse.history.map((entry: any) => {
    const user = entry.changed_by?.name ?? "Unknown";

    const date = new Date(entry.changed_at).toLocaleDateString("en-GB");
    const updates: TimelineUpdate[] = [];

    if (entry.updated_fields) {
      Object.entries(entry.updated_fields).forEach(([field, values]: any) => {
        updates.push({
          field: field.toUpperCase(),
          oldValue: values.old_value ?? "",
          newValue: values.new_value ?? "",
        });
      });
    }

    const comment =
      entry.comments?.length > 0 ? entry.comments[0].comment : undefined;

    return {
      user,
      date,
      updates,
      comment,
    };
  });
};
